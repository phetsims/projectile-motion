// Copyright 2017-2025, University of Colorado Boulder

/**
 * View Properties that are specific to visibility of vectors
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import ProjectileMotionViewProperties from '../../common/view/ProjectileMotionViewProperties.js';
import VectorsDisplayEnumeration from '../../common/view/VectorsDisplayEnumeration.js';
import projectileMotion from '../../projectileMotion.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class VectorsViewProperties extends ProjectileMotionViewProperties {
  public readonly vectorsDisplayProperty;
  public readonly velocityVectorsOnProperty;
  public readonly accelerationVectorsOnProperty;
  public readonly forceVectorsOnProperty;

  public constructor( tandem: Tandem ) {

    super();

    // Vectors visibility for velocity and force, total or component
    this.velocityVectorsOnProperty = new Property( false, {
      phetioValueType: BooleanIO,
      tandem: tandem.createTandem( 'velocityVectorsOnProperty' ),
      phetioDocumentation: 'Whether to display velocity vectors for flying projectiles',
      phetioFeatured: true
    } );
    this.accelerationVectorsOnProperty = new Property( false, {
      phetioValueType: BooleanIO,
      tandem: tandem.createTandem( 'accelerationVectorsOnProperty' ),
      phetioDocumentation: 'Whether to display the acceleration vectors for flying projectiles',
      phetioFeatured: true
    } );
    this.forceVectorsOnProperty = new Property( false, {
      phetioValueType: BooleanIO,
      phetioDocumentation: 'Whether to display the force vectors in a free body diagram for flying projectiles',
      tandem: tandem.createTandem( 'forceVectorsOnProperty' ),
      phetioFeatured: true
    } );
    this.vectorsDisplayProperty = new EnumerationProperty( VectorsDisplayEnumeration.TOTAL, {
      validValues: [ VectorsDisplayEnumeration.TOTAL, VectorsDisplayEnumeration.COMPONENTS ],
      tandem: tandem.createTandem( 'vectorsDisplayProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Property for which type of vectors are displayed for flying projectiles: either component ' +
                           'vectors or total vectors.'
    } );

    // update which vectors to show based on controls
    // Doesn't need to be disposed because it lasts for the lifetime of the sim
    Multilink.multilink( [
      this.velocityVectorsOnProperty,
      this.accelerationVectorsOnProperty,
      this.forceVectorsOnProperty,
      this.vectorsDisplayProperty
    ], this.updateVectorVisibilities.bind( this ) );

  }


  /**
   * Reset these Properties
   */
  public override reset(): void {
    super.reset();
    this.velocityVectorsOnProperty.reset();
    this.accelerationVectorsOnProperty.reset();
    this.forceVectorsOnProperty.reset();
    this.vectorsDisplayProperty.reset();
  }

  /**
   * Update vector visibilities based on whether velocity, acceleration, and/or force vectors are on, and whether total or components
   */
  private updateVectorVisibilities( velocityVectorsOn: boolean, accelerationVectorsOn: boolean, forceVectorsOn: boolean, vectorsDisplay: VectorsDisplayEnumeration ): void {
    const displayTotal = vectorsDisplay === VectorsDisplayEnumeration.TOTAL;
    const displayComponents = vectorsDisplay === VectorsDisplayEnumeration.COMPONENTS;

    this.totalVelocityVectorOnProperty.set( velocityVectorsOn && displayTotal );
    this.componentsVelocityVectorsOnProperty.set( velocityVectorsOn && displayComponents );
    if ( this.totalAccelerationVectorOnProperty ) {
      this.totalAccelerationVectorOnProperty.set( accelerationVectorsOn && displayTotal );
    }
    if ( this.componentsAccelerationVectorsOnProperty ) {
      this.componentsAccelerationVectorsOnProperty.set( accelerationVectorsOn && displayComponents );
    }
    if ( this.totalForceVectorOnProperty ) {
      this.totalForceVectorOnProperty.set( forceVectorsOn && displayTotal );
    }
    if ( this.componentsForceVectorsOnProperty ) {
      this.componentsForceVectorsOnProperty.set( forceVectorsOn && displayComponents );
    }
  }
}

projectileMotion.register( 'VectorsViewProperties', VectorsViewProperties );

export default VectorsViewProperties;