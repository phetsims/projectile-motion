// Copyright 2019, University of Colorado Boulder

/**
 * IO type for ProjectileObjectType
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanIO = require( 'TANDEM/types/BooleanIO' );
  const NullableIO = require( 'TANDEM/types/NullableIO' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const RangeIO = require( 'DOT/RangeIO' );
  const StringIO = require( 'TANDEM/types/StringIO' );
  const validate = require( 'AXON/validate' );

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
    diameterRound: { phetioType: NumberIO }
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

  return projectileMotion.register( 'ProjectileObjectTypeIO', ProjectileObjectTypeIO );
} );
