// Copyright 2019-2020, University of Colorado Boulder

/**
 * IO Type for ProjectileObjectType
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import ProjectileObjectTypeIO from '../../common/model/ProjectileObjectTypeIO.js';
import projectileMotion from '../../projectileMotion.js';

const EditableProjectileObjectTypeIO = new IOType( 'EditableProjectileObjectTypeIO', {
  isValidValue: v => v instanceof phet.projectileMotion.ProjectileObjectType,
  documentation: 'A data type that stores the variables for a given object type.',
  supertype: ProjectileObjectTypeIO,

  /**
   * @public
   * @param {ProjectileObjectType} phetioObjectType
   * @param {Object} fromStateObject
   * @override
   */
  applyState( phetioObjectType, fromStateObject ) {
    ProjectileObjectTypeIO.applyState( phetioObjectType, fromStateObject );

    // These were just set on the phetioObjectType in the supertype applyState
    phetioObjectType.initialMass = phetioObjectType.mass;
    phetioObjectType.initialDiameter = phetioObjectType.diameter;
    phetioObjectType.initialDragCoefficient = phetioObjectType.dragCoefficient;
  }
} );

projectileMotion.register( 'EditableProjectileObjectTypeIO', EditableProjectileObjectTypeIO );
export default EditableProjectileObjectTypeIO;