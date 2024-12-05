// Copyright 2017-2023, University of Colorado Boulder

/**
 * View Properties that are specific to visibility of vectors
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ProjectileMotionViewProperties from '../../common/view/ProjectileMotionViewProperties.js';
import VectorsDisplayEnumeration from '../../common/view/VectorsDisplayEnumeration.js';
import projectileMotion from '../../projectileMotion.js';

class VectorsViewProperties extends ProjectileMotionViewProperties {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super();

    // @public vectors visibility for velocity and force, total or component
    this.velocityVectorsOnProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'velocityVectorsOnProperty' ),
      phetioDocumentation: 'Whether to display velocity vectors for flying projectiles',
      phetioFeatured: true
    } );
    this.accelerationVectorsOnProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'accelerationVectorsOnProperty' ),
      phetioDocumentation: 'Whether to display the acceleration vectors for flying projectiles',
      phetioFeatured: true
    } );
    this.forceVectorsOnProperty = new BooleanProperty( false, {
      phetioDocumentation: 'Whether to display the force vectors in a free body diagram for flying projectiles',
      tandem: tandem.createTandem( 'forceVectorsOnProperty' ),
      phetioFeatured: true
    } );
    this.vectorsDisplayProperty = new EnumerationDeprecatedProperty( VectorsDisplayEnumeration, VectorsDisplayEnumeration.TOTAL, {
      tandem: tandem.createTandem( 'vectorsDisplayProperty' ),
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
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.velocityVectorsOnProperty.reset();
    this.accelerationVectorsOnProperty.reset();
    this.forceVectorsOnProperty.reset();
    this.vectorsDisplayProperty.reset();
  }

  /**
   * Update vector visibilities based on whether velocity, acceleration, and/or force vectors are on, and whether
   * total or components
   * @private
   *
   * @param {boolean} velocityVectorsOn
   * @param {boolean} accelerationVectorsOn
   * @param {boolean} forceVectorsOn
   * @param {string} vectorsDisplay
   */
  updateVectorVisibilities( velocityVectorsOn, accelerationVectorsOn, forceVectorsOn, vectorsDisplay ) {
    const displayTotal = vectorsDisplay === VectorsDisplayEnumeration.TOTAL;
    const displayComponents = vectorsDisplay === VectorsDisplayEnumeration.COMPONENTS;

    this.totalVelocityVectorOnProperty.set( velocityVectorsOn && displayTotal );
    this.componentsVelocityVectorsOnProperty.set( velocityVectorsOn && displayComponents );
    this.totalAccelerationVectorOnProperty.set( accelerationVectorsOn && displayTotal );
    this.componentsAccelerationVectorsOnProperty.set( accelerationVectorsOn && displayComponents );
    this.totalForceVectorOnProperty.set( forceVectorsOn && displayTotal );
    this.componentsForceVectorsOnProperty.set( forceVectorsOn && displayComponents );
  }
}

projectileMotion.register( 'VectorsViewProperties', VectorsViewProperties );

export default VectorsViewProperties;