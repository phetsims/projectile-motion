// Copyright 2016-2017, University of Colorado Boulder

/**
 * Model of a trajectory.
 * One trajectory can have multiple projectiles on its path.
 * Air resistance and altitude can immediately change the path of the projectiles in the air.
 * Velocity, angle, mass, diameter, dragcoefficient only affect the next projectile fired.
 * Units are meters, kilograms, and seconds (mks)
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DataPoint = require( 'PROJECTILE_MOTION/common/model/DataPoint' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Property = require( 'AXON/Property' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function Trajectory( model ) {
    var self = this;
    this.projectileMotionModel = model;

    if ( model.selectedProjectileObjectTypeProperty ) {
      this.projectileObjectType = model.selectedProjectileObjectTypeProperty.get(); // may be undefined
    }

    // @private {number} mass of projectiles in kilograms
    this.mass = model.projectileMassProperty.get();

    // @private {number} diameter of projectiles in meters
    this.diameter = model.projectileDiameterProperty.get();

    // @private {number} drag coefficient of the projectiles
    this.dragCoefficient = model.projectileDragCoefficientProperty.get();

    // @public {Property.<number>} counts how old this projectile is, which is listened by its opacity in view
    // The most recent trajectory fired has rank 0. The second recent has rank 1. The oldest still on screen has rank
    // max - 1.
    this.rankProperty = new NumberProperty( 0 );

    // Add one to the rank
    function incrementRank() {
      self.rankProperty.value++;
    }

    // Listen to whether this rank should be incremented
    model.updateTrajectoryRanksEmitter.addListener( incrementRank );

    // @public did the trajectory path change in mid air due to air density change
    this.changedInMidAir = false;

    // @public {ObservableArray.<DataPoint>} record points along the trajectory with critical information
    this.dataPoints = new ObservableArray();

    var velocity = Vector2.dirtyFromPool().setPolar(
      model.launchVelocityProperty.value,
      model.cannonAngleProperty.value * Math.PI / 180
    );

    // fix large drag errors
    if ( velocity.x < 0 ) {
      velocity.setXY( 0, 0 );
    }

    // cross sectional area of the projectile
    var area = Math.PI * this.diameter * this.diameter / 4;
    var airDensity = this.projectileMotionModel.airDensityProperty.get();
    var gravity = this.projectileMotionModel.gravityProperty.get();

    var dragForce = Vector2.dirtyFromPool().set( velocity ).multiplyScalar( 0.5 * airDensity * area * this.dragCoefficient * velocity.magnitude() );

    var initialPoint = new DataPoint(
      0, // total time elapsed
      Vector2.createFromPool( 0, model.cannonHeightProperty.get() ), // position
      model.airDensityProperty.get(), // air density
      velocity,
      Vector2.createFromPool( -dragForce.x / this.mass, -gravity - dragForce.y / this.mass ), // acceleration
      dragForce, // drag force
      -model.gravityProperty.get() * this.mass // force gravity
    );

    // @public {DataPoint||null} - contains reference to the apex point, or null if apex point doesn't exist/has been recorded
    this.apexPoint = null;

    // add dataPoint for initial conditions
    this.dataPoints.push( initialPoint );
    model.tracer.updateDataIfWithinRange( initialPoint );

    // @public {ObservableArray.<Object: { {number} index, {Property.<DataPoint>} dataPointProperty>}
    this.projectileObjects = new ObservableArray();

    // add first projectile object
    this.addProjectileObject();

    // @private
    this.disposeTrajectory = function() {
      this.apexPoint = null; // remove reference
      for ( var i = 0; i < this.dataPoints.length; i++ ) {
        var point = this.dataPoints.get( i );

        if ( point.numberOfOtherTrajectoriesUsingSelf ) {
          point.numberOfOtherTrajectoriesUsingSelf--;
        }
        else {
          point.position.freeToPool();
          point.velocity.freeToPool();
          point.acceleration.freeToPool();
          point.dragForce.freeToPool();
        }
      }
      this.projectileObjects.clear();
      model.updateTrajectoryRanksEmitter.removeListener( incrementRank );
    };
  }

  projectileMotion.register( 'Trajectory', Trajectory );

  return inherit( Object, Trajectory, {

    /**
     * Does calculations and steps the trajectory elements forward given a time step
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      var previousPoint = this.dataPoints.get( this.dataPoints.length - 1 );

      // Haven't reached ground, so continue collecting datapoints
      if ( !this.reachedGround ) {

        var apexExists = true;

        var newX = previousPoint.position.x + previousPoint.velocity.x * dt + 0.5 * previousPoint.acceleration.x * dt * dt;
        var newY = previousPoint.position.y + previousPoint.velocity.y * dt + 0.5 * previousPoint.acceleration.y * dt * dt;

        var newVelocity = Vector2.dirtyFromPool().setXY(
          previousPoint.velocity.x + previousPoint.acceleration.x * dt,
          previousPoint.velocity.y + previousPoint.acceleration.y * dt
        );

        // fix large drag errors by making it free fall
        if ( newVelocity.x < 0 ) {
          newVelocity.setXY( 0, 0 );
          apexExists = false;
        }

        if ( newX < previousPoint.position.x ) {
          newX = previousPoint.position.x;
          newY = previousPoint.position.y;
          apexExists = false;
        }

        // cross sectional area of the projectile
        var area = Math.PI * this.diameter * this.diameter / 4;
        var airDensity = this.projectileMotionModel.airDensityProperty.get();
        var gravity = this.projectileMotionModel.gravityProperty.get();

        var newDragForce = Vector2.dirtyFromPool().set( newVelocity ).multiplyScalar( 0.5 * airDensity * area * this.dragCoefficient * newVelocity.magnitude() );
        
        if ( previousPoint.velocity.y > 0 && newVelocity.y < 0 && apexExists ) { // passed apex
          var dtToApex = Util.linear( previousPoint.velocity.y, newVelocity.y, 0, dt, 0 );
          var apexX = Util.linear( 0, dt, previousPoint.position.x, newX, dtToApex );
          var apexY = Util.linear( 0, dt, previousPoint.position.y, newY, dtToApex );
          var apexVelocityX = Util.linear( 0, dt, previousPoint.velocity.x, newVelocity.x, dtToApex );
          var apexVelocityY = Util.linear( 0, dt, previousPoint.velocity.y, newVelocity.y, dtToApex );
          var apexDragX = Util.linear( 0, dt, previousPoint.dragForce.x, newDragForce.x, dtToApex );
          var apexDragY = Util.linear( 0, dt, previousPoint.dragForce.y, newDragForce.y, dtToApex );

          var apexPoint = new DataPoint(
            previousPoint.time + dtToApex,
            Vector2.createFromPool( apexX, apexY ),
            airDensity,
            Vector2.createFromPool( apexVelocityX, apexVelocityY ), // velocity
            Vector2.createFromPool( -apexDragX / this.mass, -gravity - apexDragY / this.mass ), // acceleration
            Vector2.createFromPool( apexDragX, apexDragY ), // drag force
            -gravity * this.mass
          );

          // add this special property to just the apex point collected for a trajectory
          apexPoint.apex = true;

          this.apexPoint = apexPoint; // save apex point

          // push it
          this.dataPoints.push( apexPoint );
          this.projectileMotionModel.tracer.updateDataIfWithinRange( apexPoint );
        }

        // Has reached ground or below
        if ( newY <= 0 ) {
          this.reachedGround = true; // store the information that it has reached the ground

          // recalculate by hand, the time it takes for projectile to reach the ground, within the next dt
          var timeToGround = ( previousPoint.acceleration.y === 0 ) ? -previousPoint.position.y / previousPoint.velocity.y : (
            -Math.sqrt( previousPoint.velocity.y * previousPoint.velocity.y - 2 * previousPoint.acceleration.y * previousPoint.position.y ) - previousPoint.velocity.y
          ) / previousPoint.acceleration.y;

          assert && assert( !isNaN( timeToGround ), 'timeToGround is ' + timeToGround );

          newX = previousPoint.position.x + previousPoint.velocity.x * timeToGround + 0.5 * previousPoint.acceleration.x * timeToGround * timeToGround;
          newY = 0;

          var newPoint = new DataPoint(
            previousPoint.time + timeToGround,
            Vector2.createFromPool( newX, newY ),
            airDensity,
            Vector2.createFromPool( 0, 0 ), // velocity
            Vector2.createFromPool( 0, 0 ), // acceleration
            Vector2.createFromPool( 0, 0 ), // drag force
            -gravity * this.mass
          );

          // add this special property to just the last datapoint collected for a trajectory
          newPoint.reachedGround = true;
        }

        // Still in the air
        else {
          newPoint = new DataPoint(
            previousPoint.time + dt,
            Vector2.createFromPool( newX, newY ),
            airDensity,
            newVelocity,
            Vector2.createFromPool( -newDragForce.x / this.mass, -gravity - newDragForce.y / this.mass ), // acceleration
            newDragForce,
            -gravity * this.mass
          );

        }

        // add point, and update tracer tool and David
        this.dataPoints.push( newPoint );
        this.projectileMotionModel.tracer.updateDataIfWithinRange( newPoint );
      }

      // keep track of old objects that need to be removed
      var projectileObjectsToRemove = [];

      // increment position of projectile objects, unless it has reached the end
      for ( var i = 0; i < this.projectileObjects.length; i++ ) {
        var object = this.projectileObjects.get( i );
        if ( object.index < this.dataPoints.length - 1 ) {
          object.index++;
          object.dataPointProperty.set( this.dataPoints.get( object.index ) );
          if ( object.dataPointProperty.get().apex ) { // if on apex, increment to the next point to maintain true time step
            object.index++;
            object.dataPointProperty.set( this.dataPoints.get( object.index ) );
          }
        }
        
        // if it has just reached the end, check if landed on target and remove the last projectile
        else if ( !object.checkedScore ) {
          this.projectileMotionModel.numberOfMovingProjectilesProperty.value--;
          this.projectileMotionModel.score.scoreIfWithinTarget( object.dataPointProperty.get().position.x );
          object.checkedScore = true;

          // to help with memory, if this object has just landed, remove the last one (if it exists)
          if ( i !== 0 ) {
            projectileObjectsToRemove.push( this.projectileObjects.get( i - 1 ) );
          }
        }
      }

      // remove the objects that need to be removed
      this.projectileObjects.removeAll( projectileObjectsToRemove );
    },

    /**
     * Finds the dataPoint in this trajectory with the least euclidian distance to coordinates given,
     * or returns null if this trajectory has no datapoints
     * @public
     *
     * @param {number} x - coordinate in model
     * @param {number} y - coordinate in model
     * @returns {DataPoint|null}
     */
    getNearestPoint: function( x, y ) {
      if ( this.dataPoints.length === 0 ) {
        return null;
      }

      // First, set nearest point and corresponding distance to the first datapoint.
      var nearestPoint = this.dataPoints.get( 0 );
      var minDistance = nearestPoint.position.distanceXY( x, y );

      // Search through datapoints for the smallest distance. If there are two datapoints with equal distance, the one
      // with more time is chosen.
      for (  var i = 0; i < this.dataPoints.length; i++ ) {
        var currentPoint = this.dataPoints.get( i );
        var currentDistance = currentPoint.position.distanceXY( x, y );

        if ( currentDistance <= minDistance ) {
          nearestPoint = currentPoint;
          minDistance = currentDistance;
        }

      }
      return nearestPoint;
    },

    /**
     * Add a projectile object that starts at the first data point
     * @public
     */
    addProjectileObject: function() {
      this.projectileObjects.push( { index: 0, dataPointProperty: new Property( this.dataPoints.get( 0 ) ) } );
    },

    /**
     * Creates a new trajectory that is a copy of this one, but with one projectile object
     * @public
     *
     * @param {Object} projectileObject - provides the index and data points.
     * @returns {Trajectory}
     */
    newTrajectory: function( projectileObject ) {

      // create a brand new trajectory
      var newTrajectory = new Trajectory( this.projectileMotionModel );

      // clear all the data points and then add up to where the current flying projectile is
      newTrajectory.dataPoints.clear();
      for ( var i = 0; i <= projectileObject.index; i++ ) {

        assert && assert(
          this.dataPoints.get( 0 ).position.x === 0,
          'Initial point x is not zero but ' + this.dataPoints.get( 0 ).position.x
        );

        // add one to the number of trajectories using this datapoint
        this.dataPoints.get( i ).numberOfOtherTrajectoriesUsingSelf++;
        newTrajectory.dataPoints.add( this.dataPoints.get( i ) );
      }

      // set the datapoint that indicates the location of the projectile object
      projectileObject.dataPointProperty.set( newTrajectory.dataPoints.get( projectileObject.index ) );

      // remove object from this trajectory, clear all the projectile objects in new trajectory and add just one
      newTrajectory.projectileObjects.clear();
      newTrajectory.projectileObjects.push( projectileObject );

      return newTrajectory;
    },

    /**
     * Whether this trajectory is equal to the one given
     * @public
     *
     * @param {Trajectory} trajectory
     * @returns {boolean}
     */
    equals: function( trajectory ) {
      var thisInitialPoint = this.dataPoints.get( 0 );
      var trajectoryInitialPoint = trajectory.dataPoints.get( 0 );
      return !this.changedInMidAir
        && !trajectory.changedInMidAir
        && this.projectileObjectType === trajectory.projectileObjectType
        && this.diameter === trajectory.diameter
        && this.mass === trajectory.mass
        && this.dragCoefficient === trajectory.dragCoefficient
        && thisInitialPoint.equals( trajectoryInitialPoint );
    },

    /**
     * Dispose this Trajectory, for memory management
     * @public
     */
    dispose: function() {
      this.disposeTrajectory();
    }

  } );
} );

