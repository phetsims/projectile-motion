// Copyright 2016-2023, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import ProjectileMotionViewProperties from '../../common/view/ProjectileMotionViewProperties.js';
import projectileMotion from '../../projectileMotion.js';
import InitialValuesPanel from './InitialValuesPanel.js';
import KeypadLayer from './KeypadLayer.js';
import LabProjectileControlPanel from './LabProjectileControlPanel.js';

// constants
const X_MARGIN = 10;

class LabScreenView extends ProjectileMotionScreenView {

  /**
   * @param {LabModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( { cannonNodeOptions: { preciseCannonDelta: true } }, options );

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new ProjectileMotionViewProperties();

    // acts as listParent for the projectile dropdown box
    const comboBoxListParent = new Node();
    const keypadLayer = new KeypadLayer( {
      tandem: options.tandem.createTandem( 'keypadLayer' ),
      phetioDocumentation: 'The container for the keypad, responsible displaying and laying out the keypad'
    } );
    const labProjectilePanel = new LabProjectileControlPanel(
      comboBoxListParent,
      keypadLayer,
      model,
      { tandem: options.tandem.createTandem( 'projectileControlPanel' ) }
    );

    super(
      model,
      new InitialValuesPanel(
        model.cannonHeightProperty,
        model.cannonAngleProperty,
        model.initialSpeedProperty,
        { tandem: options.tandem.createTandem( 'initialValuesPanel' ) }
      ),
      labProjectilePanel,
      visibilityProperties,
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

  /**
   * Layout according to screenview and layout the combo box
   * @public (joist internal)
   * @override
   *
   * @param {Bounds2} viewBounds
   */
  layout( viewBounds ) {
    this.labProjectilePanel.hideComboBoxList();
    super.layout( viewBounds );
    this.keypadLayer.positionKeypad( this.setKeypadPosition.bind( this ) );
  }

  /**
   * Lays out keypad
   * @private
   *
   * @param {KeypadPanel} keypad
   */
  setKeypadPosition( keypadPanel ) {
    keypadPanel.right = this.topRightPanel.left - X_MARGIN;
    keypadPanel.top = this.bottomRightPanel.top;
  }
}

projectileMotion.register( 'LabScreenView', LabScreenView );
export default LabScreenView;
