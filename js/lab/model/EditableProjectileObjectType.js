// Copyright 2019-2022, University of Colorado Boulder

/**
 * ProjectileObjectType subtype that contains editable (mutable) properties of the projectile type
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import projectileMotion from '../../projectileMotion.js';

class EditableProjectileObjectType extends ProjectileObjectType {

  /**
   * @param {string|null} name - name of the object, such as 'Golf ball', or null if it doesn't have a name
   * @param {number} mass - in kg
   * @param {number} diameter - in meters
   * @param {number} dragCoefficient
   * @param {string|null} benchmark - identifier of the object benchmark, such as 'tankShell', also considered a
   *                                      'name' for it like for Tandems. null for screens with only one object type
   * @param {boolean} rotates - whether the object rotates or just translates in air
   * @param {Object} [options]
   */
  constructor( name, mass, diameter, dragCoefficient, benchmark, rotates, options ) {

    // Options contains data about range and rounding for mass, diameter, drag coefficient.
    // defaults to those of custom objects for screens that don't have benchmarks
    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioType: EditableProjectileObjectType.EditableProjectileObjectTypeIO
    }, options );

    super( name, mass, diameter, dragCoefficient, benchmark, rotates, options );

    // @public - These overwrite the supertype values, but as a way to declare them as writeable fields.
    this.mass = mass;
    this.diameter = diameter;
    this.dragCoefficient = dragCoefficient;

    // @public (IO Type) - these mutable values also store their initial values
    this.initialMass = mass;
    this.initialDiameter = diameter;
    this.initialDragCoefficient = dragCoefficient;
  }

  /**
   * Reset the editable pieces of the objecty type
   * @public
   */
  reset() {
    this.mass = this.initialMass;
    this.diameter = this.initialDiameter;
    this.dragCoefficient = this.initialDragCoefficient;
  }

  /**
   *
   * @param {ProjectileObjectType} projectileObjectType
   * @param {Tandem} tandem
   * @returns {EditableProjectileObjectType}
   * @public
   */
  static fromProjectileObjectType( projectileObjectType, tandem ) {
    return new EditableProjectileObjectType(
      projectileObjectType.name,
      projectileObjectType.mass,
      projectileObjectType.diameter,
      projectileObjectType.dragCoefficient,
      projectileObjectType.benchmark,
      projectileObjectType.rotates,
      merge( projectileObjectType.projectileObjectTypeOptions, {
        phetioType: EditableProjectileObjectType.EditableProjectileObjectTypeIO,
        tandem: tandem
      } ) );
  }
}

EditableProjectileObjectType.EditableProjectileObjectTypeIO = new IOType( 'EditableProjectileObjectTypeIO', {
  valueType: ProjectileObjectType,
  documentation: 'A data type that stores the variables for a given object type.',
  supertype: ProjectileObjectType.ProjectileObjectTypeIO,

  applyState: ( phetioObjectType, fromStateObject ) => {
    ProjectileObjectType.ProjectileObjectTypeIO.applyState( phetioObjectType, fromStateObject );

    // These were just set on the phetioObjectType in the supertype applyState
    phetioObjectType.initialMass = phetioObjectType.mass;
    phetioObjectType.initialDiameter = phetioObjectType.diameter;
    phetioObjectType.initialDragCoefficient = phetioObjectType.dragCoefficient;
  }
} );

projectileMotion.register( 'EditableProjectileObjectType', EditableProjectileObjectType );

export default EditableProjectileObjectType;