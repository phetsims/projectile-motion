// Copyright 2015, University of Colorado Boulder

/**
 * ScreenView for the 'Vectors' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var VectorsVectorsPanel = require( 'PROJECTILE_MOTION/vectors/view/VectorsVectorsPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  var VectorsProjectilePanel = require( 'PROJECTILE_MOTION/vectors/view/VectorsProjectilePanel' );
  var VectorsVectorVisibilityProperties = require( 'PROJECTILE_MOTION/vectors/view/VectorsVectorVisibilityProperties' );

  /**
   * @param {VectorsModel} model
   * @param {Object} [options]
   * @constructor
   */
  function VectorsScreenView( model, options ) {

    options = options || {};

    // contains properties about vector visibility, used in super class
    var visibilityProperties = new VectorsVectorVisibilityProperties();

    ProjectileMotionScreenView.call(
                                    this,
                                    model,
                                    new VectorsProjectilePanel(
                                                            model.projectileDiameterProperty,
                                                            model.projectileMassProperty,
                                                            model.airResistanceOnProperty,
                                                            model.projectileDragCoefficientProperty,
                                                            model.gravityProperty
                                    ),
                                    new VectorsVectorsPanel( visibilityProperties ),
                                    visibilityProperties,
                                    options
    );

  }

  projectileMotion.register( 'VectorsScreenView', VectorsScreenView );

  return inherit( ProjectileMotionScreenView, VectorsScreenView );
} );

