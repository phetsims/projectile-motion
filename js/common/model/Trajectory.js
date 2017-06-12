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
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  // constants
  var ACCELERATION_DUE_TO_GRAVITY = ProjectileMotionConstants.ACCELERATION_DUE_TO_GRAVITY;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function Trajectory( model ) {
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

    // @public {Property.<number>} counts how old this projectile is
    this.rankProperty = new Property( 0 );

    // @public did the trajectory path change in mid air due to air density change
    this.changedInMidAir = false;

    // TODO: velocity and acceleration vectors? Or keep as component variables

    // @public {ObservableArray.<DataPoint>} record points along the trajectory with critical information
    this.dataPoints = new ObservableArray();

    // add dataPoint for initial conditions
    this.dataPoints.push( new DataPoint(
      0, // total time elapsed
      0, // x position
      model.cannonHeightProperty.get(), // y position
      model.airDensityProperty.get(), // air density
      model.launchVelocityProperty.get() * Math.cos( model.cannonAngleProperty.get() * Math.PI / 180 ), // x velocity
      model.launchVelocityProperty.get() * Math.sin( model.cannonAngleProperty.get() * Math.PI / 180 ), // y velocity
      0, // x acceleration
      -ACCELERATION_DUE_TO_GRAVITY, // y acceleration
      0, // x drag force
      0, // y drag force
      -ACCELERATION_DUE_TO_GRAVITY * this.mass // force gravity
    ) );

    // @public {ObservableArray.<Object: { {number} index, {Property.<DataPoint>} dataPointProperty>}
    this.projectileObjects = new ObservableArray();

    // add first projectile object
    this.addProjectileObject();
  }

  projectileMotion.register( 'Trajectory', Trajectory );

  return inherit( Object, Trajectory, {

    // @public animate projectile given {number} time step in seconds
    step: function( dt ) {
      var self = this;
      var previousPoint = this.dataPoints.get( this.dataPoints.length - 1 );

      // Haven't reached ground, so continue collecting datapoints
      if ( !this.reachedGround ) {

        var newX = previousPoint.x + previousPoint.xVelocity * dt + 0.5 * previousPoint.xAcceleration * dt * dt;
        var newY = previousPoint.y + previousPoint.yVelocity * dt + 0.5 * previousPoint.yAcceleration * dt * dt;

        var newXVelocity = previousPoint.xVelocity + previousPoint.xAcceleration * dt;
        var newYVelocity = previousPoint.yVelocity + previousPoint.yAcceleration * dt;
        var newVelocity = Math.sqrt( newXVelocity * newXVelocity + newYVelocity * newYVelocity );

        // cross sectional area of the projectile
        var area = Math.PI * this.diameter * this.diameter / 4;
        var airDensity = this.projectileMotionModel.airDensityProperty.get();

        var newXDragForce = 0.5 * airDensity * area * this.dragCoefficient * newVelocity * newXVelocity;
        var newYDragForce = 0.5 * airDensity * area * this.dragCoefficient * newVelocity * newYVelocity;

        // Has reached ground or below
        if ( newY <= 0 ) {
          this.reachedGround = true; // store the information that it has reached the ground
          
          // recalculate by hand, the time it takes for projectile to reach the ground, within the next dt
          var timeToGround = ( -Math.sqrt( previousPoint.yVelocity * previousPoint.yVelocity - 2 * previousPoint.yAcceleration * previousPoint.y ) - previousPoint.yVelocity ) / previousPoint.yAcceleration;
          newX = previousPoint.x + previousPoint.xVelocity * timeToGround + 0.5 * previousPoint.xAcceleration * timeToGround * timeToGround;
          newY = 0;

          var finalDataPoint = new DataPoint(
            previousPoint.time,
            newX,
            newY,
            previousPoint.airDensity,
            0, // x velocity
            0, // y velocity
            0, // x acceleration
            0, // y acceleration
            0, // x drag force
            0, // y drag force
            previousPoint.forceGravity
          );

          finalDataPoint.reachedGround = true; // add this special property to just the last datapoint collected for a trajectory
          this.dataPoints.push( finalDataPoint );
        }

        // Still in the air
        else {
          this.dataPoints.push( new DataPoint(
            previousPoint.time + dt,
            newX,
            newY,
            airDensity,
            newXVelocity,
            newYVelocity,
            -newXDragForce / this.mass, // x acceleration
            -ACCELERATION_DUE_TO_GRAVITY - newYDragForce / this.mass, // y acceleration
            newXDragForce,
            newYDragForce,
            previousPoint.forceGravity
          ) );
        }
      }

      // increment position of projectile objects, unless it has reached the end
      this.projectileObjects.forEach( function( object ) {
        if ( object.index < self.dataPoints.length - 1 ) {
          object.index ++;
          object.dataPointProperty.set( self.dataPoints.get( object.index ) );
        }
        // if it has just reached the end, check if landed on target
        else if ( object.index === self.dataPoints.length - 1 ) {
          object.index++;
          self.projectileMotionModel.score.scoreIfWithinTarget( object.dataPointProperty.get().x );
        }
      } );
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
      var minDistance = nearestPoint.distanceXY( x, y );

      // Search through datapoints for the smallest distance. If there are two datapoints with equal distance, the one
      // later in total time since fired is chosen.
      var i;
      for ( i = 0; i < this.dataPoints.length; i++ ) {
        var currentPoint = this.dataPoints.get( i );
        var currentDistance = currentPoint.distanceXY( x, y );

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

      // clear all the projectile objects and add just one
      newTrajectory.projectileObjects.clear();
      newTrajectory.projectileObjects.push( projectileObject );

      // clear all the data points and then add up to where the current flying projectile is
      newTrajectory.dataPoints.clear();
      var i;
      for ( i = 0; i <= projectileObject.index; i++ ) {
        newTrajectory.dataPoints.add( this.dataPoints.get( i ) );
      }
      projectileObject.dataPointProperty.set( newTrajectory.dataPoints.get( projectileObject.index ) );

      return newTrajectory;
    },

    // @public whether {boolean} this trajectory is equal to the one set up in the model
    currentModelEqualsSelf: function() {
      var initialPoint = this.dataPoints.get( 0 );
      var model = this.projectileMotionModel;
      return !this.changedInMidAir
        && initialPoint.y === model.cannonHeightProperty.get()
        && this.mass === model.projectileMassProperty.get()
        && this.diameter === model.projectileDiameterProperty.get()
        && this.dragCoefficient === model.projectileDragCoefficientProperty.get()
        && initialPoint.xVelocity === model.launchVelocityProperty.get() * Math.cos( model.cannonAngleProperty.get() * Math.PI / 180 )
        && initialPoint.yVelocity === model.launchVelocityProperty.get() * Math.sin( model.cannonAngleProperty.get() * Math.PI / 180 )
        && initialPoint.airDensity === model.airDensityProperty.get();
    }

  } );
} );

