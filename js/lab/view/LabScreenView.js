// Copyright 2016-2017, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen
 * @author Andrea Lin (PhET Interactive Simulations)
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

  /**
   * @param {LabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function LabScreenView( model, options ) {

    options = _.extend( { preciseCannonDelta: true }, options );

    // contains Properties about vector visibility, used in super class
    var visibilityProperties = new VectorVisibilityProperties();

    // acts as listParent for the projectile dropdown box
    var comboBoxListParent = new Node();
    var keypadLayer = new KeypadLayer();

    ProjectileMotionScreenView.call(
      this,
      model,
      new InitialValuesPanel(
        model.cannonHeightProperty,
        model.cannonAngleProperty,
        model.launchVelocityProperty
      ),
      new LabProjectilePanel(
        comboBoxListParent,
        keypadLayer,
        model
      ),
      visibilityProperties,
      options
    );
    
    // insert dropdown right on top of the rightside panels
    this.insertChild( this.indexOfChild( this.bottomRightPanel ) + 1, comboBoxListParent );

    // add the keypad layer on top of everything
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
     * @param {number} width
     * @param {number} height
     */
    layout: function( width, height ) {
      ProjectileMotionScreenView.prototype.layout.call( this, width, height );
      this.bottomRightPanel.layoutComboBox();
      this.keypadLayer.positionKeypad( this.setKeypadLocation.bind( this ) );
    },

    /**
     * Lays out keypad
     * @private
     *
     * @param {KeypadPanel} keypad
     */
    setKeypadLocation: function( keypadPanel ) {
      keypadPanel.right = this.topRightPanel.left - X_MARGIN;
      keypadPanel.top = this.bottomRightPanel.top;
    }

  } );
} );


