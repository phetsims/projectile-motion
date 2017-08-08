// Copyright 2017, University of Colorado Boulder

/**
 * View Properties that are specific to visibility of vectors
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );

  /**
   * @constructor
   */
  function VectorVisibilityProperties() {

    // @public whether total velocity vector is showing
    this.totalVelocityVectorOnProperty = new BooleanProperty( false );

    // @public whether component velocity vectors are showing
    this.componentsVelocityVectorsOnProperty = new BooleanProperty( false );

    // @public whether total force vector is showing
    this.totalForceVectorOnProperty = new BooleanProperty( false );

    // @public whether component force vectors are showing
    this.componentsForceVectorsOnProperty = new BooleanProperty( false );

    // @public whether total acceleration vector is shown
    this.totalAccelerationVectorOnProperty = new BooleanProperty( false );

    // @public whether component acceleration vectors are showing
    this.componentsAccelerationVectorsOnProperty = new BooleanProperty( false );

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
      this.totalForceVectorOnProperty.reset();
      this.componentsForceVectorsOnProperty.reset();
      this.totalAccelerationVectorOnProperty.reset();
      this.componentsAccelerationVectorsOnProperty.reset();
    }
  } );
} );
