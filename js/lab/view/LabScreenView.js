// Copyright 2015, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LabProjectilePanel = require( 'PROJECTILE_MOTION/lab/view/LabProjectilePanel' );
  var InitialValuesPanel = require( 'PROJECTILE_MOTION/lab/view/InitialValuesPanel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  var VectorVisibilityProperties = require( 'PROJECTILE_MOTION/common/view/VectorVisibilityProperties' );

  /**
   * @param {LabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function LabScreenView( model, options ) {

    options = options || {};
    
    // contains properties about vector visibility, used in super class
    var visibilityProperties = new VectorVisibilityProperties();

    ProjectileMotionScreenView.call(
                                    this,
                                    model,
                                    new InitialValuesPanel(
                                                            model.cannonHeightProperty,
                                                            model.cannonAngleProperty,
                                                            model.launchVelocityProperty
                                    ),
                                    new LabProjectilePanel(
                                                            model.projectileMassProperty,
                                                            model.projectileDiameterProperty,
                                                            model.projectileDragCoefficientProperty,
                                                            model.altitudeProperty,
                                                            model.airResistanceOnProperty
                                    ),
                                    visibilityProperties,
                                    options
    );

  }

  projectileMotion.register( 'LabScreenView', LabScreenView );

  return inherit( ProjectileMotionScreenView, LabScreenView );
} );

