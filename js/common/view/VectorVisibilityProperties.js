// Copyright 2015-2016, University of Colorado Boulder

/**
 * View properties that are specific to visibility of vectors
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function VectorVisibilityProperties() {

    // @public {Property.<boolean>} whether total velocity vector is showing
    this.totalVelocityVectorOnProperty = new Property( false );

    // @public {Property.<boolean>} whether component velocity vectors are showing
    this.componentsVelocityVectorsOnProperty = new Property( false );

    // @public {Property.<boolean>} whether total force vector is showing
    this.totalForceVectorOnProperty = new Property( false );

    // @public {Property.<boolean>} whether component force vectors are showing
    this.componentsForceVectorsOnProperty = new Property( false );

    // @public {Property.<boolean>} whether component acceleration vectors are showing
    this.componentsAccelerationVectorsOnProperty = new Property( false );

  }

  projectileMotion.register( 'VectorVisibilityProperties', VectorVisibilityProperties );

  return inherit( Object, VectorVisibilityProperties, {

    // @public
    reset: function() {
      this.totalVelocityVectorOnProperty.reset();
      this.componentsVelocityVectorsOnProperty.reset();
      this.totalForceVectorOnProperty.reset();
      this.componentsForceVectorsOnProperty.reset();
      this.componentsAccelerationVectorsOnProperty.reset();
    }
  } );
} );
