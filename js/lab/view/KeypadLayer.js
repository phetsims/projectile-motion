// Copyright 2017-2023, University of Colorado Boulder

/**
 * KeypadLayer handles creation and management of a modal keypad.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Keypad from '../../../../scenery-phet/js/keypad/Keypad.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { FireListener, Node, Plane, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';

const enterString = ProjectileMotionStrings.enter;
const rangeMessageString = ProjectileMotionStrings.rangeMessage;

// constants
const TEXT_FONT = ProjectileMotionConstants.LABEL_TEXT_OPTIONS.font;
const TEXT_FILL_DEFAULT = 'black';
const TEXT_FILL_ERROR = 'red';

class KeypadLayer extends Plane {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      valueBoxWidth: 85, // {number} width of the value field, height determined by valueFont
      valueYMargin: 3, // {number} vertical margin inside the value box
      valueFont: TEXT_FONT,
      maxDigits: 8, // {number} maximum number of digits that can be entered on the keypad
      maxDecimals: 2, // {number} maximum number of decimal places that can be entered on the keypd

      // supertype options
      visible: false,
      fill: 'rgba( 0, 0, 0, 0.2 )',
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // @private - clicking outside the keypad cancels the edit
    this.clickOutsideFireListener = new FireListener( {
      fire: event => {
        if ( event.trail.lastNode() === this ) {
          this.cancelEdit();

          // Because firing this involves hiding this Node, we need to clear the current over pointer in order make sure
          // we don't get two enter events next time this listener is called. See https://github.com/phetsims/scenery/issues/1021
          this.clickOutsideFireListener.clearOverPointers();
        }
      },
      fireOnDown: true,
      tandem: options.tandem.createTandem( 'clickOutsideFireListener' ),
      phetioDocumentation: 'Listener responsible for hiding the KeypadLayer when space outside of the keypad is pressed.'
    } );

    // @private these will be set when the client calls beginEdit
    this.valueProperty = null;
    this.onEndEdit = null; // {function} called by endEdit

    const valueNode = new Text( '', {
      font: options.valueFont
    } );

    const valueBackgroundNode = new Rectangle( 0, 0, options.valueBoxWidth, valueNode.height + ( 2 * options.valueYMargin ), {
      cornerRadius: 3,
      fill: 'white',
      stroke: 'black'
    } );

    const valueParent = new Node( {
      children: [ valueBackgroundNode, valueNode ]
    } );

    this.keypadNode = new Keypad( Keypad.PositiveFloatingPointLayout, {
      accumulatorOptions: {
        maxDigits: options.maxDigits,
        maxDigitsRightOfMantissa: options.maxDecimals
      },
      tandem: options.tandem.createTandem( 'keypad' ),
      phetioDocumentation: 'The keypad UI component for user to enter in a custom number'
    } );

    const enterButton = new RectangularPushButton( {
      listener: this.commitEdit.bind( this ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      content: new Text( enterString, {
        font: TEXT_FONT,
        fill: 'black',
        maxWidth: this.keypadNode.width // i18n
      } ),
      tandem: options.tandem.createTandem( 'enterButton' ),
      phetioDocumentation: 'The button to submit a custom number with the keypad'
    } );

    const rangeMessageText = new Text( '', { font: TEXT_FONT, maxWidth: this.keypadNode.width } );

    // @private for convenient access by methods
    this.valueNode = valueNode;
    this.rangeMessageText = rangeMessageText;

    const valueAndRangeMessage = new VBox( {
      spacing: 5,
      align: 'center',
      children: [ rangeMessageText, valueParent ]
    } );

    const contentNode = new VBox( {
      spacing: 10,
      align: 'center',
      children: [ valueAndRangeMessage, this.keypadNode, enterButton ]
    } );

    // @private
    this.saidHello = false;
    const helloText = new Text( 'Hello!', { font: TEXT_FONT } );

    // @private

    this.addHelloText = () => {
      if ( !contentNode.hasChild( helloText ) && !this.saidHello ) {
        contentNode.addChild( helloText );
        this.saidHello = true;
      }
    };

    this.removeHelloText = () => {
      if ( contentNode.hasChild( helloText ) ) {
        contentNode.removeChild( helloText );
      }
    };

    this.keypadPanel = new Panel( contentNode, {
      fill: 'rgb( 230, 230, 230 )', // {Color|string} the keypad's background color
      backgroundPickable: true, // {boolean} so that clicking in the keypad's background doesn't close the keypad
      xMargin: 10,
      yMargin: 10
    } );

    this.addChild( this.keypadPanel );

    // The keypad lasts for the lifetime of the sim, so the links don't need to be disposed
    this.keypadNode.stringProperty.link( string => { // no unlink required
      valueNode.string = string;
      valueNode.center = valueBackgroundNode.center;
    } );

    // for resetting color of value to black when it has been red.
    this.keypadNode.accumulatedKeysProperty.link( keys => {
      valueNode.fill = TEXT_FILL_DEFAULT;
      rangeMessageText.fill = TEXT_FILL_DEFAULT;
    } );

  }


  /**
   * Positions keypad
   * @param {function:KeypadPanel} setKeypadPosition - function that lays out keypad, no return
   * @public
   */
  positionKeypad( setKeypadPosition ) {
    this.keypadPanel && setKeypadPosition( this.keypadPanel );
  }

  /**
   * Begins an edit, by opening a modal keypad.
   * @public
   *
   * @param {Property.<number>} valueProperty - the Property to be set by the keypad
   * @param {Range} valueRange
   * @param {Object} [options]
   */
  beginEdit( valueProperty, valueRange, unitsString, options ) {

    options = merge( {
      onBeginEdit: null, // {function} called by beginEdit
      onEndEdit: null // {function} called by endEdit
    }, options );

    this.valueProperty = valueProperty; // remove this reference in endEdit
    this.onEndEdit = options.onEndEdit;

    this.valueRange = valueRange; // update value range to be used in commitedit
    const rangeMessage = StringUtils.fillIn( rangeMessageString, {
      min: valueRange.min,
      max: valueRange.max,
      units: unitsString ? unitsString : ''
    } ).trim();
    this.rangeMessageText.setString( rangeMessage );

    // display the keypad
    this.visible = true;

    // add listener for clicking outside of the keypad, will be removed on endEdit
    this.addInputListener( this.clickOutsideFireListener );

    // execute client-specific hook
    options.onBeginEdit && options.onBeginEdit();
  }

  /**
   * Ends an edit, used by commitEdit and cancelEdit
   * @private
   */
  endEdit() {

    // clear the keypad
    this.keypadNode.clear();

    // hide the keypad
    this.visible = false;
    this.removeInputListener( this.clickOutsideFireListener );
    this.clickOutsideFireListener.clearOverPointers();

    // execute client-specific hook
    this.onEndEdit && this.onEndEdit();

    // remove reference to valueProperty that was passed to beginEdit
    this.valueProperty = null;

    this.removeHelloText();
    this.valueNode.fill = TEXT_FILL_DEFAULT;
  }

  /**
   * Warns the user that out of range
   * @private
   */
  warnOutOfRange() {
    this.valueNode.fill = TEXT_FILL_ERROR;
    this.rangeMessageText.fill = TEXT_FILL_ERROR;
    this.keypadNode.setClearOnNextKeyPress( true );
  }

  /**
   * Commits an edit
   * @private
   */
  commitEdit() {

    const valueRange = this.valueRange;

    // get the value from the keypad
    const value = this.keypadNode.valueProperty.get();

    // not entering a value in the keypad is a cancel
    if ( this.keypadNode.stringProperty.get() === '' ) {
      this.cancelEdit();
      return;
    }

    // if the keypad contains a valid value ...
    if ( valueRange.contains( value ) ) {
      this.valueProperty.set( Utils.toFixedNumber( value, 2 ) );
      this.endEdit();
    }
    else if ( value === 43110 ) {
      if ( !this.saidHello ) {
        this.sayHi();
      }
      else {
        this.removeHelloText();
        this.warnOutOfRange();
      }
    } // out of range
    else {
      this.warnOutOfRange();
    }
  }

  /**
   * Cancels an edit
   * @private
   */
  cancelEdit() {
    this.endEdit();
  }

  /**
   * @private
   */
  sayHi() {
    this.addHelloText();
  }
}

projectileMotion.register( 'KeypadLayer', KeypadLayer );

export default KeypadLayer;
