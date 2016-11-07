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
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberKeypad = require( 'SCENERY_PHET/NumberKeypad' );
  var Panel = require( 'SUN/Panel' );
  var Path = require( 'SCENERY/nodes/Path' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var pattern0Label1UnitsString = require( 'string!PROJECTILE_MOTION/pattern0Label1Units' );
  var initialHeightString = require( 'string!PROJECTILE_MOTION/initialHeight' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var angleString = require( 'string!PROJECTILE_MOTION/angle' );
  var degreesString = require( 'string!PROJECTILE_MOTION/degrees' );
  var initialSpeedString = require( 'string!PROJECTILE_MOTION/initialSpeed' );
  var metersPerSecondString = require( 'string!PROJECTILE_MOTION/metersPerSecond' );
  var massString = require( 'string!PROJECTILE_MOTION/mass' );
  var kgString = require( 'string!PROJECTILE_MOTION/kg' );
  var diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  var dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  var altitudeString = require( 'string!PROJECTILE_MOTION/altitude' );
  var airResistanceString = require( 'string!PROJECTILE_MOTION/airResistance' );
  var submitString = require( 'string!PROJECTILE_MOTION/submit');

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var BOLD_LABEL_OPTIONS = ProjectileMotionConstants.PANEL_BOLD_LABEL_OPTIONS;
  var BIGGER_BOLD_LABEL_OPTIONS = ProjectileMotionConstants.PANEL_BIGGER_BOLD_LABEL_OPTIONS;
  var TEXT_BACKGROUND_OPTIONS = {
    fill: 'white',
    stroke: 'black'
  };
  var TEXT_WIDTH = 100;
  var TEXT_X_MARGIN = 6;
  var Y_MARGIN = 40;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function CustomizeDialog( projectileMotionLabModel, options ) {

    var self = this;

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, { visible: false }, options );
    this.textDisplayYMargin = options.textDisplayYMargin;

    // @private {array.<{Object}>} parameters contains objects like currentParameter
    this.parameters;
    this.currentParameter; // {Object} contains properties about a parameter box

    this.numberKeypadStringProperty = new Property( '' );

    // create hboxes for the parameter label, readout, and edit button
    var heightBox = this.createParameterControlBox(
      initialHeightString,
      mString,
      projectileMotionLabModel.cannonHeightProperty,
      ProjectileMotionConstants.CANNON_HEIGHT_RANGE
    );

    var angleBox = this.createParameterControlBox(
      angleString,
      degreesString,
      projectileMotionLabModel.cannonAngleProperty,
      ProjectileMotionConstants.CANNON_ANGLE_RANGE
    );

    var velocityBox = this.createParameterControlBox(
      initialSpeedString,
      metersPerSecondString,
      projectileMotionLabModel.launchVelocityProperty,
      ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE
    );

    var massBox = this.createParameterControlBox(
      massString,
      kgString,
      projectileMotionLabModel.projectileMassProperty,
      ProjectileMotionConstants.PROJECTILE_MASS_RANGE
    );

    var diameterBox = this.createParameterControlBox(
      diameterString,
      mString,
      projectileMotionLabModel.projectileDiameterProperty,
      ProjectileMotionConstants.PROJECTILE_DIAMETER_RANGE
    );

    var dragCoefficientBox = this.createParameterControlBox(
      dragCoefficientString,
      null,
      projectileMotionLabModel.projectileDragCoefficientProperty,
      ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE
    );

    var altitudeBox = this.createParameterControlBox(
      altitudeString,
      mString,
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

    var airResistanceLabel = new Text( airResistanceString, BIGGER_BOLD_LABEL_OPTIONS );
    this.modelAirResistanceProperty = projectileMotionLabModel.airResistanceOnProperty;
    this.detachedAirResistanceProperty = new Property( this.modelAirResistanceProperty.get() );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, this.detachedAirResistanceProperty );

    // The contents of the control panel
    var leftSideContent = new VBox( {
      align: 'right',
      spacing: options.controlsVerticalSpace,
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
      valueStringProperty: this.numberKeypadStringProperty
    } );

    // create submit button
    var submitButtonOptions = _.extend( {
      weight: 'bold'
    }, _.extend( {}, ProjectileMotionConstants.YELLOW_BUTTON_OPTIONS, BOLD_LABEL_OPTIONS ) );
    var submitButton = new TextPushButton( submitString, submitButtonOptions );

    // submit button closes this panel and updates the properties
    submitButton.addListener( function() {
      projectileMotionLabModel.customizeDialogVisibleProperty.set( false );
    } );

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

    // When the dialog is shown, initialize the values in the panel.
    // When the dialog is closed, set the values from the customize panel to the true model.
    // Lazy link so that we do not set the values from the panel when the application launches.
    projectileMotionLabModel.customizeDialogVisibleProperty.lazyLink( function( customizeDialogVisible ) {
      if ( customizeDialogVisible ) {
        self.openSelf();
      } else {
        self.closeSelf();
      }
    } );
  }

  projectileMotion.register( 'CustomizeDialog', CustomizeDialog );

  return inherit( Panel, CustomizeDialog, {

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
        var newUnboundedValue = Number( parameter.valueText.getText() );
        // mouse dragged angle is within angle range
        if ( parameter.range.contains( newUnboundedValue ) ) {
          parameter.property.set( newUnboundedValue );
        }
        // the submitted value is greater than range
        else if ( newUnboundedValue > parameter.range.max ) {
          parameter.property.set( parameter.range.max );
        }
        // the submitted value is less than range
        else {
          parameter.property.set( parameter.range.min );
        }
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
      this.numberKeypad.valueStringProperty.lazyLink( linkListener );
      this.currentParameter.focusRectangle.visible = true;
    },

    // @private, unlinks property and unhighlights current parameter box
    unfocusCurrent: function() {
      // no parameter box has been focused on
      if ( !this.currentParameter ) {
        return;
      }
      var linkListener = this.currentParameter.keypadListener;
      this.numberKeypad.valueStringProperty.unlink( linkListener );
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
     * @param {Range} range, range has keys min and max
     * @returns {Object}: {HBox} node, {Text} valueText, {Rectangle} focusRectangle, {Property} property,
     *  {Range} range, {function} keypadListener
     * @private
     */
    createParameterControlBox: function( labelString, unitsString, property, range ) {
      var self = this;

      // this will be returned
      var parameterBox = new Object();

      // label
      var parameterLabel = new Text( unitsString ? StringUtils.format( pattern0Label1UnitsString, labelString, unitsString ) : labelString,
        LABEL_OPTIONS
      );

      // value text
      var valueText = new Text( property.get().toFixed( 2 ), LABEL_OPTIONS );

      // background for text
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        TEXT_WIDTH, // width
        valueText.height + 2 * this.textDisplayYMargin, // height
        4, // cornerXRadius
        4, // cornerYRadius
        TEXT_BACKGROUND_OPTIONS
      );
      valueText.centerY = backgroundNode.centerY;
      valueText.left = backgroundNode.left + TEXT_X_MARGIN;

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
        baseColor: 'white',
        listener: self.editButtonListener.bind( self, parameterBox )
      } );

      // properties in one place
      parameterBox.node = new HBox( { spacing: 10, children: [ parameterLabel, valueNode, editButton ] } );
      parameterBox.valueText = valueText;
      parameterBox.focusRectangle = focusRectangle;
      parameterBox.property = property;
      parameterBox.range = range;
      parameterBox.keypadListener = function( numberKeypadString ) {
        valueText.setText( numberKeypadString );
      };

      return parameterBox;
    }

  } );
} );

