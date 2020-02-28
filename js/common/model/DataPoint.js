// Copyright 2016-2020, University of Colorado Boulder

/**
 * A subtype of Vector2 that contains information about a data point on a trajectory.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import projectileMotion from '../../projectileMotion.js';

class DataPoint {

  /**
   * @param {number} time - total time since fire at this point on the trajectory, in s
   * @param {Vector2} position - position of the data point, with x and y, also called range and height, in m
   * @param {number} airDensity - air density of the atmosphere at this point, in kg/cu m
   * @param {Vector2} velocity - velocity at this point, magnitude in m/s
   * @param {Vector2} acceleration - acceleration at this point, magnitude in m/s^2
   * @param {Vector2} dragForce - drag force at this point, magnitude in N
   * @param {number} forceGravity - force of gravity, in N
   * @param {Object} [options]
   */
  constructor( time, position, airDensity, velocity, acceleration, dragForce, forceGravity, options ) {

    assert && assert( !isNaN( time ), 'DataPoint time is ' + time );
    assert && assert( time !== 0 || position.x === 0, 'Time is ' + time + 'but x is ' + position.x );

    options = merge( {
      apex: false,
      reachedGround: false
    }, options );

    // @public (read-only)
    this.time = time;
    this.position = position;
    this.airDensity = airDensity;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.dragForce = dragForce;
    this.forceGravity = forceGravity;
    this.apex = options.apex;
    this.reachedGround = options.reachedGround;
  }

  /**
   * Whether this dataPoint is equal to given dataPoint
   * @public
   *
   * @returns {boolean}
   */
  equals( dataPoint ) {
    return this.position.equals( dataPoint.position )
           && this.time === dataPoint.time
           && this.airDensity === dataPoint.airDensity
           && this.velocity.equals( dataPoint.velocity )
           && this.acceleration.equals( dataPoint.acceleration )
           && this.dragForce.equals( dataPoint.dragForce )
           && this.forceGravity === dataPoint.forceGravity;
  }

  /**
   * @public
   */
  dispose() {
    this.position.freeToPool();
    this.velocity.freeToPool();
    this.acceleration.freeToPool();
    this.dragForce.freeToPool();
  }
}

projectileMotion.register( 'DataPoint', DataPoint );
export default DataPoint;