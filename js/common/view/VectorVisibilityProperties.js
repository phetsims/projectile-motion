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
  var BooleanProperty = require( 'AXON/BooleanProperty' );

  /**
   * @constructor
   */
  function VectorVisibilityProperties() {

    // @public {BooleanProperty.<boolean>} whether total velocity vector is showing
    this.totalVelocityVectorOnProperty = new BooleanProperty( false );

    // @public {BooleanProperty.<boolean>} whether component velocity vectors are showing
    this.componentsVelocityVectorsOnProperty = new BooleanProperty( false );

    // @public {BooleanProperty.<boolean>} whether total force vector is showing
    this.totalForceVectorOnProperty = new BooleanProperty( false );

    // @public {BooleanProperty.<boolean>} whether component force vectors are showing
    this.componentsForceVectorsOnProperty = new BooleanProperty( false );

    // @public {BooleanProperty.<boolean>} whether total acceleration vector is shown
    this.totalAccelerationVectorOnProperty = new BooleanProperty ( false );

    // @public {BooleanProperty.<boolean>} whether component acceleration vectors are showing
    this.componentsAccelerationVectorsOnProperty = new BooleanProperty( false );

  }

  projectileMotion.register( 'VectorVisibilityProperties', VectorVisibilityProperties );

  return inherit( Object, VectorVisibilityProperties, {

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
