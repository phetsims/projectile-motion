// Copyright 2019-2020, University of Colorado Boulder

/**
 * IO Type for ProjectileObjectType
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import RangeIO from '../../../../dot/js/RangeIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import projectileMotion from '../../projectileMotion.js';

// constants
// Name the types needed to serialize each field on the ProjectileObjectType so that it can be used in
// toStateObject, fromStateObject, and applyState.
const ioTypeSchema = {
  name: { phetioType: NullableIO( StringIO ) },
  mass: { phetioType: NumberIO },
  diameter: { phetioType: NumberIO },
  dragCoefficient: { phetioType: NumberIO },
  benchmark: { phetioType: NullableIO( StringIO ) },
  rotates: { phetioType: BooleanIO },
  massRange: { phetioType: RangeIO },
  massRound: { phetioType: NumberIO },
  diameterRange: { phetioType: RangeIO },
  diameterRound: { phetioType: NumberIO },
  dragCoefficientRange: { phetioType: RangeIO }
};

const ProjectileObjectTypeIO = new IOType( 'ProjectileObjectTypeIO', {
  isValidValue: v => v instanceof phet.projectileMotion.ProjectileObjectType,
  documentation: 'A data type that stores the variables for a given object type.',
  toStateObject: projectileObjectType => {
    const stateObject = {};
    _.keys( ioTypeSchema ).map( fieldName => {
      stateObject[ fieldName ] = ioTypeSchema[ fieldName ].phetioType.toStateObject( projectileObjectType[ fieldName ] );
    } );
    return stateObject;
  },
  applyState: ( projectileObjectType, stateObject ) => {
    _.keys( stateObject ).map( fieldName => {
      assert && assert( stateObject.hasOwnProperty( fieldName ), `unexpected key: ${fieldName}` );
      assert && assert( projectileObjectType.hasOwnProperty( fieldName ), `unexpected key: ${fieldName}` );
      projectileObjectType[ fieldName ] = ioTypeSchema[ fieldName ].phetioType.fromStateObject( stateObject[ fieldName ] );
    } );
  }
} );

projectileMotion.register( 'ProjectileObjectTypeIO', ProjectileObjectTypeIO );
export default ProjectileObjectTypeIO;