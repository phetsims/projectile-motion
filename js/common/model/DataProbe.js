// Copyright 2016-2020, University of Colorado Boulder

/**
 * Model for the dataProbe tool.
 * Knows about trajectories, which contain arrays of points on their paths
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import DataPointIO from './DataPointIO.js';

// constants
const SENSING_RADIUS = 0.2; // meters, will change to view units. How close the dataProbe needs to get to a datapoint
const TIME_PER_MINOR_DOT = ProjectileMotionConstants.TIME_PER_MINOR_DOT; // milliseconds

/**
 * @param {PhetioGroup.<Trajectory>} trajectoryGroup
 * @param {number} dataProbeX - x initial position of the dataProbe
 * @param {number} dataProbeY - y initial position of the dataProbe
 * @param {Tandem} tandem
 * @constructor
 */
function DataProbe( trajectoryGroup, dataProbeX, dataProbeY, tandem ) {

  // @public
  this.positionProperty = new Vector2Property( new Vector2( dataProbeX, dataProbeY ), {
    tandem: tandem.createTandem( 'positionProperty' ),
    phetioDocumentation: 'The position of the dataProbe in model coordinates, in meters.'
  } );

  // @public {Property.<DataPoint|null>}
  this.dataPointProperty = new Property( null, {
    tandem: tandem.createTandem( 'dataPointProperty' ),
    phetioDocumentation: 'Data point that the dataProbe is displaying information about, or null if no info displayed. ' +
                         'See DataPointIO for more information about the data point value.',
    phetioType: PropertyIO( NullableIO( DataPointIO ) )
  } );

  // @public
  this.isActiveProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'isActiveProperty' ),
    phetioDocumentation: 'Whether the dataProbe is out in the play area (false when in toolbox)'
  } );

  // @public {PhetioGroup.<Trajectory>} group of trajectories in the model
  this.trajectoryGroup = trajectoryGroup;

  this.trajectoryGroup.elementDisposedEmitter.addListener( this.updateData.bind( this ) );
}

projectileMotion.register( 'DataProbe', DataProbe );

inherit( Object, DataProbe, {

  /**
   * Reset these Properties
   * @public
   * @override
   */
  reset: function() {
    this.positionProperty.reset();
    this.dataPointProperty.reset();
    this.isActiveProperty.reset();
  },

  /**
   * Checks for if there is a point the dataProbe is close to. If so, updates dataPointProperty
   * @public
   */
  updateData: function() {
    for ( let i = this.trajectoryGroup.count - 1; i >= 0; i-- ) {
      const currentTrajectory = this.trajectoryGroup.getElement( i );
      if ( currentTrajectory.apexPoint && currentTrajectory.apexPoint.position.distance( this.positionProperty.get() ) <= SENSING_RADIUS ) { // current point shown is apex and it is still within sensing radius
        this.dataPointProperty.set( currentTrajectory.apexPoint );
        return;
      }
      const point = currentTrajectory.getNearestPoint( this.positionProperty.get().x, this.positionProperty.get().y );
      const pointIsReadable = point &&
                              ( point.apex || point.position.y === 0 || Utils.toFixedNumber( point.time * 1000, 0 ) % TIME_PER_MINOR_DOT === 0 );
      if ( pointIsReadable && point.position.distance( this.positionProperty.get() ) <= SENSING_RADIUS ) {
        this.dataPointProperty.set( point );
        return;
      }
    }
    this.dataPointProperty.set( null );
  },

  /**
   * Checks if the given point is close enough to the dataProbe and updates information if so
   * @public
   *
   * @param {DataPoint} point
   */
  updateDataIfWithinRange: function( point ) {

    // point can be read by dataProbe if it exists, it is on the ground, or it is the right timestep
    const pointIsReadable = point &&
                            ( point.apex || point.position.y === 0 || Utils.toFixedNumber( point.time * 1000, 0 ) % TIME_PER_MINOR_DOT === 0 );
    if ( pointIsReadable && point.position.distance( this.positionProperty.get() ) <= SENSING_RADIUS ) {
      this.dataPointProperty.set( point );
    }
  }
} );

export default DataProbe;