// Copyright 2013-2015, University of Colorado Boulder

/**
 * Customize panel allows the user to change a projectile's parameters
 * Includes a customize button that pulls up a form to change all fields
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  // var Dimension2 = require( 'DOT/Dimension2' );
  var CheckBox = require( 'SUN/CheckBox' );
  // var HBox = require( 'SCENERY/nodes/HBox' );
  // var HSlider = require( 'SUN/HSlider' );
  // var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  // var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // strings
  var customizeString = 'Customize';
  var massString = 'Mass';
  var diameterString = 'Diameter';
  var dragCoefficientString = 'Drag Coefficient';
  var altitudeString = 'Altitude';
  var airResistanceString = 'Air Resistance';
  var velocityVectorsString = 'Velocity Vectors';

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

  /**
   * @param {ProjectileMotionModel} model
   * @param {CustomizePanel} customizePanel - panel linked to customize button
   * @constructor
   */
  function LabSecondPanel( projectileMotionLabModel, customizePanel, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    var customizeButtonOptions = _.extend( {}, ProjectileMotionConstants.YELLOW_BUTTON_OPTIONS );
    var customizeButton = new TextPushButton( customizeString, customizeButtonOptions );

    var customizeButtonListener = customizePanel.openSelf.bind( customizePanel );
    customizeButton.addListener( customizeButtonListener );

    // TODO: update control types: readouts instead of sliders

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

    var velocityVectorComponentsLabel = new Text( velocityVectorsString, LABEL_OPTIONS );
    var velocityVectorComponentsCheckBox = new CheckBox( velocityVectorComponentsLabel, projectileMotionLabModel.velocityVectorComponentsOnProperty );

    // The contents of the control panel
    var content = new VBox( {
      align: 'center',
      spacing: options.controlsVerticalSpace,
      children: [
        customizeButton,
        massBox,
        diameterBox,
        airResistanceCheckBox,
        dragCoefficientBox,
        altitudeBox,
        velocityVectorComponentsCheckBox
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
     * Auxiliary function that creates vbox for a parameter label and TODO: readouts
     * @param {string} label
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Object} range, range has keys min and max
     * @returns {VBox}
     * @private
     */
    createParameterControlBox: function( label, property, range ) {
      // label
      var parameterLabel = new Text( label, LABEL_OPTIONS );

      // value text
      var valueText = new Text( property.get().toFixed( 2 ), LABEL_OPTIONS );

      // // background for text
      // var backgroundNode = new Rectangle(
      //   0, // x
      //   0, // y
      //   TEXT_WIDTH, // width
      //   valueText.height + 2 * TEXT_MARGIN, // height
      //   4, // cornerXRadius
      //   4, // cornerYRadius
      //   TEXT_BACKGROUND_OPTIONS
      // );
      // valueText.centerY = backgroundNode.centerY;
      // valueText.left = backgroundNode.left + TEXT_MARGIN;

      var valueNode = new Node( { children: [ /*backgroundNode, */valueText ] } );

      // TODO: var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - setParameterSpinner.width;

      return new HBox( { spacing: 10, children: [ parameterLabel, valueNode ] } );
    }

  } );
} );

