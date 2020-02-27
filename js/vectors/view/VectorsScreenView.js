// Copyright 2016-2020, University of Colorado Boulder

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
  const VectorsProjectileControlPanel = require( 'PROJECTILE_MOTION/vectors/view/VectorsProjectileControlPanel' );
  const VectorsVectorsControlPanel = require( 'PROJECTILE_MOTION/vectors/view/VectorsVectorsControlPanel' );
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
      new VectorsProjectileControlPanel(
        model.selectedProjectileObjectTypeProperty,
        model.projectileDiameterProperty,
        model.projectileMassProperty,
        model.airResistanceOnProperty,
        model.projectileDragCoefficientProperty,
        { tandem: tandem.createTandem( 'projectileControlPanel' ) }
      ),
      new VectorsVectorsControlPanel( visibilityProperties, { tandem: tandem.createTandem( 'vectorsControlPanel' ) } ),
      visibilityProperties,
      tandem,
      options
    );
  }

  projectileMotion.register( 'VectorsScreenView', VectorsScreenView );

  return inherit( ProjectileMotionScreenView, VectorsScreenView );
} );

