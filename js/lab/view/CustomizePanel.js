// Copyright 2013-2015, University of Colorado Boulder

/**
 * Customize panel in the center that allows users to change on parameters
 * Invisible until called, disappears on submit
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberKeypad = require( 'SCENERY_PHET/NumberKeypad' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );

  // strings
  var heightString = 'Height';
  var angleString = require( 'string!PROJECTILE_MOTION/angle' );
  var velocityString = require( 'string!PROJECTILE_MOTION/velocity' );
  var massString = 'Mass';
  var diameterString = 'Diameter';
  var dragCoefficientString = 'Drag Coefficient';
  var altitudeString = 'Altitude';
  var airResistanceString = 'Air Resistance';
  var submitString = 'Submit';

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var TEXT_BACKGROUND_OPTIONS = {
    fill: 'white',
    stroke: 'black'
  };
  var TEXT_WIDTH = 100;
  var TEXT_MARGIN = 4;
  var Y_MARGIN = 40;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function CustomizePanel( projectileMotionLabModel, options ) {

    options = _.extend( {
        horizontalMin: 120,
        xMargin: 10,
        yMargin: 10,
        fill: ProjectileMotionConstants.PANEL_FILL_COLOR,
        visible: false
      },
      options );

    // @private {array.<{ Text, Property }>} parameters contains the text of parameters and associated properties
    this.parameters = [];

    var heightBox = this.createParameterControlBox(
      heightString,
      projectileMotionLabModel.cannonHeightProperty,
      ProjectileMotionConstants.CANNON_HEIGHT_RANGE
    );

    var angleBox = this.createParameterControlBox(
      angleString,
      projectileMotionLabModel.cannonAngleProperty,
      ProjectileMotionConstants.CANNON_ANGLE_RANGE
    );

    var velocityBox = this.createParameterControlBox(
      velocityString,
      projectileMotionLabModel.launchVelocityProperty,
      ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE
    );

    var massBox = this.createParameterControlBox(
      massString,
      projectileMotionLabModel.projectileMassProperty,
      ProjectileMotionConstants.PROJECTILE_MASS_RANGE
    );

    var diameterBox = this.createParameterControlBox(
      diameterString,
      projectileMotionLabModel.projectileDiameterProperty,
      ProjectileMotionConstants.PROJECTILE_DIAMETER_RANGE
    );

    var dragCoefficientBox = this.createParameterControlBox(
      dragCoefficientString,
      projectileMotionLabModel.projectileDragCoefficientProperty,
      ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE
    );

    var altitudeBox = this.createParameterControlBox(
      altitudeString,
      projectileMotionLabModel.altitudeProperty,
      ProjectileMotionConstants.ALTITUDE_RANGE
    );

    var airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, projectileMotionLabModel.airResistanceOnProperty );

    // The contents of the control panel
    var leftSideContent = new VBox( {
      align: 'right',
      spacing: 10,
      children: [
        heightBox,
        angleBox,
        velocityBox,
        massBox,
        diameterBox,
        airResistanceCheckBox,
        dragCoefficientBox,
        altitudeBox
      ]
    } );

    var numberKeypad = new NumberKeypad( {
      decimalPointKey: true
    } );

    var submitButtonOptions = _.extend( { weight: 'bold' }, ProjectileMotionConstants.YELLOW_BUTTON_OPTIONS );
    var submitButton = new TextPushButton( submitString, submitButtonOptions );

    var submitButtonListener = this.closeSelf.bind( this );
    submitButton.addListener( submitButtonListener );

    var rightSideContent = new VBox( {
      align: 'center',
      spacing: 10,
      children: [
        numberKeypad,
        submitButton
      ]
    } );

    // The contents of the control panel
    var content = new HBox( {
      align: 'center',
      children: [
        new HStrut( Y_MARGIN ),
        leftSideContent,
        new HStrut( Y_MARGIN ),
        rightSideContent,
        new HStrut( Y_MARGIN )
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'CustomizePanel', CustomizePanel );

  return inherit( Panel, CustomizePanel, {

    // @public sets values and shows self
    openSelf: function() {
      // set text readouts to the property values
      this.parameters.forEach( function( parameter ) {
        parameter.valueText.setText( parameter.property.get().toFixed( 2 ) );
      } );
      this.visible = true;
    },

    // not sure @public or @private, closes self and sets values
    closeSelf: function() {
      // set the properties with values in the text readouts
      this.parameters.forEach( function( parameter ) {
        parameter.property.set( Number( parameter.valueText.getText() ) );
      } );
      this.visible = false;
    },

    /**
     * Auxiliary function that creates hbox for a parameter label, text readout, and pencil button
     * @param {string} label
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Object} range, range has keys min and max
     * @returns {VBox}
     * @private
     */
    createParameterControlBox: function( label, property, range ) {
      var parameterLabel = new Text( label, LABEL_OPTIONS );

      // value
      var valueText = new Text( property.get().toFixed( 2 ), LABEL_OPTIONS );

      this.parameters.push( { valueText: valueText, property: property } );

      // @private background
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        TEXT_WIDTH, // width
        valueText.height + 2 * TEXT_MARGIN, // height
        4, // cornerXRadius
        4, // cornerYRadius
        TEXT_BACKGROUND_OPTIONS
      );

      valueText.centerY = backgroundNode.centerY;
      valueText.left = backgroundNode.left + TEXT_MARGIN;

      var valueNode = new Node( { children: [ backgroundNode, valueText ] } );

      var pencilButton = new RectangularPushButton( {
        minWidth: 25,
        minHeight: 20
          // listener: function() { console.log( 'pencil button pressed' ); }
      } );

      return new HBox( { spacing: 10, children: [ parameterLabel, valueNode, pencilButton ] } );
    }

  } );
} );

