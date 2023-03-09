// Copyright 2016-2023, University of Colorado Boulder

/**
 * A subtype of Vector2 that contains information about a data point on a trajectory.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import { CompositeSchema } from '../../../../tandem/js/types/StateSchema.js';
import projectileMotion from '../../projectileMotion.js';

type DataPointOptions = {
  apex?: boolean;
  reachedGround?: boolean;
};

export type DataPointStateObject = {
  time: number;
  position: Vector2StateObject;
  airDensity: number;
  velocity: Vector2StateObject;
  acceleration: Vector2StateObject;
  dragForce: Vector2StateObject;
  forceGravity: number;
  apex: boolean;
  reachedGround: boolean;
};

class DataPoint {
  public readonly time: number;
  public readonly position: Vector2;
  public readonly airDensity: number;
  public readonly velocity: Vector2;
  public readonly acceleration: Vector2;
  public readonly dragForce: Vector2;
  public readonly forceGravity: number;
  public readonly apex: boolean;
  public readonly reachedGround: boolean;

  /**
   * @param time - total time since fire at this point on the trajectory, in s
   * @param position - position of the data point, with x and y, also called range and height, in m
   * @param airDensity - air density of the atmosphere at this point, in kg/cu m
   * @param velocity - velocity at this point, magnitude in m/s
   * @param acceleration - acceleration at this point, magnitude in m/s^2
   * @param dragForce - drag force at this point, magnitude in N
   * @param forceGravity - force of gravity, in N
   */
  public constructor( time: number, position: Vector2, airDensity: number, velocity: Vector2, acceleration: Vector2, dragForce: Vector2, forceGravity: number, providedOptions?: DataPointOptions ) {

    assert && assert( !isNaN( time ), `DataPoint time is ${time}` );
    assert && assert( time !== 0 || position.x === 0, `Time is ${time}, but x is ${position.x}` );

    const options = optionize<DataPointOptions>()( {
      apex: false,
      reachedGround: false
    }, providedOptions );

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
   */
  public equals( dataPoint: DataPoint ): boolean {
    return this.position.equals( dataPoint.position )
           && this.time === dataPoint.time
           && this.airDensity === dataPoint.airDensity
           && this.velocity.equals( dataPoint.velocity )
           && this.acceleration.equals( dataPoint.acceleration )
           && this.dragForce.equals( dataPoint.dragForce )
           && this.forceGravity === dataPoint.forceGravity;
  }

  public dispose(): void {
    this.position.freeToPool();
    this.velocity.freeToPool();
    this.acceleration.freeToPool();
    this.dragForce.freeToPool();
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType for details.
   */
  public static get STATE_SCHEMA(): CompositeSchema {
    return {
      time: NumberIO,
      position: Vector2.Vector2IO,
      airDensity: NumberIO,
      velocity: Vector2.Vector2IO,
      acceleration: Vector2.Vector2IO,
      dragForce: Vector2.Vector2IO,
      forceGravity: NumberIO,
      apex: BooleanIO,
      reachedGround: BooleanIO
    };
  }

  /**
   * Deserializes a DataPoint instance.
   */
  public static fromStateObject( stateObject: DataPointStateObject ): DataPoint {
    return new DataPoint(
      stateObject.time ? stateObject.time : 0,
      Vector2.Vector2IO.fromStateObject( stateObject.position ),
      stateObject.airDensity,
      Vector2.Vector2IO.fromStateObject( stateObject.velocity ),
      Vector2.Vector2IO.fromStateObject( stateObject.acceleration ),
      Vector2.Vector2IO.fromStateObject( stateObject.dragForce ),
      stateObject.forceGravity ? stateObject.forceGravity : 0, {
        apex: stateObject.apex,
        reachedGround: stateObject.reachedGround
      } );
  }

  public static readonly DataPointIO = new IOType( 'DataPointIO', {
    valueType: DataPoint,
    stateSchema: DataPoint.STATE_SCHEMA,
    fromStateObject: stateObject => DataPoint.fromStateObject( stateObject ),
    documentation: 'A single data point on a projectile\'s trajectory, with the following data:<br><ul>' +
                   '<li>time (seconds): The time of the data point</li>' +
                   '<li>position (meters): the position of the point in model coordinates</li>' +
                   '<li>airDensity (kg/m^3): the air density when the point was collected</li>' +
                   '<li>velocity (m/s): the velocity of the projectile at the time when the point was collected</li>' +
                   '<li>acceleration (m/s^2): the acceleration of the projectile at the time when the point was collected</li>' +
                   '<li>dragForce (newtons): the acceleration of the projectile at the time when the point was collected</li>' +
                   '<li>forceGravity (newtons): the acceleration of the projectile at the time when the point was collected</li>' +
                   '<li>apex (boolean): if this data point was at the apex of a trajectory</li>' +
                   '<li>reachedGround (boolean): if this data point was collected when the projectile was on the ground</li></ul>'
  } );
}

projectileMotion.register( 'DataPoint', DataPoint );
export default DataPoint;