// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control panel allows the user to change a projectile's parameters
 * Includes a customize button that pulls up a form to change all fields
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Util = require( 'DOT/Util' );

  // strings
  var pattern0Label1UnitsString = require( 'string!PROJECTILE_MOTION/pattern0Label1Units' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var massString = require( 'string!PROJECTILE_MOTION/mass' );
  var kgString = require( 'string!PROJECTILE_MOTION/kg' );
  var diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  var dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  var altitudeString = require( 'string!PROJECTILE_MOTION/altitude' );
  var airResistanceString = require( 'string!PROJECTILE_MOTION/airResistance' );
  var customizeString = require( 'string!PROJECTILE_MOTION/customize' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var BIGGER_LABEL_OPTIONS = ProjectileMotionConstants.PANEL_BIGGER_LABEL_OPTIONS;
  var TEXT_BACKGROUND_OPTIONS = {
    fill: 'white',
    stroke: 'black'
  };

  /**
   * @param {Property.<boolean>} customizeDialogVisibleProperty - whether customize dialog is visible
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Property.<number>} altitudeProperty
   * @param {Property.<boolean>} airResistanceOnProperty - whether air resistance is on
   * @constructor
   */
  function LabProjectilePanel(
                              customizeDialogVisibleProperty,
                              projectileMassProperty,
                              projectileDiameterProperty,
                              projectileDragCoefficientProperty,
                              altitudeProperty,
                              airResistanceOnProperty,
                              options
  ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    var customizeButtonOptions = _.extend( {}, ProjectileMotionConstants.YELLOW_BUTTON_OPTIONS );
    var customizeButton = new TextPushButton( customizeString, customizeButtonOptions );

    customizeButton.addListener( function() {
      customizeDialogVisibleProperty.set( true );
    } );

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} label
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Object} range, range has keys min and max
     * @returns {VBox}
     * @private
     */
    function createParameterControlBox( labelString, unitsString, property, range ) {
      // label
      var parameterLabel = new Text( unitsString ? StringUtils.format( pattern0Label1UnitsString, labelString, unitsString ) : labelString,
        LABEL_OPTIONS
      );

      // value text
      var valueText = new Text( Util.toFixedNumber( property.get(), 2 ), LABEL_OPTIONS );

      // background for text
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        options.textDisplayWidth, // width
        valueText.height + 2 * options.textDisplayYMargin, // height
        _.defaults( { cornerRadius: 4}, TEXT_BACKGROUND_OPTIONS )
      );

      // text node updates if property value changes
      property.link( function( value ) {
        valueText.setText( value );
        valueText.center = backgroundNode.center;
      } );

      var valueNode = new Node( { children: [ backgroundNode, valueText ] } );

      var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueNode.width;

      return new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } );
    }

    var massBox = createParameterControlBox(
      massString,
      kgString,
      projectileMassProperty,
      ProjectileMotionConstants.PROJECTILE_MASS_RANGE
    );

    var diameterBox = createParameterControlBox(
      diameterString,
      mString,
      projectileDiameterProperty,
      ProjectileMotionConstants.PROJECTILE_DIAMETER_RANGE
    );

    var dragCoefficientBox = createParameterControlBox(
      dragCoefficientString,
      null,
      projectileDragCoefficientProperty,
      ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE
    );

    var altitudeBox = createParameterControlBox(
      altitudeString,
      mString,
      altitudeProperty,
      ProjectileMotionConstants.ALTITUDE_RANGE
    );

    var airResistanceLabel = new Text( airResistanceString, BIGGER_LABEL_OPTIONS );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, airResistanceOnProperty );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        massBox,
        diameterBox,
        airResistanceCheckBox,
        dragCoefficientBox,
        altitudeBox
      ]
    } );

    var LabSecondVBox = new VBox( {
      align: 'center',
      spacing: options.controlsVerticalSpace,
      children: [
        customizeButton,
        content
      ]
    } );

    Panel.call( this, LabSecondVBox, options );
  }

  projectileMotion.register( 'LabProjectilePanel', LabProjectilePanel );

  return inherit( Panel, LabProjectilePanel );
} );

