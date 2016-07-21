// Copyright 2016, University of Colorado Boulder

/**
 * Model of a projectile
 * Notes: air resistance and altitude can immediately change the path of the trajectory, whereas other parameters
 * like velocity, angle, mass, diameter, dragcoefficient only affect the next projectile fired
 * Units are meters, kilograms, and seconds (mks)
 * 
 * Atmospheric model algorithm is taken from https://www.grc.nasa.gov/www/k-12/airplane/atmosmet.html
 * Checked values at http://www.engineeringtoolbox.com/standard-atmosphere-d_604.html
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

  // constants
  var ACCELERATION_DUE_TO_GRAVITY = ProjectileMotionConstants.ACCELERATION_DUE_TO_GRAVITY;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function Trajectory( model ) {
    this.projectileMotionModel = model;

    // @public
    PropertySet.call( this, {
      // initial values for the projectile
      // TODO: rename projectile, reference, trajectory holds just the data points
      time: 0, // seconds
      x: 0,
      y: model.cannonHeight,
      mass: model.mass,
      diameter: model.diameter,
      dragCoefficient: model.dragCoefficient,
      xVelocity: model.velocity * Math.cos( model.angle * Math.PI / 180 ),
      yVelocity: model.velocity * Math.sin( model.angle * Math.PI / 180 )
    } );

    // initial values
    this.reachedGround = false;

    // TODO: velocity and acceleration vectors
    this.xVelocity = model.velocity * Math.cos( model.angle * Math.PI / 180 );
    this.yVelocity = model.velocity * Math.sin( model.angle * Math.PI / 180 );

    this.velocity = model.velocity;

    this.xAcceleration = 0;
    this.yAcceleration = -ACCELERATION_DUE_TO_GRAVITY;

    this.dataPoints = new ObservableArray();
  }

  projectileMotion.register( 'Trajectory', Trajectory );

  return inherit( PropertySet, Trajectory, {

    // @public animate trajectory, not taking into account air resistance
    step: function( dt ) {

      // TODO: check for x is in the bounds // not working
      if ( this.reachedGround ) {
        this.xVelocity = 0;
        this.yVelocity = 0;
        return;
      }

      // Air density is not constant, will change due to altitude.
      var airDensity;

      // Air resistance is turned on.
      if ( this.projectileMotionModel.airResistanceOn ) {

        var altitude = this.projectileMotionModel.altitude;
        var temperature;
        var pressure;

        // TODO: object? atmospheric parameters
        if ( altitude < 11000 ) {
          // troposphere
          temperature = 15.04 - 0.00649 * altitude;
          pressure = 101.29 * Math.pow( ( temperature + 273.1 ) / 288.08, 5.256 );
        } else if ( altitude < 25000 ) {
          // lower stratosphere
          temperature = -56.46;
          pressure = 22.65 * Math.exp( 1.73 - 0.000157 * altitude );
        } else {
          // upper stratosphere (altitude >= 25000 meters)
          temperature = -131.21 + 0.00299 * altitude;
          pressure = 2.488 * Math.pow( ( temperature + 273.1 ) / 216.6, -11.388 );
        }

        airDensity = pressure / ( 0.2869 * ( temperature + 273.1 ) );
      }

      // Air resistance is turned off.
      else {
        airDensity = 0;
      }

      // cross sectional area of the projectile
      var area = Math.PI * this.diameter * this.diameter / 4;

      var dragForceX = 0.5 * airDensity * area * this.dragCoefficient * this.velocity * this.xVelocity;
      var dragForceY = 0.5 * airDensity * area * this.dragCoefficient * this.velocity * this.yVelocity;

      this.xAcceleration = -dragForceX / this.mass;
      this.yAcceleration = -ACCELERATION_DUE_TO_GRAVITY - dragForceY / this.mass;

      var newX = this.x + this.xVelocity * dt + 0.5 * this.xAcceleration * dt * dt;
      var newY = this.y + this.yVelocity * dt + 0.5 * this.yAcceleration * dt * dt;

      var newXVelocity = this.xVelocity + this.xAcceleration * dt;
      var newYVelocity = this.yVelocity + this.yAcceleration * dt;

      if ( newY <= 0 ) {
        this.reachedGround = true;

        // calculated by hand, the time it takes for projectile to reach the ground, within the next dt
        var timeToGround = ( -Math.sqrt( this.yVelocity * this.yVelocity - 2 * this.yAcceleration * this.y ) - this.yVelocity ) / this.yAcceleration;
        newX = this.x + this.xVelocity * timeToGround + 0.5 * this.xAcceleration * timeToGround * timeToGround;
        newY = 0;

        // Check if projectile landed on target, and scoreModel will handle the rest.
        this.projectileMotionModel.scoreModel.checkforScored( newX );
      }

      this.time += dt;
      this.x = newX;
      this.y = newY;
      this.xVelocity = newXVelocity;
      this.yVelocity = newYVelocity;

      this.velocity = Math.sqrt( this.xVelocity * this.xVelocity + this.yVelocity * this.yVelocity );

      this.dataPoints.push( new DataPoint( this.time, this.x, this.y ) );
    },



    // Finds the data point with the least 2d distance to the x and y coordinates
    // @public
    // @param {Number} x
    // @param {Number} y
    // @return {Object|null} - time, x, and y of nearest data point on trajectory pathto given coordinates
    getNearestPoint: function( x, y ) {

      // If there haven't been any data points collected, return null.
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

