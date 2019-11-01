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
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function VectorVisibilityProperties( options ) {

    options = merge( {
      tandem: Tandem.optional,
      forceProperties: true,
      accelerationProperties: true
    }, options );

    this.forceProperties = options.forceProperties;
    this.accelerationProperties = options.accelerationProperties;

    // @public whether total velocity vector is showing
    this.totalVelocityVectorOnProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'totalVelocityVectorOnProperty' )
    } );

    // @public whether component velocity vectors are showing
    this.componentsVelocityVectorsOnProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'componentsVelocityVectorsOnProperty' )
    } );

    if ( options.accelerationProperties ) {

      // @public whether total acceleration vector is shown
      this.totalAccelerationVectorOnProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'totalAccelerationVectorOnProperty' )
      } );

      // @public whether component acceleration vectors are showing
      this.componentsAccelerationVectorsOnProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'componentsAccelerationVectorsOnProperty' )
      } );
    }

    if ( options.forceProperties ) {

      // @public whether total force vector is showing
      this.totalForceVectorOnProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'totalForceVectorOnProperty' )
      } );

      // @public whether component force vectors are showing
      this.componentsForceVectorsOnProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'componentsForceVectorsOnProperty' )
      } );

    }

  }

  projectileMotion.register( 'VectorVisibilityProperties', VectorVisibilityProperties );

  return inherit( Object, VectorVisibilityProperties, {

    /**
     * Reset these Properties
     * @public
     * @override
     */
    reset: function() {
      this.totalVelocityVectorOnProperty.reset();
      this.componentsVelocityVectorsOnProperty.reset();

      if ( this.accelerationProperties ) {
        this.totalAccelerationVectorOnProperty.reset();
        this.componentsAccelerationVectorsOnProperty.reset();
      }
      if ( this.forceProperties ) {
        this.totalForceVectorOnProperty.reset();
        this.componentsForceVectorsOnProperty.reset();
      }
    }
  } );
} );
