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
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var DataPoint = require( 'PROJECTILE_MOTION/common/model/DataPoint' );
  // var Vector2 = require( 'DOT/Vector2' );

  // constants
  var ACCELERATION_DUE_TO_GRAVITY = ProjectileMotionConstants.ACCELERATION_DUE_TO_GRAVITY;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function Projectile( model ) {
    this.projectileMotionModel = model;

    if ( model.selectedProjectileObjectProperty ) {
      this.projectileObject = model.selectedProjectileObjectProperty.get(); // may be undefined
    }

    // @public
    PropertySet.call( this, {
      totalTime: 0, // total time (s) since the projectile was fired
      x: 0,
      y: model.cannonHeight,
      mass: model.projectileMass,
      diameter: model.projectileDiameter,
      dragCoefficient: model.projectileDragCoefficient,
      xVelocity: model.launchVelocity * Math.cos( model.cannonAngle * Math.PI / 180 ),
      yVelocity: model.launchVelocity * Math.sin( model.cannonAngle * Math.PI / 180 ),

      // counts how old this projectile is
      projectilesInModelAfterSelfFiredCount: 0
    } );

    // @public is the projectile on the ground?
    this.reachedGround = false;

    // TODO: velocity and acceleration vectors

    // @public
    this.xVelocity = model.launchVelocity * Math.cos( model.cannonAngle * Math.PI / 180 );
    this.yVelocity = model.launchVelocity * Math.sin( model.cannonAngle * Math.PI / 180 );
    this.velocity = model.launchVelocity;
    this.xAcceleration = 0;
    this.yAcceleration = -ACCELERATION_DUE_TO_GRAVITY;

    // @public {ObservableArray.<DataPoint>} record points along the trajectory with critical information
    this.dataPoints = new ObservableArray();

    // add data point for initial conditions
    this.dataPoints.push( new DataPoint( this.totalTime, this.x, this.y, model.airDensity ) );
  }

  projectileMotion.register( 'Projectile', Projectile );

  return inherit( PropertySet, Projectile, {

    // @public animate projectile given {number} time step in seconds
    step: function( dt ) {

      // Stops moving projectile has reached ground
      if ( this.reachedGround ) {
        this.xVelocity = 0;
        this.yVelocity = 0;
        return;
      }

      var newX = this.x + this.xVelocity * dt + 0.5 * this.xAcceleration * dt * dt;
      var newY = this.y + this.yVelocity * dt + 0.5 * this.yAcceleration * dt * dt;

      if ( newY <= 0 ) {
        this.reachedGround = true;

        // calculated by hand, the time it takes for projectile to reach the ground, within the next dt
        var timeToGround = ( -Math.sqrt( this.yVelocity * this.yVelocity - 2 * this.yAcceleration * this.y ) - this.yVelocity ) / this.yAcceleration;
        newX = this.x + this.xVelocity * timeToGround + 0.5 * this.xAcceleration * timeToGround * timeToGround;
        newY = 0;

        // Check if projectile landed on target, and scoreModel will handle the rest.
        this.projectileMotionModel.scoreModel.checkforScored( newX );
      }

      var newXVelocity = this.xVelocity + this.xAcceleration * dt;
      var newYVelocity = this.yVelocity + this.yAcceleration * dt;

      var airDensity = this.projectileMotionModel.airDensity;

      // cross sectional area of the projectile
      var area = Math.PI * this.diameter * this.diameter / 4;

      var dragForceX = 0.5 * airDensity * area * this.dragCoefficient * this.velocity * this.xVelocity;
      var dragForceY = 0.5 * airDensity * area * this.dragCoefficient * this.velocity * this.yVelocity;

      // TODO: in calculating new position, new acceleration is used, but current velocities are used
      var newXAcceleration = -dragForceX / this.mass;
      var newYAcceleration = -ACCELERATION_DUE_TO_GRAVITY - dragForceY / this.mass;

      this.totalTime += dt;
      this.x = newX;
      this.y = newY;
      this.xVelocity = newXVelocity;
      this.yVelocity = newYVelocity;
      this.xAcceleration = newXAcceleration;
      this.yAcceleration = newYAcceleration;

      this.velocity = Math.sqrt( this.xVelocity * this.xVelocity + this.yVelocity * this.yVelocity );

      this.dataPoints.push( new DataPoint( this.totalTime, this.x, this.y, airDensity ) );
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
    }

  } );
} );

