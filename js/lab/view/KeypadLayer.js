// Copyright 2017, University of Colorado Boulder

/**
 * KeypadLayer handles creation and management of a modal keypad.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Keypad= require( 'SCENERY_PHET/keypad/Keypad' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Util = require( 'DOT/Util' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var enterString = require( 'string!PROJECTILE_MOTION/enter' );
  var rangeMessageString = require( 'string!PROJECTILE_MOTION/rangeMessage' );

  // constants
  var TEXT_FONT = ProjectileMotionConstants.LABEL_TEXT_OPTIONS.font;
  var TEXT_FILL_DEFAULT = 'black';
  var TEXT_FILL_ERROR = 'red';

  /**
   * @param {Object} [options]
   * @constructor
   */
  function KeypadLayer( options ) {

    var self = this;

    options = _.extend( {

      valueBoxWidth: 85, // {number} width of the value field, height determined by valueFont
      valueYMargin: 3, // {number} vertical margin inside the value box
      valueFont: TEXT_FONT,
      maxDigits: 8, // {number} maximum number of digits that can be entered on the keypad
      maxDecimals: 2, // {number} maximum number of decimal places that can be entered on the keypd

      // supertype options
      visible: false,
      fill: 'rgba( 0, 0, 0, 0.2 )'
    }, options );

    Plane.call( this, options );

    // @private clicking outside the keypad cancels the edit
    this.clickOutsideListener = new DownUpListener( {
      down: function( event ) {
        if ( event.trail.lastNode() === self ) {
          self.cancelEdit();
        }
      }
    } );

    // @private these will be set when the client calls beginEdit
    this.valueProperty = null;
    this.onEndEdit = null; // {function} called by endEdit

    var valueNode = new Text( '', {
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

    this.keypadNode = new Keypad( Keypad.PositiveFloatingPointLayout, {
      maxDigits: options.maxDigits,
      maxDigitsRightOfMantissa: options.maxDecimals
    } );

    var enterButton = new RectangularPushButton( {
      listener: this.commitEdit.bind( this ),
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      content: new Text( enterString, {
        font: TEXT_FONT,
        fill: 'black',
        maxWidth: this.keypadNode.width // i18n
      } )
    } );

    var rangeMessageText = new Text( '', { font: TEXT_FONT, maxWidth: this.keypadNode.width } );

    // @private for convenient access by methods
    this.valueNode = valueNode;
    this.rangeMessageText = rangeMessageText;

    var valueAndRangeMessage = new VBox( { spacing: 5, align: 'center', children: [ rangeMessageText, valueParent ] } );

    var contentNode = new VBox( {
      spacing: 10,
      align: 'center',
      children: [ valueAndRangeMessage, this.keypadNode, enterButton ]
    } );

    // @private
    this.saidHello = false;
    var helloText = new Text('Hello!', { font: TEXT_FONT } );

    // @private

    this.addHelloText = function() {
      if ( !contentNode.hasChild( helloText ) && !this.saidHello ) {
        contentNode.addChild( helloText );
        this.saidHello = true;
      }
    };

    this.removeHelloText = function() {
      if ( contentNode.hasChild( helloText ) ) {
        contentNode.removeChild( helloText );
      }
    };

    this.keypadPanel = new Panel( contentNode, {
      fill: 'rgb( 230, 230, 230 )', // {Color|string} the keypad's background color
      backgroundPickable: true, // {boolean} so that clicking in the keypad's background doesn't close the keypad
      xMargin: 10,
      yMargin: 10,
    } );

    this.addChild( this.keypadPanel );

    // The keypad lasts for the lifetime of the sim, so the links don't need to be disposed
    this.keypadNode.stringProperty.link( function( string ) { // no unlink required
      valueNode.text = string;
      valueNode.center = valueBackgroundNode.center;
    } );

    // for resetting color of value to black when it has been red.
    this.keypadNode.accumulatedKeysProperty.link( function( keys ) {
      valueNode.fill = TEXT_FILL_DEFAULT;
      rangeMessageText.fill = TEXT_FILL_DEFAULT;
    } );

  }

  projectileMotion.register( 'KeypadLayer', KeypadLayer );

  return inherit( Plane, KeypadLayer, {

    /**
     * Positions keypad
     * @param {function:KeypadPanel} setKeypadLocation - function that lays out keypad, no return
     */
    positionKeypad: function( setKeypadLocation ) {
      this.keypadPanel && setKeypadLocation( this.keypadPanel );
    },

    /**
     * Begins an edit, by opening a modal keypad.
     * @public
     *
     * @param {Property.<number>} valueProperty - the Property to be set by the keypad
     * @param {Range} valueRange
     * @param {Object} [options]
     */
    beginEdit: function( valueProperty, valueRange, unitsString, options ) {

      options = _.extend( {
        onBeginEdit: null, // {function} called by beginEdit
        onEndEdit: null // {function} called by endEdit
      }, options );

      this.valueProperty = valueProperty; // remove this reference in endEdit
      this.onEndEdit = options.onEndEdit;

      this.valueRange = valueRange; // update value range to be used in commitedit
      var rangeMessage = StringUtils.fillIn( rangeMessageString, {
        min: valueRange.min,
        max: valueRange.max,
        units: unitsString ? unitsString : ''
      } ).trim();
      this.rangeMessageText.setText( rangeMessage );

      // display the keypad
      this.visible = true;

      // keypadLayer lasts for the lifetime of the sim, so listeners don't need to be disposed
      this.addInputListener( this.clickOutsideListener );

      // execute client-specific hook
      options.onBeginEdit && options.onBeginEdit();
    },

    /**
     * Ends an edit, used by commitEdit and cancelEdit
     * @private
     */
    endEdit: function() {

      // clear the keypad
      this.keypadNode.clear();

      // hide the keypad
      this.visible = false;
      this.removeInputListener( this.clickOutsideListener );

      // execute client-specific hook
      this.onEndEdit && this.onEndEdit();

      // remove reference to valueProperty that was passed to beginEdit
      this.valueProperty = null;

      this.removeHelloText();
      this.valueNode.fill = TEXT_FILL_DEFAULT;
    },

    /**
     * Warns the user that out of range
     * @private
     */
    warnOutOfRange: function() {
      this.valueNode.fill = TEXT_FILL_ERROR;
      this.rangeMessageText.fill = TEXT_FILL_ERROR;
      this.keypadNode.setClearOnNextKeyPress( true );
    },

    /**
     * Commits an edit
     * @private
     */
    commitEdit: function() {

      var valueRange = this.valueRange;

      // get the value from the keypad
      var value = this.keypadNode.valueProperty.get();

      // not entering a value in the keypad is a cancel
      if ( this.keypadNode.stringProperty.get() === '' ) {
        this.cancelEdit();
        return;
      }

      // if the keypad contains a valid value ...
      if ( valueRange.contains( value ) ) {
        this.valueProperty.set( Util.toFixedNumber( value, 2 ) );
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
    },

    /**
     * Cancels an edit
     * @private
     */
    cancelEdit: function() {
      this.endEdit();
    },

    sayHi: function() {
      this.addHelloText();
    }
  } );
} );
