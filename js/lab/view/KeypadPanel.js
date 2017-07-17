// Copyright 2016-2017, University of Colorado Boulder

/***
 * A panel that contains a keypad and Enter button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberKeypad = require( 'SCENERY_PHET/NumberKeypad' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  // strings
  var enterString = require( 'string!PROJECTILE_MOTION/enter' );

  // constants
  var DECIMAL_POINT = NumberKeypad.DECIMAL_POINT;
  var TEXT_FONT = ProjectileMotionConstants.LABEL_TEXT_OPTIONS.font;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function KeypadPanel( options ) {

    options = _.extend( {

      // KeypadPanel options
      valueBoxWidth: 85, // {number} width of the value field, height determined by valueFont
      valueYMargin: 3, // {number} vertical margin inside the value box
      valueFont: TEXT_FONT,
      valueString: '', // {string} initial value shown in the keypad
      decimalPointKey: true, // {boolean} does the keypad have a decimal point key?
      maxDigits: 4, // {number} maximum number of digits that can be entered on the keypad
      maxDecimals: 2, // {number} maximum number of decimal places that can be entered on the keypd

      // Panel options
      fill: 'rgb( 230, 230, 230 )', // {Color|string} the keypad's background color
      backgroundPickable: true, // {boolean} so that clicking in the keypad's background doesn't close the keypad
      xMargin: 10,
      yMargin: 10,

      // RectangularPushButton options
      enterButtonListener: null  // {function} called when the Enter button is pressed

    }, options );

    // @public
    this.valueStringProperty = new Property( options.valueString );

    var valueNode = new Text( this.valueStringProperty.value, {
      font: options.valueFont
    } );

    var valueBackgroundNode = new Rectangle( 0, 0, options.valueBoxWidth, valueNode.height + ( 2 * options.valueYMargin ), {
      cornerRadius: 3,
      fill: 'white',
      stroke: 'black'
    } );

    var valueParent = new Node( {
      children: [ valueBackgroundNode, valueNode ]
    } );

    var keypadNode = new NumberKeypad( {
      valueStringProperty: this.valueStringProperty,
      decimalPointKey: options.decimalPointKey,
      validateKey: validateDigitsAndDecimals( {
        maxDigits: options.maxDigits,
        maxDecimals: options.maxDecimals
      } )
    } );

    var enterButton = new RectangularPushButton( {
      listener: options.enterButtonListener,
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      content: new Text( enterString, {
        font: TEXT_FONT,
        fill: 'black',
        maxWidth: keypadNode.width // i18n
      } )
    } );

    var contentNode = new VBox( {
      spacing: 10,
      align: 'center',
      children: [ valueParent, keypadNode, enterButton ]
    } );

    Panel.call( this, contentNode, options );

    // The keypad lasts for the lifetime of the sim, so the links don't need to be disposed
    this.valueStringProperty.link( function( valueString ) { // no unlink required
      valueNode.text = valueString;
      valueNode.center = valueBackgroundNode.center;
    } );

  }

  projectileMotion.register( 'KeypadPanel', KeypadPanel );

  /**
   * Conforms to the API for NumberKeypad options.validateKey.
   * Creates a validation function that constrains the value to have:
   * - a maximum number of digits
   * - a maximum number of decimal places
   * - at most 1 zero to the left of the decimal point
   *
   * @param {Object} [options]
   * @returns {function(string, string)}
   */
  var validateDigitsAndDecimals = function( options ) {

    options = _.extend( {
      maxDigits: 8, // {number} the maximum number of digits (numbers)
      maxDecimals: 4 // {number} the maximum number of decimal places
    }, options );
    assert && assert( options.maxDigits > 0, 'invalid maxDigits: ' + options.maxDigits );
    assert && assert( options.maxDecimals >= 0, 'invalid maxDecimals: ' + options.maxDecimals );

    /**
     * Creates the new string that results from pressing a key.
     * @param {string} keyString - string associated with the key that was pressed
     * @param {string} valueString - string that corresponds to the sequence of keys that have been pressed
     * @returns {string} the result
     */
    return function( keyString, valueString ) {

      // start by assuming that keyString will be ignored
      var newValueString = valueString;

      var hasDecimalPoint = valueString.indexOf( DECIMAL_POINT ) !== -1;
      var numberOfDigits = hasDecimalPoint ? valueString.length - 1 : valueString.length;
      var numberOfDecimals = !hasDecimalPoint ? 0 : ( valueString.length - valueString.indexOf( DECIMAL_POINT ) - 1 );

      if ( valueString === '0' && keyString === '0' ) {

        // ignore multiple leading zeros
      }
      else if ( valueString === '0' && keyString !== '0' && keyString !== DECIMAL_POINT ) {

        // replace a leading 0 that's not followed by a decimal point with this key
        newValueString = keyString;
      }
      else if ( numberOfDigits === options.maxDigits ) {

        // maxDigits reached, ignore key
      }
      else if ( keyString === DECIMAL_POINT ) {
        if ( !hasDecimalPoint ) {

          // allow one decimal point
          newValueString = valueString + keyString;
        }
        else {

          // ignore additional decimal points
        }
      }
      else if ( hasDecimalPoint && numberOfDecimals === options.maxDecimals ) {

        // maxDecimals reached, ignore key
      }
      else {

        // add digit
        newValueString = valueString + keyString;
      }

      return newValueString;
    };
  };

  return inherit( Panel, KeypadPanel );
} );
