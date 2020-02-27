// Copyright 2016-2019, University of Colorado Boulder

/**
 * ScreenView for the 'Vectors' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  const VectorsProjectilePanel = require( 'PROJECTILE_MOTION/vectors/view/VectorsProjectilePanel' );
  const VectorsVectorsPanel = require( 'PROJECTILE_MOTION/vectors/view/VectorsVectorsPanel' );
  const VectorsVectorVisibilityProperties = require( 'PROJECTILE_MOTION/vectors/view/VectorsVectorVisibilityProperties' );

  /**
   * @param {VectorsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function VectorsScreenView( model, tandem, options ) {

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new VectorsVectorVisibilityProperties( tandem.createTandem( 'vectorVisibilityProperties' ) );

    ProjectileMotionScreenView.call(
      this,
      model,
      new VectorsProjectilePanel(
        model.selectedProjectileObjectTypeProperty,
        model.projectileDiameterProperty,
        model.projectileMassProperty,
        model.airResistanceOnProperty,
        model.projectileDragCoefficientProperty,
        { tandem: tandem.createTandem( 'projectileControlPanel' ) }
      ),
      new VectorsVectorsPanel( visibilityProperties, { tandem: tandem.createTandem( 'vectorsPanel' ) } ),
      visibilityProperties,
      tandem,
      options
    );
  }

  projectileMotion.register( 'VectorsScreenView', VectorsScreenView );

  return inherit( ProjectileMotionScreenView, VectorsScreenView );
} );

