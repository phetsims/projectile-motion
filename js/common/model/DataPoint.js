// Copyright 2016, University of Colorado Boulder

/**
 * A subtype of Vector2 that contains information about a data point on a trajectory.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Vector2 = require( 'DOT/Vector2' );
 
  /**
   * @param {number} time - total time since fire at this point on the trajectory, in s
   * @param {number} x - x position of the data point, also called range, in m
   * @param {number} y - y position of the data point, also called height, in m
   * @param {number} airDensity - air density of the atmosphere at this point, in kg/cu m
   * @param {number} xVelocity - x component of velocity at this point, in m/s
   * @param {number} yVelocity - y component of velocity at this point, in m/s
   * @param {number} xAcceleration - x component of acceleration at this point, in m/s^2
   * @param {number} yAcceleration - y component of acceleration at this point, in m/s^2
   * @param {number} xDragForce - x component of drag force at this point, in N
   * @param {number} yDragForce - y component of drag force at this point, in N
   * @param {number} forceGravity - force of gravity, in N
   * @constructor
   */
  function DataPoint(
                      time,
                      x,
                      y,
                      airDensity,
                      xVelocity,
                      yVelocity,
                      xAcceleration,
                      yAcceleration,
                      xDragForce,
                      yDragForce,
                      forceGravity
  ) {
    
    // this.position = Vector2.dirtyFromPool( x, y );
    this.position = new Vector2( x, y );

    // @public (read-only)
    this.time = time;
    this.airDensity = airDensity;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.xAcceleration = xAcceleration;
    this.yAcceleration = yAcceleration;
    this.xDragForce = xDragForce;
    this.yDragForce = yDragForce;
    this.forceGravity = forceGravity;
  }

  projectileMotion.register( 'DataPoint', DataPoint );

  return inherit( Object, DataPoint );
} );

