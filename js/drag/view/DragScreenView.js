// Copyright 2016-2019, University of Colorado Boulder

/**
 * ScreenView for the 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragProjectilePanel = require( 'PROJECTILE_MOTION/drag/view/DragProjectilePanel' );
  const DragVectorsPanel = require( 'PROJECTILE_MOTION/drag/view/DragVectorsPanel' );
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
      new DragProjectilePanel(
        model.selectedProjectileObjectTypeProperty,
        model.projectileDragCoefficientProperty,
        model.projectileDiameterProperty,
        model.projectileMassProperty,
        model.altitudeProperty,
        { tandem: tandem.createTandem( 'projectileControlPanel' ) }
      ),
      new DragVectorsPanel( visibilityProperties, { tandem: tandem.createTandem( 'vectorsControlPanel' ) } ),
      visibilityProperties,
      tandem,
      options );
  }

  projectileMotion.register( 'DragScreenView', DragScreenView );

  return inherit( ProjectileMotionScreenView, DragScreenView );
} );

