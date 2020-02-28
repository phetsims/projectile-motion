// Copyright 2019-2020, University of Colorado Boulder

/**
 * IO type for ProjectileObjectType
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
   */
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

projectileMotion.register( 'EditableProjectileObjectTypeIO', EditableProjectileObjectTypeIO );
export default EditableProjectileObjectTypeIO;