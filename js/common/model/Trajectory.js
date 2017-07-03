// Copyright 2016, University of Colorado Boulder

/**
 * Model of a trajectory.
 * One trajectory can have multiple projectiles on its path.
 * Air resistance and altitude can immediately change the path of the projectiles in the air.
 * Velocity, angle, mass, diameter, dragcoefficient only affect the next projectile fired.
 * Units are meters, kilograms, and seconds (mks)
 * 
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DataPoint = require( 'PROJECTILE_MOTION/common/model/DataPoint' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  // var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var ObservableArray = require( 'AXON/ObservableArray' );
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
    this.rankProperty = new Property( 0 );

    function incrementRank() {
      self.rankProperty.value++;
    }

    model.updateRanksEmitter.addListener( incrementRank );

    // @public did the trajectory path change in mid air due to air density change
    this.changedInMidAir = false;

    // @public {ObservableArray.<DataPoint>} record points along the trajectory with critical information
    this.dataPoints = new ObservableArray();

    var initialPoint = new DataPoint(
      0, // total time elapsed
      0, // x position
      model.cannonHeightProperty.get(), // y position
      model.airDensityProperty.get(), // air density
      Vector2.dirtyFromPool().setPolar( model.launchVelocityProperty.value, model.cannonAngleProperty.value * Math.PI / 180 ), // velocity
      Vector2.createFromPool( 0, -model.gravityProperty.get() ), // acceleration
      Vector2.createFromPool( 0, 0 ), // drag force
      -model.gravityProperty.get() * this.mass // force gravity
    );

    // add dataPoint for initial conditions
    this.dataPoints.push( initialPoint );
    model.tracer.updateDataIfWithinRange( initialPoint );

    // @public {ObservableArray.<Object: { {number} index, {Property.<DataPoint>} dataPointProperty>}
    this.projectileObjects = new ObservableArray();

    // add first projectile object
    this.addProjectileObject();

    this.disposeTrajectory = function() {
      model.updateRanksEmitter.removeListener( incrementRank );
    };
  }

  projectileMotion.register( 'Trajectory', Trajectory );

  return inherit( Object, Trajectory, {

    // @public animate projectile given {number} time step in seconds
    step: function( dt ) {
      var previousPoint = this.dataPoints.get( this.dataPoints.length - 1 );

      // Haven't reached ground, so continue collecting datapoints
      if ( !this.reachedGround ) {

        var newX = previousPoint.position.x + previousPoint.velocity.x * dt + 0.5 * previousPoint.acceleration.x * dt * dt;
        var newY = previousPoint.position.y + previousPoint.velocity.y * dt + 0.5 * previousPoint.acceleration.y * dt * dt;
        
        var newVelocity = Vector2.dirtyFromPool().setXY( previousPoint.velocity.x + previousPoint.acceleration.x * dt, previousPoint.velocity.y + previousPoint.acceleration.y * dt );

        // cross sectional area of the projectile
        var area = Math.PI * this.diameter * this.diameter / 4;
        var airDensity = this.projectileMotionModel.airDensityProperty.get();
        var gravity = this.projectileMotionModel.gravityProperty.get();

        var newXDragForce = 0.5 * airDensity * area * this.dragCoefficient * newVelocity.magnitude() * newVelocity.x;
        var newYDragForce = 0.5 * airDensity * area * this.dragCoefficient * newVelocity.magnitude() * newVelocity.y;

        // Has reached ground or below
        if ( newY <= 0 ) {
          this.reachedGround = true; // store the information that it has reached the ground
          
          // recalculate by hand, the time it takes for projectile to reach the ground, within the next dt
          var timeToGround = ( -Math.sqrt( previousPoint.velocity.y * previousPoint.velocity.y - 2 * previousPoint.acceleration.y * previousPoint.position.y ) - previousPoint.velocity.y ) / previousPoint.acceleration.y;
          newX = previousPoint.position.x + previousPoint.velocity.x * timeToGround + 0.5 * previousPoint.acceleration.x * timeToGround * timeToGround;
          newY = 0;

          var newPoint = new DataPoint(
            previousPoint.time + timeToGround,
            newX,
            newY,
            airDensity,
            Vector2.createFromPool( 0, 0 ), // velocity
            Vector2.createFromPool( 0, 0 ), // acceleration
            Vector2.createFromPool( 0, 0 ), // drag force
            -gravity * this.mass
          );

          newPoint.reachedGround = true; // add this special property to just the last datapoint collected for a trajectory
        }

        // Still in the air
        else {
          newPoint = new DataPoint(
            previousPoint.time + dt,
            newX,
            newY,
            airDensity,
            newVelocity,
            Vector2.createFromPool( -newXDragForce / this.mass, -gravity - newYDragForce / this.mass ), // acceleration
            Vector2.createFromPool( newXDragForce, newYDragForce ),
            -gravity * this.mass
          );

        }
        
        this.dataPoints.push( newPoint );
        this.projectileMotionModel.tracer.updateDataIfWithinRange( newPoint );
        this.projectileMotionModel.updateDavidIfWithinRange( newPoint.position );
      }

      // increment position of projectile objects, unless it has reached the end
      var i;
      for( i = 0; i < this.projectileObjects.length; i ++ ) {
        var object = this.projectileObjects.get( i );
        if ( object.index < this.dataPoints.length - 1 ) {
          object.index ++;
          object.dataPointProperty.set( this.dataPoints.get( object.index ) );
        }
        // if it has just reached the end, check if landed on target
        else if ( !object.checkedScore ) {
          this.projectileMotionModel.numberOfMovingProjectilesProperty.value --;
          this.projectileMotionModel.score.scoreIfWithinTarget( object.dataPointProperty.get().position.x );
          object.checkedScore = true;
        }
      }
    },

    /**
     * @public
     * @returns {DataPoint|null} the data point with the least euclidian distance to the point with
     * {number} x and {number} y coordinates, or null if there aren't haven't been any data points collected.
     */
    getNearestPoint: function( x, y ) {
      if ( this.dataPoints.length === 0 ) {
        return null;
      }

      // First, set nearest point and corresponding distance to the first datapoint.
      var nearestPoint = this.dataPoints.get( 0 );
      var minDistance = nearestPoint.position.distanceXY( x, y );

      // Search through datapoints for the smallest distance. If there are two datapoints with equal distance, the one
      // later in total time since fired is chosen.
      var i;
      for ( i = 0; i < this.dataPoints.length; i++ ) {
        var currentPoint = this.dataPoints.get( i );
        var currentDistance = currentPoint.position.distanceXY( x, y );

        if ( currentDistance <= minDistance ) {
          nearestPoint = currentPoint;
          minDistance = currentDistance;
        }

      }
      return nearestPoint;
    },

    // @public add a projectile object that starts at the first data point
    addProjectileObject: function() {
      this.projectileObjects.push( { index: 0, dataPointProperty: new Property( this.dataPoints.get( 0 ) ) } );
    },

    // @returns {Trajectory} a new trajectory that is a copy of this one, but with one projectile object
    // @public
    newTrajectory: function( projectileObject ) {

      // create a brand new trajectory
      var newTrajectory = new Trajectory( this.projectileMotionModel );

      // clear all the data points and then add up to where the current flying projectile is
      newTrajectory.dataPoints.clear();
      var i;
      for ( i = 0; i <= projectileObject.index; i++ ) {
        newTrajectory.dataPoints.add( this.dataPoints.get( i ) );
      }
      projectileObject.dataPointProperty.set( newTrajectory.dataPoints.get( projectileObject.index ) );
      
      // clear all the projectile objects and add just one
      newTrajectory.projectileObjects.clear();
      newTrajectory.projectileObjects.push( projectileObject );

      return newTrajectory;
    },

    // @public whether {boolean} this trajectory is equal to the one set up in the model
    equals: function( trajectory ) {
      var thisInitialPoint = this.dataPoints.get( 0 );
      var trajectoryInitialPoint = trajectory.dataPoints.get( 0 );
      return !this.changedInMidAir
        && this.projectileObjectType === trajectory.projectileObjectType
        && this.diameter === trajectory.diameter
        && this.mass === trajectory.mass
        && this.dragCoefficient === trajectory.dragCoefficient
        && thisInitialPoint.equals( trajectoryInitialPoint );
    },

    // @public memory management
    dispose: function() {
      var i;
      for ( i = 0; i < this.dataPoints.length; i++ ) {
        var point = this.dataPoints.get( i )
        point.position.freeToPool();
        point.velocity.freeToPool();
        point.acceleration.freeToPool();
        point.dragForce.freeToPool();
      }
      this.disposeTrajectory();
    }

  } );
} );

