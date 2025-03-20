// Copyright 2017-2025, University of Colorado Boulder

/**
 * KeypadLayer handles creation and management of a modal keypad.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Keypad from '../../../../scenery-phet/js/keypad/Keypad.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import FireListener from '../../../../scenery/js/listeners/FireListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Plane, { PlaneOptions } from '../../../../scenery/js/nodes/Plane.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const enterString = ProjectileMotionStrings.enter;
const rangeMessageString = ProjectileMotionStrings.rangeMessage;

// constants
const TEXT_FONT = ProjectileMotionConstants.LABEL_TEXT_OPTIONS.font;
const TEXT_FILL_DEFAULT = 'black';
const TEXT_FILL_ERROR = 'red';

type SelfOptions = {
  valueFont?: PhetFont;
  valueBoxWidth?: number; // width of the value field, height determined by valueFont
  valueYMargin?: number; // vertical margin inside the value box
  maxDigits?: number; // maximum number of digits that can be entered on the keypad
  maxDecimals?: number; // maximum number of decimal places that can be entered on the keypd
};
type KeypadLayerOptions = SelfOptions & PlaneOptions;

type BeginEditOptions = {
  onBeginEdit: ( () => void ) | null;
  onEndEdit: ( () => void ) | null;
};

class KeypadLayer extends Plane {

  private readonly addHelloText;
  private readonly clickOutsideFireListener;
  private readonly valueNode;
  private readonly rangeMessageText;
  private readonly removeHelloText;
  private readonly keypad;
  private readonly keypadPanel;
  private valueRange: Range | null;
  private valueProperty: Property<number> | null;
  private onEndEdit: ( () => void ) | null;
  private saidHello;

  public constructor( providedOptions: KeypadLayerOptions ) {

    const options = optionize<KeypadLayerOptions, SelfOptions, PlaneOptions>()( {

      valueBoxWidth: 85,
      valueYMargin: 3,
      valueFont: TEXT_FONT,
      maxDigits: 8,
      maxDecimals: 2,

      // supertype options
      visible: false,
      fill: 'rgba( 0, 0, 0, 0.2 )',
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    // clicking outside the keypad cancels the edit
    this.clickOutsideFireListener = new FireListener( {
      fire: event => {
        if ( event && event.trail.lastNode() === this ) {
          this.cancelEdit();

          // Because firing this involves hiding this Node, we need to clear the current over pointer in order make sure
          // we don't get two enter events next time this listener is called. See https://github.com/phetsims/scenery/issues/1021
          this.clickOutsideFireListener.clearOverPointers();
        }
      },
      fireOnDown: true,
      tandem: options.tandem.createTandem( 'clickOutsideFireListener' )

      //TODO: How to document this? - see https://github.com/phetsims/projectile-motion/issues/306
      // phetioDocumentation: 'Listener responsible for hiding the KeypadLayer when space outside the keypad is pressed.'
    } );

    // these will be set when the client calls beginEdit
    this.valueProperty = null;
    this.valueRange = null;
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

    this.keypad = new Keypad( Keypad.PositiveFloatingPointLayout, {
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
        maxWidth: this.keypad.width // i18n
      } ),
      tandem: options.tandem.createTandem( 'enterButton' ),
      phetioDocumentation: 'The button to submit a custom number with the keypad'
    } );

    const rangeMessageText = new Text( '', { font: TEXT_FONT, maxWidth: this.keypad.width } );

    // for convenient access by methods
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
      children: [ valueAndRangeMessage, this.keypad, enterButton ]
    } );

    this.saidHello = false;
    const helloText = new Text( 'Hello!', { font: TEXT_FONT } );

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
    this.keypad.stringProperty.link( string => { // no unlink required
      valueNode.string = string;
      valueNode.center = valueBackgroundNode.center;
    } );

    // for resetting color of value to black when it has been red.
    this.keypad.accumulatedKeysProperty.link( keys => {
      valueNode.fill = TEXT_FILL_DEFAULT;
      rangeMessageText.fill = TEXT_FILL_DEFAULT;
    } );

  }


  /**
   * Positions keypad
   */
  public positionKeypad( setKeypadPosition: ( keypadPanel: Panel ) => void ): void {
    this.keypadPanel && setKeypadPosition( this.keypadPanel );
  }

  /**
   * Begins an edit, by opening a modal keypad.
   */
  public beginEdit( valueProperty: Property<number>, valueRange: Range, unitsString: string, providedOptions: BeginEditOptions ): void {

    const options = combineOptions<BeginEditOptions>( {
      onBeginEdit: null, // function called by beginEdit
      onEndEdit: null // function called by endEdit
    }, providedOptions );

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

    // add listener for clicking outside the keypad, will be removed on endEdit
    !this.hasInputListener( this.clickOutsideFireListener ) && this.addInputListener( this.clickOutsideFireListener );

    // execute client-specific hook
    options.onBeginEdit && options.onBeginEdit();
  }

  /**
   * Ends an edit, used by commitEdit and cancelEdit
   */
  private endEdit(): void {

    // clear the keypad
    this.keypad.clear();

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
   */
  private warnOutOfRange(): void {
    this.valueNode.fill = TEXT_FILL_ERROR;
    this.rangeMessageText.fill = TEXT_FILL_ERROR;
    this.keypad.setClearOnNextKeyPress( true );
  }

  /**
   * Commits an edit
   */
  private commitEdit(): void {

    const valueRange = this.valueRange;

    // get the value from the keypad
    const value = this.keypad.valueProperty.get();

    // not entering a value in the keypad is a cancel
    if ( this.keypad.stringProperty.get() === '' ) {
      this.cancelEdit();
      return;
    }

    // if the keypad contains a valid value ...
    if ( valueRange && value !== null && valueRange.contains( value ) ) {
      if ( this.valueProperty ) {
        this.valueProperty.set( toFixedNumber( value, 2 ) );
      }
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
   */
  private cancelEdit(): void {
    this.endEdit();
  }

  private sayHi(): void {
    this.addHelloText();
  }
}

projectileMotion.register( 'KeypadLayer', KeypadLayer );

export default KeypadLayer;