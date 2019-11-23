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
  const DataPoint = require( 'PROJECTILE_MOTION/common/model/DataPoint' );
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
     * @returns {DataPoint}
     * @override
     */
    static fromStateObject( dataPoint ) {
      return new DataPoint(
        NumberIO.fromStateObject( dataPoint.time ),
        Vector2IO.fromStateObject( dataPoint.position ),
        NumberIO.fromStateObject( dataPoint.airDensity ),
        Vector2IO.fromStateObject( dataPoint.velocity ),
        Vector2IO.fromStateObject( dataPoint.acceleration ),
        Vector2IO.fromStateObject( dataPoint.dragForce ),
        NumberIO.fromStateObject( dataPoint.forceGravity ), {
          apex: dataPoint.apex,
          reachedGround: dataPoint.reachedGround
        }
      );
    }
  }

  DataPointIO.documentation = 'A single data point on a projectile\'s trajectory, with the following data:<br><ul>' +
                              '<li>time: The time of the data point</li>' +
                              '<li>position: the position of the point in model coords</li>' +
                              '<li>airDensity: the air density when the point was collected</li>' +
                              '<li>velocity: the velocity of the projectile at the time when the point was collected</li>' +
                              '<li>acceleration: the acceleration of the projectile at the time when the point was collected</li>' +
                              '<li>dragForce: the acceleration of the projectile at the time when the point was collected</li>' +
                              '<li>forceGravity: the acceleration of the projectile at the time when the point was collected</li>' +
                              '<li>apex: if this data point was at the apex of a trajectory</li>' +
                              '<li>reachedGround: if this data point was collected when the projectile was on the ground</li></ul>';
  DataPointIO.validator = { isValidValue: v => v instanceof phet.projectileMotion.DataPoint };
  DataPointIO.typeName = 'DataPointIO';
  ObjectIO.validateSubtype( DataPointIO );

  return projectileMotion.register( 'DataPointIO', DataPointIO );
} );
