// Copyright 2017-2020, University of Colorado Boulder

/**
 * View Properties that are specific to visibility of vectors
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectileMotion from '../../projectileMotion.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function VectorVisibilityProperties( options ) {

  options = merge( {
    tandem: Tandem.OPTIONAL,
    forceProperties: true,
    accelerationProperties: true
  }, options );

  this.forceProperties = options.forceProperties;
  this.accelerationProperties = options.accelerationProperties;

  // @public whether total velocity vector is showing
  this.totalVelocityVectorOnProperty = new BooleanProperty( false, {
    tandem: options.tandem.createTandem( 'totalVelocityVectorOnProperty' ),
    phetioDocumentation: 'Whether or not to display the total velocity vectors for flying projectiles'
  } );

  // @public whether component velocity vectors are showing
  this.componentsVelocityVectorsOnProperty = new BooleanProperty( false, {
    tandem: options.tandem.createTandem( 'componentsVelocityVectorsOnProperty' ),
    phetioDocumentation: 'Whether or not to display the component velocity vectors for flying projectiles'
  } );

  if ( options.accelerationProperties ) {

    // @public whether total acceleration vector is shown
    this.totalAccelerationVectorOnProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'totalAccelerationVectorOnProperty' ),
      phetioDocumentation: 'Whether or not to display the total acceleration vectors for flying projectiles'
    } );

    // @public whether component acceleration vectors are showing
    this.componentsAccelerationVectorsOnProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'componentsAccelerationVectorsOnProperty' ),
      phetioDocumentation: 'Whether or not to display the component acceleration vectors for flying projectiles'
    } );
  }

  if ( options.forceProperties ) {

    // @public whether total force vector is showing
    this.totalForceVectorOnProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'totalForceVectorOnProperty' ),
      phetioDocumentation: 'Whether or not to display the total force vectors in a free body diagram for flying projectiles'
    } );

    // @public whether component force vectors are showing
    this.componentsForceVectorsOnProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'componentsForceVectorsOnProperty' ),
      phetioDocumentation: 'Whether or not to display the component force vectors in a free body diagram for flying projectiles'
    } );

  }

}

projectileMotion.register( 'VectorVisibilityProperties', VectorVisibilityProperties );

inherit( Object, VectorVisibilityProperties, {

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

export default VectorVisibilityProperties;