// Copyright 2016-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import VectorVisibilityProperties from '../../common/view/VectorVisibilityProperties.js';
import projectileMotion from '../../projectileMotion.js';
import InitialValuesPanel from './InitialValuesPanel.js';
import KeypadLayer from './KeypadLayer.js';
import LabProjectileControlPanel from './LabProjectileControlPanel.js';

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
  const labProjectilePanel = new LabProjectileControlPanel(
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

inherit( ProjectileMotionScreenView, LabScreenView, {

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
    this.keypadLayer.positionKeypad( this.setKeypadPosition.bind( this ) );
  },

  /**
   * Lays out keypad
   * @private
   *
   * @param {KeypadPanel} keypad
   */
  setKeypadPosition: function( keypadPanel ) {
    keypadPanel.right = this.topRightPanel.left - X_MARGIN;
    keypadPanel.top = this.bottomRightPanel.top;
  }

} );

export default LabScreenView;
