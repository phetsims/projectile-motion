// Copyright 2016-2019, University of Colorado Boulder

/**
 * ScreenView for the 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragProjectileControlPanel = require( 'PROJECTILE_MOTION/drag/view/DragProjectileControlPanel' );
  const DragVectorsControlPanel = require( 'PROJECTILE_MOTION/drag/view/DragVectorsControlPanel' );
  const DragVectorVisibilityProperties = require( 'PROJECTILE_MOTION/drag/view/DragVectorVisibilityProperties' );
  const inherit = require( 'PHET_CORE/inherit' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );

  /**
   * @param {DragModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function DragScreenView( model, tandem, options ) {

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new DragVectorVisibilityProperties( tandem.createTandem( 'vectorVisibilityProperties' ) );

    ProjectileMotionScreenView.call(
      this,
      model,
      new DragProjectileControlPanel(
        model.selectedProjectileObjectTypeProperty,
        model.projectileDragCoefficientProperty,
        model.projectileDiameterProperty,
        model.projectileMassProperty,
        model.altitudeProperty,
        { tandem: tandem.createTandem( 'projectileControlPanel' ) }
      ),
      new DragVectorsControlPanel( visibilityProperties, { tandem: tandem.createTandem( 'vectorsControlPanel' ) } ),
      visibilityProperties,
      tandem,
      options );
  }

  projectileMotion.register( 'DragScreenView', DragScreenView );

  return inherit( ProjectileMotionScreenView, DragScreenView );
} );

