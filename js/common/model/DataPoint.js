// Copyright 2016-2020, University of Colorado Boulder

/**
 * A subtype of Vector2 that contains information about a data point on a trajectory.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
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

DataPoint.DataPointIO = new IOType( 'DataPointIO', {
  valueType: DataPoint,
  documentation: 'A single data point on a projectile\'s trajectory, with the following data:<br><ul>' +
                 '<li>time (seconds): The time of the data point</li>' +
                 '<li>position (meters): the position of the point in model coordinates</li>' +
                 '<li>airDensity (kg/cu m): the air density when the point was collected</li>' +
                 '<li>velocity (m/s): the velocity of the projectile at the time when the point was collected</li>' +
                 '<li>acceleration (m/s^2): the acceleration of the projectile at the time when the point was collected</li>' +
                 '<li>dragForce (newtons): the acceleration of the projectile at the time when the point was collected</li>' +
                 '<li>forceGravity (newtons): the acceleration of the projectile at the time when the point was collected</li>' +
                 '<li>apex (boolean): if this data point was at the apex of a trajectory</li>' +
                 '<li>reachedGround (boolean): if this data point was collected when the projectile was on the ground</li></ul>',

  toStateObject: dataPoint => ( {
    time: NumberIO.toStateObject( dataPoint.time ),
    position: Vector2.Vector2IO.toStateObject( dataPoint.position ),
    airDensity: NumberIO.toStateObject( dataPoint.airDensity ),
    velocity: Vector2.Vector2IO.toStateObject( dataPoint.velocity ),
    acceleration: Vector2.Vector2IO.toStateObject( dataPoint.acceleration ),
    dragForce: Vector2.Vector2IO.toStateObject( dataPoint.dragForce ),
    forceGravity: NumberIO.toStateObject( dataPoint.forceGravity ),
    apex: dataPoint.apex,
    reachedGround: dataPoint.reachedGround
  } ),
  fromStateObject: stateObject => new DataPoint(
    NumberIO.fromStateObject( stateObject.time ),
    Vector2.Vector2IO.fromStateObject( stateObject.position ),
    NumberIO.fromStateObject( stateObject.airDensity ),
    Vector2.Vector2IO.fromStateObject( stateObject.velocity ),
    Vector2.Vector2IO.fromStateObject( stateObject.acceleration ),
    Vector2.Vector2IO.fromStateObject( stateObject.dragForce ),
    NumberIO.fromStateObject( stateObject.forceGravity ), {
      apex: stateObject.apex,
      reachedGround: stateObject.reachedGround
    }
  )
} );

projectileMotion.register( 'DataPoint', DataPoint );
export default DataPoint;