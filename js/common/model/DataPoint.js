// Copyright 2016-2017, University of Colorado Boulder

/**
 * A subtype of Vector2 that contains information about a data point on a trajectory.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );

  /**
   * @param {number} time - total time since fire at this point on the trajectory, in s
   * @param {Vector2} position - position of the data point, with x and y, also called range and height, in m
   * @param {number} airDensity - air density of the atmosphere at this point, in kg/cu m
   * @param {Vector2} velocity - velocity at this point, magnitude in m/s
   * @param {Vector2} acceleration - acceleration at this point, magnitude in m/s^2
   * @param {Vector2} dragForce - drag force at this point, magnitude in N
   * @param {number} forceGravity - force of gravity, in N
   * @constructor
   */
  function DataPoint( time,
                      position,
                      airDensity,
                      velocity,
                      acceleration,
                      dragForce,
                      forceGravity ) {

    assert && assert( !isNaN( time ), 'DataPoint time is ' + time );
    assert && assert( time !== 0 || position.x === 0, 'Time is ' + time + 'but x is ' + position.x );

    // @public - a data point may be part of multiple trajectories, so this is to keep track of how many are
    // still using it, so we know when to dispose it.
    this.numberOfOtherTrajectoriesUsingSelf = 0;

    // @public (read-only)
    this.time = time;
    this.position = position;
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
     * @public
     *
     * @returns {boolean}
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

