// Copyright 2019-2020, University of Colorado Boulder

/**
 * IO Type for ProjectileObjectType
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ProjectileObjectTypeIO from '../../common/model/ProjectileObjectTypeIO.js';
import projectileMotion from '../../projectileMotion.js';

class EditableProjectileObjectTypeIO extends ProjectileObjectTypeIO {

  /**
   * @public
   * @param {ProjectileObjectType} phetioObjectType
   * @param {Object} fromStateObject
   * @override
   */
  static applyState( phetioObjectType, fromStateObject ) {
    ProjectileObjectTypeIO.applyState( phetioObjectType, fromStateObject );

    // These were just set on the phetioObjectType in the supertype applyState
    phetioObjectType.initialMass = phetioObjectType.mass;
    phetioObjectType.initialDiameter = phetioObjectType.diameter;
    phetioObjectType.initialDragCoefficient = phetioObjectType.dragCoefficient;
  }
}

EditableProjectileObjectTypeIO.documentation = 'A data type that stores the variables for a given object type.';
EditableProjectileObjectTypeIO.validator = { isValidValue: v => v instanceof phet.projectileMotion.ProjectileObjectType };
EditableProjectileObjectTypeIO.typeName = 'EditableProjectileObjectTypeIO';
ObjectIO.validateSubtype( EditableProjectileObjectTypeIO );

projectileMotion.register( 'EditableProjectileObjectTypeIO', EditableProjectileObjectTypeIO );
export default EditableProjectileObjectTypeIO;