// Copyright 2019, University of Colorado Boulder

/**
 * IO type for DataPoint
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const validate = require( 'AXON/validate' );
  const Vector2IO = require( 'DOT/Vector2IO' );

  class DataPointIO extends ObjectIO {

    /**
     * @param {DataPoint} dataPoint
     * @returns {Object}
     * @override
     */
    static toStateObject( dataPoint ) {
      validate( dataPoint, this.validator );
      return {
        time: NumberIO.toStateObject( dataPoint.time ),
        position: Vector2IO.toStateObject( dataPoint.position ),
        airDensity: NumberIO.toStateObject( dataPoint.airDensity ),
        velocity: Vector2IO.toStateObject( dataPoint.velocity ),
        acceleration: Vector2IO.toStateObject( dataPoint.acceleration ),
        dragForce: Vector2IO.toStateObject( dataPoint.dragForce ),
        forceGravity: NumberIO.toStateObject( dataPoint.forceGravity ),
        apex: dataPoint.apex,
        reachedGround: dataPoint.reachedGround
      };
    }

    /**
     * @param {DataPoint} dataPoint
     * @returns {Object}
     * @override
     */
    static fromStateObject( dataPoint ) {
      return {
        time: NumberIO.fromStateObject( dataPoint.time ),
        position: Vector2IO.fromStateObject( dataPoint.position ),
        airDensity: NumberIO.fromStateObject( dataPoint.airDensity ),
        velocity: Vector2IO.fromStateObject( dataPoint.velocity ),
        acceleration: Vector2IO.fromStateObject( dataPoint.acceleration ),
        dragForce: Vector2IO.fromStateObject( dataPoint.dragForce ),
        forceGravity: NumberIO.fromStateObject( dataPoint.forceGravity ),
        apex: dataPoint.apex,
        reachedGround: dataPoint.reachedGround
      };
    }

    /**
     *
     * @param stateObject
     * @returns {Array}
     */
    static stateObjectToArgs( stateObject ) {
      const fromStateObject = DataPointIO.fromStateObject( stateObject );
      return [
        fromStateObject.time,
        fromStateObject.position,
        fromStateObject.airDensity,
        fromStateObject.velocity,
        fromStateObject.acceleration,
        fromStateObject.dragForce,
        fromStateObject.forceGravity
      ];
    }

    /**
     * @param {DataPoint} dataPoint
     * @param {Object} fromStateObject
     */
    static setValue( dataPoint, fromStateObject ) {
      validate( dataPoint, this.validator );
      dataPoint.time = fromStateObject.time;
      dataPoint.position = fromStateObject.position;
      dataPoint.airDensity = fromStateObject.airDensity;
      dataPoint.velocity = fromStateObject.velocity;
      dataPoint.acceleration = fromStateObject.acceleration;
      dataPoint.dragForce = fromStateObject.dragForce;
      dataPoint.forceGravity = fromStateObject.forceGravity;
      dataPoint.apex = fromStateObject.apex;
      dataPoint.reachedGround = fromStateObject.reachedGround;
    }
  }

  DataPointIO.documentation = 'A single data point on a projectile\'s trajectory';
  DataPointIO.validator = { isValidValue: v => v instanceof phet.projectileMotion.DataPoint };
  DataPointIO.typeName = 'DataPointIO';
  ObjectIO.validateSubtype( DataPointIO );

  return projectileMotion.register( 'DataPointIO', DataPointIO );
} );
