// Copyright 2016-2017, University of Colorado Boulder

/**
 * KeypadLayer handles creation and management of a modal keypad.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadPanel = require( 'PROJECTILE_MOTION/lab/view/KeypadPanel' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function KeypadLayer( options ) {

    var self = this;

    options = _.extend( {
      fill: 'rgba( 0, 0, 0, 0.2 )',
      visible: false
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
    this.keypad = null;
    this.zeroIsValid = true;
    this.onEndEdit = null; // {function} called by endEdit
  }

  projectileMotion.register( 'KeypadLayer', KeypadLayer );

  return inherit( Plane, KeypadLayer, {
    
    /**
     * Positions keypad
     * @param {function} setKeypadLocation - function that lays out keypad
     */
    positionKeypad: function( setKeypadLocation ) {
      this.keypad && setKeypadLocation( this.keypad );
    },

    /**
     * Begins an edit, by opening a modal keypad.
     * @param {Property.<number>} valueProperty - the Property to be set by the keypad
     * @param {number} valueRound - rounding the value when done
     * @param {Object} [options]
     * @public
     */
    beginEdit: function( valueProperty, valueRange, valueRound, options ) {

      // Ignore attempts to open another keypad. This can happen in unlikely multi-touch scenarios.
      // See https://github.com/phetsims/unit-rates/issues/181
      if ( this.keypad ) {
        projectileMotion.log && projectileMotion.log( 'ignoring attempt to open another keypad' );
        return;
      }

      options = _.extend( {
        onBeginEdit: null, // {function} called by beginEdit
        onEndEdit: null, // {function} called by endEdit
        setKeypadLocation: null, // {function:KeypadPanel} called by beginEdit to set the keypad location
        maxDigits: 4, // {number} maximum number of digits that can be entered on the keypad
        maxDecimals: 2, // {number} maximum number of decimal places that can be entered on the keypad
        zeroIsValid: true // {boolean} is zero a valid value?
      }, options );

      this.valueProperty = valueProperty; // remove this reference in endEdit
      this.onEndEdit = options.onEndEdit;
      this.zeroIsValid = options.zeroIsValid;

      // create a keypad
      this.keypad = new KeypadPanel( {
        maxDigits: options.maxDigits,
        maxDecimals: options.maxDecimals,
        enterButtonListener: this.commitEdit.bind( this, valueRange, valueRound )
      } );

      // display the keypad
      this.addChild( this.keypad );
      this.visible = true;
      this.addInputListener( this.clickOutsideListener );

      // position the keypad
      options.setKeypadLocation && options.setKeypadLocation( this.keypad );

      // execute client-specific hook
      options.onBeginEdit && options.onBeginEdit();
    },

    /**
     * Ends an edit
     * @private
     */
    endEdit: function() {

      // hide the keypad
      this.visible = false;
      this.removeInputListener( this.clickOutsideListener );
      this.removeChild( this.keypad );
      this.keypad.dispose();
      this.keypad = null;

      // execute client-specific hook
      this.onEndEdit && this.onEndEdit();

      // remove reference to valueProperty that was passed to beginEdit
      this.valueProperty = null;
    },

    /**
     * Commits an edit
     * @private
     */
    commitEdit: function( valueRange, valueRound ) {

      // get the value from the keypad
      var value = parseFloat( this.keypad.valueStringProperty.value );

      // not entering a value in the keypad is a cancel
      if ( isNaN( value ) ) {
        this.cancelEdit();
        return;
      }

      // if the keypad contains a valid value ...
      if ( valueRange.contains( value ) ) {
        this.valueProperty.set( Util.roundSymmetric( value / valueRound ) * valueRound );
        this.endEdit();
      }
      // value is closer to max than min
      else if ( valueRange.max + valueRange.min < 2 * value ) {
        this.valueProperty.set( valueRange.max );
        this.endEdit(); // not entering a value in the keypad is effectively a cancel
      }
      else {
        this.valueProperty.set( valueRange.min );
        this.endEdit(); // not entering a value in the keypad is effectively a cancel
      }
    },

    /**
     * Cancels an edit
     * @private
     */
    cancelEdit: function() {
      this.endEdit();
    }
  } );
} );
