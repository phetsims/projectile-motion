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

    // @public {Property.<number>} total time since the projectile was fired, in seconds
    this.totalTimeProperty = new Property( 0 );

    // @public {Property.<number>} x coordinate of most recent data calculated
    this.xProperty = new Property( 0 );

    // @public {Property.<number>} y coordinate of most recent data calculated
    this.yProperty = new Property( model.cannonHeightProperty.get() );

    // @public {Property.<number>} mass of projectiles in kilograms
    this.massProperty = new Property( model.projectileMassProperty.get() );

    // @public {Property.<number>} diameter of projectiles in meters
    this.diameterProperty = new Property( model.projectileDiameterProperty.get() );

    // @public {Property.<number>} drag coefficient of the projectiles
    this.dragCoefficientProperty = new Property( model.projectileDragCoefficientProperty.get() );

    // @public {Property.<number>} x velocity of the most recent data collected
    this.xVelocityProperty = new Property( model.launchVelocityProperty.get() * Math.cos( model.cannonAngleProperty.get() * Math.PI / 180 ) );

    // @public {Property.<number>} y velocity of the most recent data collected
    this.yVelocityProperty = new Property( model.launchVelocityProperty.get() * Math.sin( model.cannonAngleProperty.get() * Math.PI / 180 ) );

    // @public {Property.<number>} air density of the most recent data collected
    this.airDensityProperty = new Property( model.airDensityProperty.get() );

    // @public {Property.<number>} counts how old this projectile is
    this.rankProperty = new Property( 0 );

    // @public did the trajectory path change in mid air due to air density change
    this.changedInMidAir = false;

    // TODO: velocity and acceleration vectors? Or keep as component variables

    // TODO: some of the following should be vars, others private
    // @public
    this.xVelocityProperty.set( model.launchVelocityProperty.get() * Math.cos( model.cannonAngleProperty.get() * Math.PI / 180 ) );
    this.yVelocityProperty.set( model.launchVelocityProperty.get() * Math.sin( model.cannonAngleProperty.get() * Math.PI / 180 ) );
    this.velocity = model.launchVelocityProperty.get();
    this.xAcceleration = 0;
    this.yAcceleration = -ACCELERATION_DUE_TO_GRAVITY;
    this.xDragForce = 0;
    this.yDragForce = 0;
    this.forceGravity = -ACCELERATION_DUE_TO_GRAVITY * this.massProperty.get();

    // @public {ObservableArray.<DataPoint>} record points along the trajectory with critical information
    this.dataPoints = new ObservableArray();

    // TODO: some of the following can just be constants instead of vars above
    // add dataPoint for initial conditions
    this.dataPoints.push( new DataPoint(
      this.totalTimeProperty.get(),
      this.xProperty.get(),
      this.yProperty.get(),
      this.airDensityProperty.get(),
      this.xVelocityProperty.get(),
      this.yVelocityProperty.get(),
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

  return inherit( Object, Trajectory, {
    // @public reset properties for this trajectory
    // TODO: I don't think this reset is ever called
    reset: function() {
      this.totalTimeProperty.reset();
      this.xProperty.reset();
      this.yProperty.reset();
      this.massProperty.reset();
      this.diameterProperty.reset();
      this.dragCoefficientProperty.reset();
      this.xVelocityProperty.reset();
      this.yVelocityProperty.reset();
      this.airDensityProperty.reset();
      this.rankProperty.reset();
    },

    // @public animate projectile given {number} time step in seconds
    step: function( dt ) {
      var self = this;

      // All datapoints have been collected because we have reached the ground
      if ( this.reachedGround ) {
        
        this.xVelocityProperty.set( 0 );
        this.yVelocityProperty.set( 0 );
        this.xAcceleration = 0;
        this.yAcceleration = 0; // there is still acceleration due to gravity, but normal force makes net acceleration zero
        this.xDragForce = 0;
        this.yDragForce = 0;

        var finalDataPoint = new DataPoint(
          this.totalTimeProperty.get(),
          this.xProperty.get(),
          this.yProperty.get(),
          this.airDensityProperty.get(),
          this.xVelocityProperty.get(),
          this.yVelocityProperty.get(),
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

        var newX = this.xProperty.get() + this.xVelocityProperty.get() * dt + 0.5 * this.xAcceleration * dt * dt;
        var newY = this.yProperty.get() + this.yVelocityProperty.get() * dt + 0.5 * this.yAcceleration * dt * dt;

        if ( newY <= 0 ) {
          this.reachedGround = true; // store the information that it has reached the ground
          // calculated by hand, the time it takes for projectile to reach the ground, within the next dt
          var timeToGround = ( -Math.sqrt( this.yVelocityProperty.get() * this.yVelocityProperty.get() - 2 * this.yAcceleration * this.yProperty.get() ) - this.yVelocityProperty.get() ) / this.yAcceleration;
          newX = this.xProperty.get() + this.xVelocityProperty.get() * timeToGround + 0.5 * this.xAcceleration * timeToGround * timeToGround;
          newY = 0;

          // Check if projectile landed on target, and score will handle the rest.
          this.projectileMotionModel.score.checkforScored( newX );
        }

        this.xProperty.set( newX );
        this.yProperty.set( newY );

        var newXVelocity = this.xVelocityProperty.get() + this.xAcceleration * dt;
        this.xVelocityProperty.set( newXVelocity >= 0 ? newXVelocity : 0 );
        this.yVelocityProperty.set( this.yVelocityProperty.get() + this.yAcceleration * dt );

        // cross sectional area of the projectile
        var area = Math.PI * this.diameterProperty.get() * this.diameterProperty.get() / 4;
        var airDensity = this.projectileMotionModel.airDensityProperty.get();

        this.xDragForce = 0.5 * airDensity * area * this.dragCoefficientProperty.get() * this.velocity * this.xVelocityProperty.get();
        this.yDragForce = 0.5 * airDensity * area * this.dragCoefficientProperty.get() * this.velocity * this.yVelocityProperty.get();

        this.xAcceleration = -this.xDragForce / this.massProperty.get();
        this.yAcceleration = -ACCELERATION_DUE_TO_GRAVITY - this.yDragForce / this.massProperty.get();

        this.totalTimeProperty.set( this.totalTimeProperty.get() + dt );

        this.velocity = Math.sqrt( this.xVelocityProperty.get() * this.xVelocityProperty.get() + this.yVelocityProperty.get() * this.yVelocityProperty.get() );

        this.dataPoints.push( new DataPoint(
          this.totalTimeProperty.get(),
          this.xProperty.get(),
          this.yProperty.get(),
          this.airDensityProperty.get(),
          this.xVelocityProperty.get(),
          this.yVelocityProperty.get(),
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
        && this.massProperty.initialValue === model.projectileMassProperty.get()
        && this.diameterProperty.initialValue === model.projectileDiameterProperty.get()
        && this.dragCoefficientProperty.initialValue === model.projectileDragCoefficientProperty.get()
        && this.xVelocityProperty.initialValue === model.launchVelocityProperty.get() * Math.cos( model.cannonAngleProperty.get() * Math.PI / 180 )
        && this.yVelocityProperty.initialValue === model.launchVelocityProperty.get() * Math.sin( model.cannonAngleProperty.get() * Math.PI / 180 )
        && this.airDensityProperty.initialValue === model.airDensityProperty.get();
    }

  } );
} );

