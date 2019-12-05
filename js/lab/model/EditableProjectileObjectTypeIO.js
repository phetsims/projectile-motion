// Copyright 2019, University of Colorado Boulder

/**
 * IO type for ProjectileObjectType
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileObjectTypeIO = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectTypeIO' );


  class EditableProjectileObjectTypeIO extends ProjectileObjectTypeIO {

    static setValue( phetioObjectType, fromStateObject ) {
      ProjectileObjectTypeIO.setValue( phetioObjectType, fromStateObject );
      phetioObjectType.initialMass = fromStateObject.mass;
      phetioObjectType.initialDiameter = fromStateObject.diameter;
      phetioObjectType.initialDragCoefficient = fromStateObject.dragCoefficient;
    }
  }

  EditableProjectileObjectTypeIO.documentation = 'A data type that stores the variables for a given object type.';
  EditableProjectileObjectTypeIO.validator = { isValidValue: v => v instanceof phet.projectileMotion.ProjectileObjectType };
  EditableProjectileObjectTypeIO.typeName = 'EditableProjectileObjectTypeIO';
  ObjectIO.validateSubtype( EditableProjectileObjectTypeIO );

  return projectileMotion.register( 'EditableProjectileObjectTypeIO', EditableProjectileObjectTypeIO );
} );
