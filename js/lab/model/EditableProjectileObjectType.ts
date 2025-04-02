// Copyright 2019-2025, University of Colorado Boulder

/**
 * ProjectileObjectType subtype that contains editable (mutable) properties of the projectile type
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ProjectileObjectType, { ProjectileObjectTypeOptions } from '../../common/model/ProjectileObjectType.js';
import projectileMotion from '../../projectileMotion.js';

type SelfOptions = EmptySelfOptions;
type EditableProjectileObjectTypeOptions = SelfOptions & ProjectileObjectTypeOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class EditableProjectileObjectType extends ProjectileObjectType {

  public static EditableProjectileObjectTypeIO = new IOType<EditableProjectileObjectType, IntentionalAny>(
    'EditableProjectileObjectTypeIO',
    {
      valueType: ProjectileObjectType,
      documentation: 'A data type that stores the variables for a given object type.',
      supertype: ProjectileObjectType.ProjectileObjectTypeIO,
      applyState: ( phetioObjectType, fromStateObject ) => {
        ProjectileObjectType.ProjectileObjectTypeIO.applyState( phetioObjectType, fromStateObject );
        phetioObjectType.initialMass = phetioObjectType.mass;
        phetioObjectType.initialDiameter = phetioObjectType.diameter;
        phetioObjectType.initialDragCoefficient = phetioObjectType.dragCoefficient;
      }
    }
  );

  public constructor( name: string | null, mass: number, diameter: number, dragCoefficient: number, benchmark: string | null, rotates: boolean, providedOptions: EditableProjectileObjectTypeOptions ) {

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

projectileMotion.register( 'EditableProjectileObjectType', EditableProjectileObjectType );

export default EditableProjectileObjectType;