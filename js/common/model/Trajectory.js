// Copyright 2016, University of Colorado Boulder

/**
 * Model of a projectile
 * Notes: air resistance and altitude can immediately change the path of the projectile, whereas other parameters
 * like velocity, angle, mass, diameter, dragcoefficient only affect the next projectile fired
 * Units are meters, kilograms, and seconds (mks)
 * 
 * Atmospheric model algorithm is taken from https://www.grc.nasa.gov/www/k-12/airplane/atmosmet.html
 * Checked the values at http://www.engineeringtoolbox.com/standard-atmosphere-d_604.html
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DataPoint = require( 'PROJECTILE_MOTION/common/model/DataPoint' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
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

    // @public
    PropertySet.call( this, {
      totalTime: 0, // total time (s) since the projectile was fired
      x: 0,
      y: model.cannonHeightProperty.get(),
      mass: model.projectileMass,
      diameter: model.projectileDiameter,
      dragCoefficient: model.projectileDragCoefficient,
      xVelocity: model.launchVelocity * Math.cos( model.cannonAngle * Math.PI / 180 ),
      yVelocity: model.launchVelocity * Math.sin( model.cannonAngle * Math.PI / 180 ),
      airDensity: model.airDensity,

      // counts how old this projectile is
      rank: 0
    } );

    // @public did the trajectory path change in mid air due to air density change
    this.changedInMidAir = false;

    // TODO: velocity and acceleration vectors? Or keep as component variables

    // @public
    this.xVelocity = model.launchVelocity * Math.cos( model.cannonAngle * Math.PI / 180 );
    this.yVelocity = model.launchVelocity * Math.sin( model.cannonAngle * Math.PI / 180 );
    this.velocity = model.launchVelocity;
    this.xAcceleration = 0;
    this.yAcceleration = -ACCELERATION_DUE_TO_GRAVITY;
    this.xDragForce = 0;
    this.yDragForce = 0;
    this.forceGravity = -ACCELERATION_DUE_TO_GRAVITY * this.mass;

    // @public {ObservableArray.<DataPoint>} record points along the trajectory with critical information
    this.dataPoints = new ObservableArray();

    // add dataPoint for initial conditions
    this.dataPoints.push( new DataPoint(
      this.totalTime,
      this.x,
      this.y,
      this.airDensity,
      this.xVelocity,
      this.yVelocity,
      this.xAcceleration,
      this.yAcceleration,
      this.xDragForce,
      this.yDragForce,
      this.forceGravity
    ) );

    this.projectileObjects = new ObservableArray();

    // add first projectile object
    this.addProjectileObject();
  }

  projectileMotion.register( 'Trajectory', Trajectory );

  return inherit( PropertySet, Trajectory, {

    // @public animate projectile given {number} time step in seconds
    step: function( dt ) {
      var self = this;

      // All datapoints have been collected because we have reached the ground
      if ( this.reachedGround ) {
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0; // there is still acceleration due to gravity, but normal force makes net acceleration zero
        this.xDragForce = 0;
        this.yDragForce = 0;
        var finalDataPoint = new DataPoint(
          this.totalTime,
          this.x,
          this.y,
          this.airDensity,
          this.xVelocity,
          this.yVelocity,
          this.xAcceleration,
          this.yAcceleration,
          this.xDragForce,
          this.yDragForce,
          this.forceGravity
        );
        finalDataPoint.reachedGround = true; // add this special property to just the last datapoint collected for a trajectory
        this.dataPoints.push( finalDataPoint );

      }

      // Haven't reached ground, so continue collecting datapoints
      else {

        var newX = this.x + this.xVelocity * dt + 0.5 * this.xAcceleration * dt * dt;
        var newY = this.y + this.yVelocity * dt + 0.5 * this.yAcceleration * dt * dt;

        if ( newY <= 0 ) {
          this.reachedGround = true; // store the information that it has reached the ground
          // calculated by hand, the time it takes for projectile to reach the ground, within the next dt
          var timeToGround = ( -Math.sqrt( this.yVelocity * this.yVelocity - 2 * this.yAcceleration * this.y ) - this.yVelocity ) / this.yAcceleration;
          newX = this.x + this.xVelocity * timeToGround + 0.5 * this.xAcceleration * timeToGround * timeToGround;
          newY = 0;

          // Check if projectile landed on target, and scoreModel will handle the rest.
          this.projectileMotionModel.scoreModel.checkforScored( newX );
        }

        this.x = newX;
        this.y = newY;

        var newXVelocity = this.xVelocity + this.xAcceleration * dt;
        this.xVelocity = newXVelocity >= 0 ? newXVelocity : 0;
        this.yVelocity = this.yVelocity + this.yAcceleration * dt;

        // cross sectional area of the projectile
        var area = Math.PI * this.diameter * this.diameter / 4;
        var airDensity = this.projectileMotionModel.airDensity;

        this.xDragForce = 0.5 * airDensity * area * this.dragCoefficient * this.velocity * this.xVelocity;
        this.yDragForce = 0.5 * airDensity * area * this.dragCoefficient * this.velocity * this.yVelocity;

        this.xAcceleration = -this.xDragForce / this.mass;
        this.yAcceleration = -ACCELERATION_DUE_TO_GRAVITY - this.yDragForce / this.mass;

        this.totalTime += dt;

        this.velocity = Math.sqrt( this.xVelocity * this.xVelocity + this.yVelocity * this.yVelocity );

        this.dataPoints.push( new DataPoint(
          this.totalTime,
          this.x,
          this.y,
          this.airDensity,
          this.xVelocity,
          this.yVelocity,
          this.xAcceleration,
          this.yAcceleration,
          this.xDragForce,
          this.yDragForce,
          this.forceGravity
        ) );
      }

      // increment position of projectile objects, unless it has reached the end
      this.projectileObjects.forEach( function( object ) {
        if ( object.index < self.dataPoints.length - 1 ) {
          object.index ++;
          object.dataPointProperty.set( self.dataPoints.get( object.index ) );
        }
      } );
    },

    /**
     * Finds the {DataPoint|null} data point with the least euclidian distance to the point with
     * {number} x and {number} y coordinates, or null if there aren't haven't been any data points collected.
     * @public
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

    // @public returns a new {Trajectory} that is a copy of this one, but with one projectile object
    newTrajectory: function( projectileObject ) {
      var newTrajectory = new Trajectory( this.projectileMotionModel );
      newTrajectory.projectileObjects.clear();
      newTrajectory.projectileObjects.push( projectileObject );
      newTrajectory.dataPoints.clear();
      var i;
      for ( i = 0; i <= projectileObject.index; i++ ) {
        newTrajectory.dataPoints.add( this.dataPoints.get( i ) );
      }
      projectileObject.dataPointProperty.set( newTrajectory.dataPoints.get( projectileObject.index ) );

      // update trajectory's position
      // TODO: make less repetitive
      var dataPoint = projectileObject.dataPointProperty.get();
      newTrajectory.totalTimeProperty.set( dataPoint.time ); // total time (s) since the projectile was fired
      newTrajectory.xProperty.set( dataPoint.x );
      newTrajectory.yProperty.set( dataPoint.y );
      newTrajectory.xVelocityProperty.set( dataPoint.xVelocity );
      newTrajectory.yVelocityProperty.set( dataPoint.yVelocity );
      newTrajectory.airDensityProperty.set( dataPoint.airDensity );

      return newTrajectory;
    },

    // @public whether {boolean} this trajectory is equal to the one set up in the model
    equalsCurrent: function() {
      var model = this.projectileMotionModel;
      return !this.changedInMidAir
        && this.yProperty.initialValue === model.cannonHeightProperty.get()
        && this.massProperty.initialValue === model.projectileMass
        && this.diameterProperty.initialValue === model.projectileDiameter
        && this.dragCoefficientProperty.initialValue === model.projectileDragCoefficient
        && this.xVelocityProperty.initialValue === model.launchVelocity * Math.cos( model.cannonAngle * Math.PI / 180 )
        && this.yVelocityProperty.initialValue === model.launchVelocity * Math.sin( model.cannonAngle * Math.PI / 180 )
        && this.airDensityProperty.initialValue === model.airDensity;
    }

  } );
} );

