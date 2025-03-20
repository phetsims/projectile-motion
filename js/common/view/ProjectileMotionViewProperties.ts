// Copyright 2017-2025, University of Colorado Boulder

/**
 * View Properties that are specific to visibility of vectors
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import projectileMotion from '../../projectileMotion.js';

type SelfOptions = {
  forceProperties?: boolean;
  accelerationProperties?: boolean;
};
type ProjectileMotionViewPropertiesOptions = SelfOptions & Pick<PhetioObjectOptions, 'tandem'>;

class ProjectileMotionViewProperties {
  public readonly componentsVelocityVectorsOnProperty: Property<boolean>; // whether component velocity vectors are showing
  public readonly totalVelocityVectorOnProperty: Property<boolean>; // whether total velocity vector is showing
  public readonly componentsAccelerationVectorsOnProperty?: Property<boolean>; // whether component acceleration vectors are showing
  public readonly totalAccelerationVectorOnProperty?: Property<boolean>; // whether total acceleration vector is shown
  public readonly totalForceVectorOnProperty?: Property<boolean>; // whether total force vector is showing
  public readonly componentsForceVectorsOnProperty?: Property<boolean>; // whether component force vectors are showing

  private readonly forceProperties: boolean;
  private readonly accelerationProperties: boolean;

  public constructor( providedOptions?: ProjectileMotionViewPropertiesOptions ) {

    const options = optionize<ProjectileMotionViewPropertiesOptions, SelfOptions>()( {
      forceProperties: true,
      accelerationProperties: true
    }, providedOptions );

    this.forceProperties = options.forceProperties;
    this.accelerationProperties = options.accelerationProperties;

    this.totalVelocityVectorOnProperty = new BooleanProperty( false, {
      tandem: options.tandem?.createTandem( 'totalVelocityVectorOnProperty' ),
      phetioDocumentation: 'Whether to display the total velocity vectors for flying projectiles',
      phetioFeatured: true
    } );

    this.componentsVelocityVectorsOnProperty = new BooleanProperty( false, {
      tandem: options.tandem?.createTandem( 'componentsVelocityVectorsOnProperty' ),
      phetioDocumentation: 'Whether to display the component velocity vectors for flying projectiles',
      phetioFeatured: true
    } );

    if ( options.accelerationProperties ) {

      this.totalAccelerationVectorOnProperty = new BooleanProperty( false, {
        tandem: options.tandem?.createTandem( 'totalAccelerationVectorOnProperty' ),
        phetioDocumentation: 'Whether to display the total acceleration vectors for flying projectiles',
        phetioFeatured: true
      } );

      this.componentsAccelerationVectorsOnProperty = new BooleanProperty( false, {
        tandem: options.tandem?.createTandem( 'componentsAccelerationVectorsOnProperty' ),
        phetioDocumentation: 'Whether to display the component acceleration vectors for flying projectiles',
        phetioFeatured: true
      } );
    }

    if ( options.forceProperties ) {

      this.totalForceVectorOnProperty = new BooleanProperty( false, {
        tandem: options.tandem?.createTandem( 'totalForceVectorOnProperty' ),
        phetioDocumentation: 'Whether to display the total force vectors in a free body diagram for flying projectiles'
      } );

      this.componentsForceVectorsOnProperty = new BooleanProperty( false, {
        tandem: options.tandem?.createTandem( 'componentsForceVectorsOnProperty' ),
        phetioDocumentation: 'Whether to display the component force vectors in a free body diagram for flying projectiles'
      } );

    }
  }

  public reset(): void {
    this.totalVelocityVectorOnProperty.reset();
    this.componentsVelocityVectorsOnProperty.reset();

    if ( this.accelerationProperties ) {
      assert && assert( this.totalAccelerationVectorOnProperty, 'If accelerationProperties is true, totalAccelerationVectorOnProperty must be set' );
      this.totalAccelerationVectorOnProperty!.reset();

      assert && assert( this.componentsAccelerationVectorsOnProperty, 'If accelerationProperties is true, componentsAccelerationVectorsOnProperty must be set' );
      this.componentsAccelerationVectorsOnProperty!.reset();
    }
    if ( this.forceProperties ) {
      assert && assert( this.totalForceVectorOnProperty, 'If forceProperties is true, totalForceVectorOnProperty must be set' );
      this.totalForceVectorOnProperty!.reset();

      assert && assert( this.componentsForceVectorsOnProperty, 'If forceProperties is true, componentsForceVectorsOnProperty must be set' );
      this.componentsForceVectorsOnProperty!.reset();
    }
  }
}

projectileMotion.register( 'ProjectileMotionViewProperties', ProjectileMotionViewProperties );

export default ProjectileMotionViewProperties;