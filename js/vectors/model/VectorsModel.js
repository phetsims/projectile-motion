// Copyright 2015, University of Colorado Boulder

/**
 * Model for the 'Vectors' Screen.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  
  /**
   * @constructor
   */
  function VectorsModel() {
    ProjectileMotionModel.call( this );

    this.airResistanceOnProperty.set( true ); // since this screen explores drag, always leave air resistance on
  }

  projectileMotion.register( 'VectorsModel', VectorsModel );

  return inherit( ProjectileMotionModel, VectorsModel, {
    // @public resets all drag model elements, first calling the super class' reset
    reset: function() {
      ProjectileMotionModel.prototype.reset.call( this );
      this.airResistanceOnProperty.set( true );// since this screen explores drag, always leave air resistance on
    }
  } );
} );

