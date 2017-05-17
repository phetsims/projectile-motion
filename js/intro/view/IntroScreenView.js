// Copyright 2015, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroProjectilePanel = require( 'PROJECTILE_MOTION/intro/view/IntroProjectilePanel' );
  var IntroVectorsPanel = require( 'PROJECTILE_MOTION/intro/view/IntroVectorsPanel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  var VectorVisibilityProperties = require( 'PROJECTILE_MOTION/common/view/VectorVisibilityProperties' );

  /**
   * @param {IntroModel} model
   * @constructor
   */
  function IntroScreenView( model, options ) {

    options = options || {};
    
    // contains properties about vector visibility, used in super class
    var visibilityProperties = new VectorVisibilityProperties();

    ProjectileMotionScreenView.call(
                                    this,
                                    model,
                                    new IntroProjectilePanel(
                                                              model.objectTypes,
                                                              model.selectedProjectileObjectTypeProperty,
                                                              model.projectileMassProperty,
                                                              model.projectileDiameterProperty,
                                                              model.projectileDragCoefficientProperty,
                                                              model.airResistanceOnProperty
                                    ),
                                    new IntroVectorsPanel( visibilityProperties ),
                                    visibilityProperties,
                                    options
    );
  }

  projectileMotion.register( 'IntroScreenView', IntroScreenView );

  return inherit( ProjectileMotionScreenView, IntroScreenView );
} );

