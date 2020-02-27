// Copyright 2019, University of Colorado Boulder

/**
 * IO type for ProjectileObjectType
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import RangeIO from '../../../../dot/js/RangeIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import projectileMotion from '../../projectileMotion.js';

// constants
// Name the types needed to serialize each field on the ProjectileObjectType so that it can be used in
// toStateObject, fromStateObject, and setValue.
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

class ProjectileObjectTypeIO extends ObjectIO {

  /**
   * @param {ProjectileObjectType} projectileObjectType
   * @returns {Object}
   * @override
   */
  static toStateObject( projectileObjectType ) {
    validate( projectileObjectType, this.validator );
    const stateObject = {};
    _.keys( ioTypeSchema ).map( fieldName => {
      stateObject[ fieldName ] = ioTypeSchema[ fieldName ].phetioType.toStateObject( projectileObjectType[ fieldName ] );
    } );
    return stateObject;
  }

  /**
   * @param {Object} stateObject
   * @returns {Object}
   * @override
   */
  static fromStateObject( stateObject ) {
    const fromStateObject = {};
    _.keys( stateObject ).map( fieldName => {
      assert && assert( stateObject.hasOwnProperty( fieldName ), `unexpected key: ${fieldName}` );
      fromStateObject[ fieldName ] = ioTypeSchema[ fieldName ].phetioType.fromStateObject( stateObject[ fieldName ] );
    } );
    return fromStateObject;
  }


  static setValue( phetioObjectType, fromStateObject ) {
    _.keys( fromStateObject ).map( fieldName => {
      assert && assert( phetioObjectType.hasOwnProperty( fieldName ), `unexpected key: ${fieldName}` );
      phetioObjectType[ fieldName ] = fromStateObject[ fieldName ];
    } );
  }
}

ProjectileObjectTypeIO.documentation = 'A data type that stores the variables for a given object type.';
ProjectileObjectTypeIO.validator = { isValidValue: v => v instanceof phet.projectileMotion.ProjectileObjectType };
ProjectileObjectTypeIO.typeName = 'ProjectileObjectTypeIO';
ObjectIO.validateSubtype( ProjectileObjectTypeIO );

projectileMotion.register( 'ProjectileObjectTypeIO', ProjectileObjectTypeIO );
export default ProjectileObjectTypeIO;