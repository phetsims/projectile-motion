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
  var Property = require( 'AXON/Property' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var Path = require( 'SCENERY/nodes/Path' );

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

    // TODO: formatting
    options = _.extend( {
        horizontalMin: 120,
        xMargin: 10,
        yMargin: 10,
        fill: ProjectileMotionConstants.PANEL_FILL_COLOR,
        visible: false
      },
      options
    );

    // @private {array.<{Object}>} parameters contains objects like currentParameter
    this.parameters;
    this.currentParameter; // {Object} contains properties about a parameter box

    this.numberKeypadStringProperty = new Property( '' );

    // create hboxes for the parameter label, readout, and edit button
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

    this.parameters = [
      heightBox,
      angleBox,
      velocityBox,
      massBox,
      diameterBox,
      dragCoefficientBox,
      altitudeBox
    ];

    var airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    this.modelAirResistanceProperty = projectileMotionLabModel.airResistanceOnProperty;
    this.detachedAirResistanceProperty = new Property( this.modelAirResistanceProperty.get() );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, this.detachedAirResistanceProperty );

    // The contents of the control panel
    var leftSideContent = new VBox( {
      align: 'right',
      spacing: 10,
      children: [
        heightBox.node,
        angleBox.node,
        velocityBox.node,
        massBox.node,
        diameterBox.node,
        airResistanceCheckBox,
        dragCoefficientBox.node,
        altitudeBox.node
      ]
    } );

    // create number keypad
    this.numberKeypad = new NumberKeypad( {
      decimalPointKey: true,
      digitStringProperty: this.numberKeypadStringProperty
    } );

    // create submit button
    var submitButtonOptions = _.extend( { weight: 'bold' }, ProjectileMotionConstants.YELLOW_BUTTON_OPTIONS );
    var submitButton = new TextPushButton( submitString, submitButtonOptions );

    // submit button closes this panel and updates the properties
    var submitButtonListener = this.closeSelf.bind( this );
    submitButton.addListener( submitButtonListener );

    var rightSideContent = new VBox( {
      align: 'center',
      spacing: 10,
      children: [
        this.numberKeypad,
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
      this.detachedAirResistanceProperty.set( this.modelAirResistanceProperty.get() );
      this.visible = true;
    },

    // not sure @public or @private, closes self and sets values
    closeSelf: function() {
      this.unfocusCurrent();

      // set the properties with values in the text readouts
      this.parameters.forEach( function( parameter ) {
        parameter.property.set( Number( parameter.valueText.getText() ) );
      } );
      this.modelAirResistanceProperty.set( this.detachedAirResistanceProperty.get() );
      this.visible = false;
    },

    // @private, sets focus on this parameter box
    // @param {Object} parameterBox
    setFocus: function( parameterBox ) {
      this.currentParameter = parameterBox;
      // TODO: right after clicking pencil button, clicking backspace does not clear. It should.
      var linkListener = this.currentParameter.keypadListener;
      this.numberKeypad.armForNewEntry();
      this.numberKeypad.digitStringProperty.lazyLink( linkListener );
      this.currentParameter.focusRectangle.visible = true;
    },

    // @private, unlinks property and unhighlights current parameter box
    unfocusCurrent: function() {
      // no parameter box has been focused on
      if ( !this.currentParameter ) {
        return;
      }
      var linkListener = this.currentParameter.keypadListener;
      this.numberKeypad.digitStringProperty.unlink( linkListener );
      this.currentParameter.focusRectangle.visible = false;
      // TODO: if no entry for this parameter on unfocus, or submit, set to default, or what it was before
    },

    // @private
    editButtonListener: function( parameterBox ) {
      this.unfocusCurrent();
      this.setFocus( parameterBox );
    },

    /**
     * Auxiliary function that creates hbox for a parameter label, text readout, and edit button
     * Also adds value text and associated property to the running list of parameters, {array.{Object}} parameters
     * @param {string} label
     * @param {Property.<number>} property - the property that is used and set
     * @param {Object} range, range has keys min and max
     * @returns {Object}: {HBox} node, {Text} valueText, {Rectangle} focusRectangle, {Property} property, {function} keypadListener
     * @private
     */
    createParameterControlBox: function( label, property, range ) {
      var self = this;

      // this will be returned
      var parameterBox = new Object();

      // label
      var parameterLabel = new Text( label, LABEL_OPTIONS );

      // value text
      var valueText = new Text( property.get().toFixed( 2 ), LABEL_OPTIONS );

      // background for text
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

      // visible if text field is focused on
      var focusRectangle = new Path( backgroundNode.getShape(), {
        visible: false,
        stroke: 'black',
        lineWidth: 3
      } );

      var valueNode = new Node( { children: [ backgroundNode, focusRectangle, valueText ] } );

      // edit button
      var pencilIcon = new FontAwesomeNode( 'pencil_square_o', { scale: 0.35 } );
      var editButton = new RectangularPushButton( {
        minWidth: 25,
        minHeight: 20,
        content: pencilIcon,
        listener: self.editButtonListener.bind( self, parameterBox )
      } );

      // properties in one place
      parameterBox.node = new HBox( { spacing: 10, children: [ parameterLabel, valueNode, editButton ] } );
      parameterBox.valueText = valueText;
      parameterBox.focusRectangle = focusRectangle;
      parameterBox.property = property;
      parameterBox.keypadListener = function( numberKeypadString ) {
        valueText.setText( numberKeypadString );
      };

      return parameterBox;
    }

  } );
} );

