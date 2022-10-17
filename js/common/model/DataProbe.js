// Copyright 2016-2022, University of Colorado Boulder

/**
 * Model for the dataProbe tool.
 * Knows about trajectories, which contain arrays of points on their paths
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import DataPoint from './DataPoint.js';

// constants
const SENSING_RADIUS = 0.2; // meters, will change to view units. How close the dataProbe needs to get to a datapoint
const TIME_PER_MINOR_DOT = ProjectileMotionConstants.TIME_PER_MINOR_DOT; // milliseconds

class DataProbe {
  /**
   * @param {PhetioGroup.<Trajectory>} trajectoryGroup
   * @param {number} dataProbeX - x initial position of the dataProbe
   * @param {number} dataProbeY - y initial position of the dataProbe
   * @param {NumberProperty} zoomProperty - current zoom of the play area
   * @param {Tandem} tandem
   * @re
   */
  constructor( trajectoryGroup, dataProbeX, dataProbeY, zoomProperty, tandem ) {
    // @public
    this.positionProperty = new Vector2Property(
      new Vector2( dataProbeX, dataProbeY ),
      {
        tandem: tandem.createTandem( 'positionProperty' ),
        units: 'm',
        phetioDocumentation:
          'The position of the dataProbe in model coordinates, in meters.'
      }
    );

    // @public {Property.<DataPoint|null>}
    this.dataPointProperty = new Property( null, {
      tandem: tandem.createTandem( 'dataPointProperty' ),
      phetioDocumentation:
        'Data point that the dataProbe is displaying information about, or null if no info displayed. ' +
        'See DataPointIO for more information about the data point value.',
      phetioValueType: NullableIO( DataPoint.DataPointIO )
    } );

    // @public
    this.isActiveProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isActiveProperty' ),
      phetioDocumentation:
        'Whether the dataProbe is out in the play area (false when in toolbox)'
    } );

    // @private - used to adjust the tolerance of the sensing radius when detecting data points on trajectories.
    this.zoomProperty = zoomProperty;

    // @public {PhetioGroup.<Trajectory>} group of trajectories in the model
    this.trajectoryGroup = trajectoryGroup;

    this.trajectoryGroup.elementDisposedEmitter.addListener( () => {
      this.isActiveProperty.value && this.updateData();
    } );
  }

  /**
   * Reset these Properties
   * @public
   * @override
   */
  reset() {
    this.positionProperty.reset();
    this.dataPointProperty.reset();
    this.isActiveProperty.reset();
  }

  /**
   * @private
   * @param {Vector2} dataPointPosition
   * @returns {boolean} - if the position provided is close enough to the dataProbe position to be sensed.
   */
  pointWithinTolerance( dataPointPosition ) {
    return (
      dataPointPosition.distance( this.positionProperty.get() ) <=
      SENSING_RADIUS / this.zoomProperty.value
    );
  }

  /**
   * Checks for if there is a point the dataProbe is close to. If so, updates dataPointProperty
   * @public
   */
  updateData() {
    for ( let i = this.trajectoryGroup.count - 1; i >= 0; i-- ) {
      const currentTrajectory = this.trajectoryGroup.getElement( i );
      if (
        currentTrajectory.apexPoint &&
        this.pointWithinTolerance( currentTrajectory.apexPoint.position )
      ) {
        // current point shown is apex and it is still within sensing radius
        this.dataPointProperty.set( currentTrajectory.apexPoint );
        return;
      }
      const point = currentTrajectory.getNearestPoint(
        this.positionProperty.get().x,
        this.positionProperty.get().y
      );
      const pointIsReadable =
        point &&
        ( point.apex ||
          point.position.y === 0 ||
          Utils.toFixedNumber( point.time * 1000, 0 ) % TIME_PER_MINOR_DOT === 0 );
      if ( pointIsReadable && this.pointWithinTolerance( point.position ) ) {
        this.dataPointProperty.set( point );
        return;
      }
    }
    this.dataPointProperty.set( null );
  }

  /**
   * Checks if the given point is close enough to the dataProbe and updates information if so
   * @public
   *
   * @param {DataPoint} point
   */
  updateDataIfWithinRange( point ) {
    // point can be read by dataProbe if it exists, it is on the ground, or it is the right timestep
    const pointIsReadable =
      point &&
      ( point.apex ||
        point.position.y === 0 ||
        Utils.toFixedNumber( point.time * 1000, 0 ) % TIME_PER_MINOR_DOT === 0 );
    if ( pointIsReadable && this.pointWithinTolerance( point.position ) ) {
      this.dataPointProperty.set( point );
    }
  }
}

projectileMotion.register( 'DataProbe', DataProbe );

export default DataProbe;
