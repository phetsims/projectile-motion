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
  var VectorVisibilityProperties = require( 'PROJECTILE_MOTION/common/view/VectorVisibilityProperties' );

  /**
   * @constructor
   */
  function DragVectorVisibilityProperties() {

    var self = this;

    VectorVisibilityProperties.call( this );
  
    // vectors visibility for velocity and force, total or component
    this.velocityVectorsOnProperty = new Property( false );
    this.forceVectorsOnProperty = new Property( false );
    this.totalOrComponentsProperty = new Property( 'total' ); // or 'components'

    // update which vectors to show based on controls
    Property.multilink( [ this.velocityVectorsOnProperty, this.forceVectorsOnProperty, this.totalOrComponentsProperty ], function() {
      self.totalVelocityVectorOnProperty.set( self.velocityVectorsOnProperty.get() && self.totalOrComponentsProperty.get() === 'total' );
      self.componentsVelocityVectorsOnProperty.set( self.velocityVectorsOnProperty.get() && self.totalOrComponentsProperty.get() === 'components' );
      self.totalForceVectorOnProperty.set( self.forceVectorsOnProperty.get() && self.totalOrComponentsProperty.get() === 'total' );
      self.componentsForceVectorsOnProperty.set( self.forceVectorsOnProperty.get() && self.totalOrComponentsProperty.get() === 'components' );
    } );

  }

  projectileMotion.register( 'DragVectorVisibilityProperties', DragVectorVisibilityProperties );

  return inherit( VectorVisibilityProperties, DragVectorVisibilityProperties, {

    // @public @override
    reset: function() {
      VectorVisibilityProperties.prototype.reset.call( this );
      this.velocityVectorsOnProperty.reset();
      this.forceVectorsOnProperty.reset();
      this.totalOrComponentsProperty.reset();
    }
  } );
} );
