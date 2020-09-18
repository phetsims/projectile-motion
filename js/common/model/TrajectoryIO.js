// Copyright 2019-2020, University of Colorado Boulder

/**
 * IO Type for Trajectory
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import projectileMotion from '../../projectileMotion.js';
import DataPointIO from './DataPointIO.js';

const NullOrDataPointIO = NullableIO( DataPointIO );

// constants
// Name the types needed to serialize each field on the Trajectory so that it can be used in
// toStateObject, fromStateObject, and applyState.
const ioTypeSchema = {
  mass: { phetioType: NumberIO },
  diameter: { phetioType: NumberIO },
  dragCoefficient: { phetioType: NumberIO },
  changedInMidAir: { phetioType: BooleanIO },
  reachedGround: { phetioType: BooleanIO },
  apexPoint: { phetioType: NullOrDataPointIO } // serialize as a data type, no reference type
};
const TrajectoryIO = new IOType( 'TrajectoryIO', {
  isValidValue: v => v instanceof phet.projectileMotion.Trajectory,
  documentation: 'A trajectory outlining the projectile\'s path',
  toStateObject: trajectory => {
    const stateObject = {};
    _.keys( ioTypeSchema ).map( fieldName => {
      stateObject[ fieldName ] = ioTypeSchema[ fieldName ].phetioType.toStateObject( trajectory[ fieldName ] );
    } );
    return stateObject;
  },
  applyState: ( trajectory, stateObject ) => {
    _.keys( stateObject ).map( fieldName => {
      assert && assert( stateObject.hasOwnProperty( fieldName ), `unexpected key: ${fieldName}` );
      assert && assert( trajectory.hasOwnProperty( fieldName ), `unexpected key: ${fieldName}` );
      trajectory[ fieldName ] = ioTypeSchema[ fieldName ].phetioType.fromStateObject( stateObject[ fieldName ] );
    } );
  }
} );

projectileMotion.register( 'TrajectoryIO', TrajectoryIO );
export default TrajectoryIO;