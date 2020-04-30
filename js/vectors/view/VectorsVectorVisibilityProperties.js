// Copyright 2017-2020, University of Colorado Boulder

/**
 * View Properties that are specific to visibility of vectors
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import VectorsDisplayEnumeration from '../../common/view/VectorsDisplayEnumeration.js';
import VectorVisibilityProperties from '../../common/view/VectorVisibilityProperties.js';
import projectileMotion from '../../projectileMotion.js';

/**
 * @param {Tandem} tandem
 * @constructor
 */
function VectorsVectorVisibilityProperties( tandem ) {
  VectorVisibilityProperties.call( this );

  // @public vectors visibility for velocity and force, total or component
  this.velocityVectorsOnProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'velocityVectorsOnProperty' ),
    phetioDocumentation: 'Whether or not to display velocity vectors for flying projectiles'
  } );
  this.accelerationVectorsOnProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'accelerationVectorsOnProperty' ),
    phetioDocumentation: 'Whether or not to display the acceleration vectors for flying projectiles'
  } );
  this.forceVectorsOnProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'forceVectorsOnProperty' ),
    phetioDocumentation: 'Whether or not to display the force vectors in a free body diagram for flying projectiles'
  } );
  this.vectorsDisplayProperty = new EnumerationProperty( VectorsDisplayEnumeration, VectorsDisplayEnumeration.TOTAL, {
    tandem: tandem.createTandem( 'vectorsDisplayProperty' ),
    phetioDocumentation: 'Property for which type of vectors are displayed for flying projectiles: either component ' +
                         'vectors or total vectors.'
  } );

  // update which vectors to show based on controls
  // Doesn't need to be disposed because it lasts for the lifetime of the sim
  Property.multilink( [
    this.velocityVectorsOnProperty,
    this.accelerationVectorsOnProperty,
    this.forceVectorsOnProperty,
    this.vectorsDisplayProperty
  ], this.updateVectorVisibilities.bind( this ) );

}

projectileMotion.register( 'VectorsVectorVisibilityProperties', VectorsVectorVisibilityProperties );

inherit( VectorVisibilityProperties, VectorsVectorVisibilityProperties, {

  /**
   * Reset these Properties
   * @public
   * @override
   */
  reset: function() {
    VectorVisibilityProperties.prototype.reset.call( this );
    this.velocityVectorsOnProperty.reset();
    this.accelerationVectorsOnProperty.reset();
    this.forceVectorsOnProperty.reset();
    this.vectorsDisplayProperty.reset();
  },

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
  updateVectorVisibilities: function( velocityVectorsOn, accelerationVectorsOn, forceVectorsOn, vectorsDisplay ) {
    const displayTotal = vectorsDisplay === VectorsDisplayEnumeration.TOTAL;
    const displayComponents = vectorsDisplay === VectorsDisplayEnumeration.COMPONENTS;

    this.totalVelocityVectorOnProperty.set( velocityVectorsOn && displayTotal );
    this.componentsVelocityVectorsOnProperty.set( velocityVectorsOn && displayComponents );
    this.totalAccelerationVectorOnProperty.set( accelerationVectorsOn && displayTotal );
    this.componentsAccelerationVectorsOnProperty.set( accelerationVectorsOn && displayComponents );
    this.totalForceVectorOnProperty.set( forceVectorsOn && displayTotal );
    this.componentsForceVectorsOnProperty.set( forceVectorsOn && displayComponents );
  }
} );

export default VectorsVectorVisibilityProperties;