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

    ProjectileMotionModel.call( this, ProjectileObjectType.DRAG_SCREEN, true );

  }

  projectileMotion.register( 'DragModel', DragModel );

  return inherit( ProjectileMotionModel, DragModel );
} );

