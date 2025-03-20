// Copyright 2017-2025, University of Colorado Boulder

/**
 * View Properties that are specific to visibility of vectors
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import ProjectileMotionViewProperties from '../../common/view/ProjectileMotionViewProperties.js';
import projectileMotion from '../../projectileMotion.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import VectorsDisplayEnumeration from '../../common/view/VectorsDisplayEnumeration.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';

class DragViewProperties extends ProjectileMotionViewProperties {
  public readonly vectorsDisplayProperty: EnumerationProperty<VectorsDisplayEnumeration>;
  public readonly velocityVectorsOnProperty: Property<boolean>;
  public readonly forceVectorsOnProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {
    super( {
      accelerationProperties: false
    } );

    // vectors visibility for velocity and force, total or component
    this.velocityVectorsOnProperty = new Property( false, {
      tandem: tandem.createTandem( 'velocityVectorsOnProperty' ),
      phetioValueType: BooleanIO,
      phetioDocumentation: 'Whether to display velocity vectors for flying projectiles',
      phetioFeatured: true
    } );
    this.forceVectorsOnProperty = new Property( false, {
      tandem: tandem.createTandem( 'forceVectorsOnProperty' ),
      phetioValueType: BooleanIO,
      phetioDocumentation: 'Whether to display the force vectors in a free body diagram for flying projectiles',
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
      this.forceVectorsOnProperty,
      this.vectorsDisplayProperty
    ], this.updateVectorVisibilities.bind( this ) );

  }


  public override reset(): void {
    super.reset();
    this.velocityVectorsOnProperty.reset();
    this.forceVectorsOnProperty.reset();
    this.vectorsDisplayProperty.reset();
  }

  /**
   * Update vector visibilities based on whether velocity and/or force vectors are on, and whether total or components
   */
  private updateVectorVisibilities( velocityVectorsOn: boolean, forceVectorsOn: boolean, vectorsDisplay: VectorsDisplayEnumeration ): void {
    const displayTotal = vectorsDisplay === VectorsDisplayEnumeration.TOTAL;
    const displayComponents = vectorsDisplay === VectorsDisplayEnumeration.COMPONENTS;

    this.totalVelocityVectorOnProperty.set( velocityVectorsOn && displayTotal );
    this.componentsVelocityVectorsOnProperty.set( velocityVectorsOn && displayComponents );

    if ( this.totalForceVectorOnProperty !== undefined ) {
      this.totalForceVectorOnProperty.set( forceVectorsOn && displayTotal );
    }
    if ( this.componentsForceVectorsOnProperty !== undefined ) {
      this.componentsForceVectorsOnProperty.set( forceVectorsOn && displayComponents );
    }
  }
}

projectileMotion.register( 'DragViewProperties', DragViewProperties );

export default DragViewProperties;