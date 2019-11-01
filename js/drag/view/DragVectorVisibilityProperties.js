// Copyright 2017-2019, University of Colorado Boulder

/**
 * View Properties that are specific to visibility of vectors
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const Property = require( 'AXON/Property' );
  const VectorsDisplayEnumeration = require( 'PROJECTILE_MOTION/common/view/VectorsDisplayEnumeration' );
  const VectorVisibilityProperties = require( 'PROJECTILE_MOTION/common/view/VectorVisibilityProperties' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function DragVectorVisibilityProperties( tandem ) {
    VectorVisibilityProperties.call( this, {
      accelerationProperties: false
    } );

    // @public vectors visibility for velocity and force, total or component
    this.velocityVectorsOnProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'velocityVectorsOnProperty' ) } );
    this.forceVectorsOnProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'forceVectorsOnProperty' ) } );
    this.vectorsDisplayProperty = new EnumerationProperty( VectorsDisplayEnumeration, VectorsDisplayEnumeration.TOTAL, {
      tandem: tandem.createTandem( 'vectorsDisplayProperty' )
    } );

    // update which vectors to show based on controls
    // Doesn't need to be disposed because it lasts for the lifetime of the sim
    Property.multilink( [
      this.velocityVectorsOnProperty,
      this.forceVectorsOnProperty,
      this.vectorsDisplayProperty
    ], this.updateVectorVisibilities.bind( this ) );

  }

  projectileMotion.register( 'DragVectorVisibilityProperties', DragVectorVisibilityProperties );

  return inherit( VectorVisibilityProperties, DragVectorVisibilityProperties, {

    /**
     * Reset these Properties
     * @public
     * @override
     */
    reset: function() {
      VectorVisibilityProperties.prototype.reset.call( this );
      this.velocityVectorsOnProperty.reset();
      this.forceVectorsOnProperty.reset();
      this.vectorsDisplayProperty.reset();
    },

    /**
     * Update vector visibilities based on whether velocity and/or force vectors are on, and whether total or components
     * @private
     *
     * @param {boolean} velocityVectorsOn
     * @param {boolean} forceVectorsOn
     * @param {string} vectorsDisplay
     */
    updateVectorVisibilities: function( velocityVectorsOn, forceVectorsOn, vectorsDisplay ) {
      const displayTotal = vectorsDisplay === VectorsDisplayEnumeration.TOTAL;
      const displayComponents = vectorsDisplay === VectorsDisplayEnumeration.COMPONENTS;

      this.totalVelocityVectorOnProperty.set( velocityVectorsOn && displayTotal );
      this.componentsVelocityVectorsOnProperty.set( velocityVectorsOn && displayComponents );
      this.totalForceVectorOnProperty.set( forceVectorsOn && displayTotal );
      this.componentsForceVectorsOnProperty.set( forceVectorsOn && displayComponents );
    }
  } );
} );
