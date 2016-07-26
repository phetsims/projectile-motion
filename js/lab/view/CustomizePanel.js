// Copyright 2013-2015, University of Colorado Boulder

/**
 * Customize panel allows the user to change a projectile's parameters
 * Includes a customize button that pulls up a form to change all fields
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  // var CheckBox = require( 'SUN/CheckBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  // var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberKeypad = require( 'SCENERY_PHET/NumberKeypad' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // strings
  // var massString = 'Mass';
  // var diameterString = 'Diameter';
  // var dragCoefficientString = 'Drag Coefficient';
  // var altitudeString = 'Altitude';
  // var airResistanceString = 'Air Resistance';
  // var velocityVectorsString = 'Velocity Vectors';

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function LabSecondPanel( projectileMotionLabModel, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        horizontalMin: 120,
        xMargin: 10,
        yMargin: 10,
        fill: ProjectileMotionConstants.PANEL_FILL_COLOR,
        visible: true // TODO: change to false
      },
      options );

    var numberKeypad = new NumberKeypad( {
      decimalPointKey: true
    } );

    // The contents of the control panel
    var content = new HBox( {
      align: 'center',
      spacing: 5,
      children: [
        numberKeypad
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'LabSecondPanel', LabSecondPanel );

  return inherit( Panel, LabSecondPanel, {

    // @private Auxiliary function takes {string} label and {number} value
    // and returns {string} label and the value to two digits
    createLabelText: function( label, value ) {
      return label + ': ' + value.toFixed( 2 );
    },

    /**
     * Auxiliary function that creates vbox for a parameter label and slider
     * @param {string} label
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Object} range, range has keys min and max
     * @returns {VBox}
     * @private
     */
    createParameterControlBox: function( label, property, range ) {
      var thisPanel = this;
      var parameterLabel = new Text( this.createLabelText( label, property.value ), LABEL_OPTIONS );
      property.link( function( v ) {
        parameterLabel.text = thisPanel.createLabelText( label, v );
      } );
      var setParameterSlider = new HSlider( property, range, {
        maxHeight: 30,
        trackSize: new Dimension2( 150, 6 )
      } );
      var pencilButton = new RectangularPushButton( {
        minWidth: 25,
        minHeight: 20,
        listener: function() { console.log( 'pencil button pressed' ); }
      } );
      var leftBox = new VBox( { spacing: 2, children: [ parameterLabel, setParameterSlider ] } );
      return new HBox( { spacing: 10, children: [ leftBox, pencilButton ] } );
    }

  } );
} );

