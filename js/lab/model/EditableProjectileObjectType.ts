// Copyright 2019-2024, University of Colorado Boulder

/**
 * ProjectileObjectType subtype that contains editable (mutable) properties of the projectile type
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import ProjectileObjectType, { ProjectileObjectTypeOptions } from '../../common/model/ProjectileObjectType.js';
import projectileMotion from '../../projectileMotion.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;
type EditableProjectileObjectTypeOptions = SelfOptions & ProjectileObjectTypeOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

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
    const options = optionize<EditableProjectileObjectTypeOptions, SelfOptions, EditableProjectileObjectTypeOptions>()( {
      phetioType: EditableProjectileObjectType.EditableProjectileObjectTypeIO
    }, providedOptions );

    super( name, mass, diameter, dragCoefficient, benchmark, rotates, options );

    // These overwrite the supertype values, but as a way to declare them as writeable fields.
    this.mass = mass;
    this.diameter = diameter;
    this.dragCoefficient = dragCoefficient;

    // IOType - these mutable values also store their initial values
    this.initialMass = mass;
    this.initialDiameter = diameter;
    this.initialDragCoefficient = dragCoefficient;
  }

  public reset(): void {
    this.mass = this.initialMass;
    this.diameter = this.initialDiameter;
    this.dragCoefficient = this.initialDragCoefficient;
  }

  public static fromProjectileObjectType( projectileObjectType: ProjectileObjectType, tandem: Tandem ): EditableProjectileObjectType {
    return new EditableProjectileObjectType(
      projectileObjectType.name,
      projectileObjectType.mass,
      projectileObjectType.diameter,
      projectileObjectType.dragCoefficient,
      projectileObjectType.benchmark,
      projectileObjectType.rotates,
      combineOptions<EditableProjectileObjectTypeOptions>( projectileObjectType.projectileObjectTypeOptions, {
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