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
  var KeypadLayer = require( 'PROJECTILE_MOTION/lab/view/KeypadLayer' );

  // constants
  var X_MARGIN = 10;
  var Y_MARGIN = 5;

  /**
   * @param {LabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function LabScreenView( model, options ) {

    options = options || {};
    options = _.extend( { preciseCannonDelta: true }, options );
    
    // contains properties about vector visibility, used in super class
    var visibilityProperties = new VectorVisibilityProperties();

    // acts as listParent for the projectile dropdown box
    var comboBoxListParent = new Node();
    var keypadLayer = new KeypadLayer( { decimalPointKey: true } );

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
                                                            keypadLayer,
                                                            this.setKeypadLayer.bind( this ),
                                                            model.projectileMassProperty,
                                                            model.projectileDiameterProperty,
                                                            model.projectileDragCoefficientProperty,
                                                            model.altitudeProperty,
                                                            model.airResistanceOnProperty,
                                                            model.gravityProperty
                                    ),
                                    visibilityProperties,
                                    options
    );

    this.insertChild( this.indexOfChild( this.bottomRightPanel ) + 1, comboBoxListParent );
    this.addChild( keypadLayer );

    // @private, for layout
    this.keypadLayer = keypadLayer;


  }

  projectileMotion.register( 'LabScreenView', LabScreenView );

  return inherit( ProjectileMotionScreenView, LabScreenView, {
    
    /**
     * Layout according to screenview and layout the combo box
     * @public
     * @override
     * 
     * @param  {number} width
     * @param  {number} height
     */
    layout: function( width, height ) {
      ProjectileMotionScreenView.prototype.layout.call( this, width, height );
      this.bottomRightPanel.layoutComboBox();
      this.keypadLayer.positionKeypad( this.setKeypadLayer.bind( this ) );
    },

    /**
     * Lays out keypad
     * @private
     * 
     * @param {KeypadPanel} keypad
     */
    setKeypadLayer: function (keypad ) {
      keypad.right = this.topRightPanel.left - X_MARGIN;
      keypad.top = this.toolboxPanel.bottom + Y_MARGIN;
    }

  } );
} );


