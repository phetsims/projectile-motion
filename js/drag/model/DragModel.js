// Copyright 2015, University of Colorado Boulder

/**
 * Model for the 'Drag' Screen.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  var ProjectileObjectType = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectType' );

  /**
   * @constructor
   */
  function DragModel() {

    ProjectileMotionModel.call( this, ProjectileObjectType.DRAG_SCREEN );
    
    // TODO: put these three as parameters into ProjectileMotionModel
    
    this.airResistanceOnProperty.set( true ); // since this screen explores drag, always leave air resistance on
    
  }

  projectileMotion.register( 'DragModel', DragModel );

  return inherit( ProjectileMotionModel, DragModel, {

    // @public resets all drag model elements, first calling the super class' reset
    reset: function() {
      ProjectileMotionModel.prototype.reset.call( this );
      this.airResistanceOnProperty.set( true );// since this screen explores drag, always leave air resistance on
      this.selectedProjectileObjectTypeProperty.reset();
    }
  } );
} );

