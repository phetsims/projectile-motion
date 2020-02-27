// Copyright 2016-2019, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const InitialValuesPanel = require( 'PROJECTILE_MOTION/lab/view/InitialValuesPanel' );
  const KeypadLayer = require( 'PROJECTILE_MOTION/lab/view/KeypadLayer' );
  const LabProjectilePanel = require( 'PROJECTILE_MOTION/lab/view/LabProjectilePanel' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  const VectorVisibilityProperties = require( 'PROJECTILE_MOTION/common/view/VectorVisibilityProperties' );

  // constants
  const X_MARGIN = 10;

  /**
   * @param {LabModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function LabScreenView( model, tandem, options ) {

    options = merge( { preciseCannonDelta: true }, options );

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new VectorVisibilityProperties();

    // acts as listParent for the projectile dropdown box
    const comboBoxListParent = new Node();
    const keypadLayer = new KeypadLayer( {
      tandem: tandem.createTandem( 'keypadLayer' ),
      phetioDocumentation: 'The container for the keypad, responsible displaying and laying out the keypad'
    } );
    const labProjectilePanel = new LabProjectilePanel(
      comboBoxListParent,
      keypadLayer,
      model,
      { tandem: tandem.createTandem( 'projectileControlPanel' ) }
    );

    ProjectileMotionScreenView.call(
      this,
      model,
      new InitialValuesPanel(
        model.cannonHeightProperty,
        model.cannonAngleProperty,
        model.initialSpeedProperty,
        { tandem: tandem.createTandem( 'initialValuesPanel' ) }
      ),
      labProjectilePanel,
      visibilityProperties,
      tandem,
      options
    );

    // insert dropdown right on top of the rightside panels
    this.insertChild( this.indexOfChild( this.bottomRightPanel ) + 1, comboBoxListParent );

    // add the keypad layer on top of everything
    this.addChild( keypadLayer );

    // @private, for layout
    this.labProjectilePanel = labProjectilePanel;
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
      this.labProjectilePanel.hideComboBoxList();
      ProjectileMotionScreenView.prototype.layout.call( this, width, height );
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


