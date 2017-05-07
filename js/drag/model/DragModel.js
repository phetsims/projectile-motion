// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  var Property = require( 'AXON/Property' );
  /**
   * @constructor
   */
  function DragModel() {
    var self = this;
    ProjectileMotionModel.call( self );

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

    this.airResistanceOnProperty.set( true ); // since this screen explores drag, always leave air resistance on
  }

  projectileMotion.register( 'DragModel', DragModel );

  return inherit( ProjectileMotionModel, DragModel, {
    // @public resets all drag model elements, first calling the super class' reset
    reset: function() {
      ProjectileMotionModel.prototype.reset.call( this );
      this.velocityVectorsOnProperty.reset();
      this.forceVectorsOnProperty.reset();
      this.totalOrComponentsProperty.reset();
      this.airResistanceOnProperty.set( true );// since this screen explores drag, always leave air resistance on
    }
  } );
} );

