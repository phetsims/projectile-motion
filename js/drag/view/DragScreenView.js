// Copyright 2016-2017, University of Colorado Boulder

/**
 * ScreenView for the 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DragVectorsPanel = require( 'PROJECTILE_MOTION/drag/view/DragVectorsPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  var DragProjectilePanel = require( 'PROJECTILE_MOTION/drag/view/DragProjectilePanel' );
  var DragVectorVisibilityProperties = require( 'PROJECTILE_MOTION/drag/view/DragVectorVisibilityProperties' );

  /**
   * @param {DragModel} model
   * @param {Object} [options]
   * @constructor
   */
  function DragScreenView( model, options ) {

    // contains Properties about vector visibility, used in super class
    var visibilityProperties = new DragVectorVisibilityProperties();

    ProjectileMotionScreenView.call(
      this,
      model,
      new DragProjectilePanel(
        model.selectedProjectileObjectTypeProperty,
        model.projectileDragCoefficientProperty,
        model.projectileDiameterProperty,
        model.projectileMassProperty,
        model.altitudeProperty
      ),
      new DragVectorsPanel( visibilityProperties ),
      visibilityProperties,
      options
    );

  }

  projectileMotion.register( 'DragScreenView', DragScreenView );

  return inherit( ProjectileMotionScreenView, DragScreenView );
} );

