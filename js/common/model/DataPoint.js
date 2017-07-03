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
   * @param {Vector2} velocity - velocity at this point, magnitude in m/s
   * @param {Vector2} acceleration - acceleration at this point, magnitude in m/s^2
   * @param {Vector2} dragForce - drag force at this point, magnitude in N
   * @param {number} forceGravity - force of gravity, in N
   * @constructor
   */
  function DataPoint(
                      time,
                      x,
                      y,
                      airDensity,
                      velocity,
                      acceleration,
                      dragForce,
                      forceGravity
  ) {
    
    // @public (read-only)
    this.time = time;
    this.position = Vector2.dirtyFromPool().setXY( x, y );
    this.airDensity = airDensity;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.dragForce = dragForce;
    this.forceGravity = forceGravity;
  }

  projectileMotion.register( 'DataPoint', DataPoint );

  return inherit( Object, DataPoint, {
    /**
     * Whether this dataPoint is equal to given dataPoint
     * @returns {boolean}
     * @public
     */
    equals: function( dataPoint ) {
      return this.position.equals( dataPoint.position )
        && this.time === dataPoint.time
        && this.airDensity === dataPoint.airDensity
        && this.velocity.equals( dataPoint.velocity )
        && this.acceleration.equals( dataPoint.acceleration )
        && this.dragForce.equals( dataPoint.dragForce )
        && this.forceGravity === this.forceGravity;
    }
  } );
} );

