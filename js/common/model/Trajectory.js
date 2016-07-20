// Copyright 2016, University of Colorado Boulder

/**
 * Model of a projectile
 * Notes: air resistance and altitude can immediately change the path of the trajectory, whereas other parameters
 * like velocity, angle, mass, diameter, dragcoefficient only affect the next projectile fired
 * Units are meters, kilograms, and seconds (mks)
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
      // initial values
      x: 0,
      y: model.height,
      mass: model.mass,
      diameter: model.diameter,
      dragCoefficient: model.dragCoefficient,
      xVelocity: model.velocity * Math.cos( model.angle * Math.PI / 180 ),
      yVelocity: model.velocity * Math.sin( model.angle * Math.PI / 180 )
    } );

    // initial values
    this.reachedGround = false;

    this.xVelocity = model.velocity * Math.cos( model.angle * Math.PI / 180 );
    this.yVelocity = model.velocity * Math.sin( model.angle * Math.PI / 180 );

    this.velocity = model.velocity;

    this.xAcceleration = 0;
    this.yAcceleration = -ACCELERATION_DUE_TO_GRAVITY;
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

      var airDensity; // not constant, will change due to altitude

      if ( this.projectileMotionModel.airResistanceOn ) {

        // atmospheric model, algorithm from https://www.grc.nasa.gov/www/k-12/airplane/atmosmet.html
        // checked values at http://www.engineeringtoolbox.com/standard-atmosphere-d_604.html
        var altitude = this.projectileMotionModel.altitude;
        var temperature;
        var pressure;
        if ( altitude < 11000 ) {
          // troposphere
          temperature = 15.04 - 0.00649 * altitude;
          pressure = 101.29 * Math.pow( ( temperature + 273.1 ) / 288.08, 5.256 );
        } else if ( altitude < 25000 ) {
          // lower stratosphere
          temperature = -56.46;
          pressure = 22.65 * Math.exp( 1.73 - 0.000157 * altitude );
        } else {
          // altitude >= 25000 meters, upper stratosphere
          temperature = -131.21 + 0.00299 * altitude;
          pressure = 2.488 * Math.pow( ( temperature + 273.1 ) / 216.6, -11.388 );
        }

        airDensity = pressure / ( 0.2869 * ( temperature + 273.1 ) );
      } else {
        // air resistance is turned off
        airDensity = 0;
      }

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
        var timeToGround = ( -Math.sqrt( this.yVelocity * this.yVelocity - 2 * this.yAcceleration * this.y ) - this.yVelocity )/ this.yAcceleration;
        newX = this.x + this.xVelocity * timeToGround + 0.5 * this.xAcceleration * timeToGround * timeToGround;
        newY = 0;

        // check if projectile landed on target
        this.projectileMotionModel.scoreModel.checkforScored( newX );
      }

      this.x = newX;
      this.y = newY;
      this.xVelocity = newXVelocity;
      this.yVelocity = newYVelocity;

      this.velocity = Math.sqrt( this.xVelocity * this.xVelocity + this.yVelocity * this.yVelocity );
    }
  } );
} );

