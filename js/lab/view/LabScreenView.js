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
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {LabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function LabScreenView( model, options ) {

    options = options || {};
    
    // contains properties about vector visibility, used in super class
    var visibilityProperties = new VectorVisibilityProperties();

    // acts as listParent for the projectile dropdown box
    var comboBoxListParent = new Node();

    ProjectileMotionScreenView.call(
                                    this,
                                    model,
                                    new InitialValuesPanel(
                                                            model.cannonHeightProperty,
                                                            model.cannonAngleProperty,
                                                            model.launchVelocityProperty
                                    ),
                                    new LabProjectilePanel(
                                                            model.objectTypes,
                                                            model.selectedProjectileObjectTypeProperty,
                                                            comboBoxListParent,
                                                            model.projectileMassProperty,
                                                            model.projectileDiameterProperty,
                                                            model.projectileDragCoefficientProperty,
                                                            model.altitudeProperty,
                                                            model.airResistanceOnProperty
                                    ),
                                    visibilityProperties,
                                    options
    );

    this.insertChild( this.indexOfChild( this.bottomRightPanel ) + 1, comboBoxListParent );

  }

  projectileMotion.register( 'LabScreenView', LabScreenView );

  return inherit( ProjectileMotionScreenView, LabScreenView, {
    // @public
    layout: function( width, height ) {
      ProjectileMotionScreenView.prototype.layout.call( this, width, height );
      this.bottomRightPanel.layoutComboBox();
    }

  } );
} );


