// Copyright 2013-2015, University of Colorado Boulder

/**
 * Projectile panel is a control panel that allows users to choose which projectile to fire.
 * Also includes a checkbox whether there is air resistance
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
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
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  // var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // strings
  var massString = 'Mass';
  var diameterString = 'Diameter';
  var dragCoefficientString = 'Drag Coefficient';
  var airResistanceString = 'Air Resistance';

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var BIGGER_LABEL_OPTIONS = ProjectileMotionConstants.PANEL_BIGGER_LABEL_OPTIONS;
  var TEXT_BACKGROUND_OPTIONS = {
    fill: 'white',
    stroke: 'black'
  };
  var TEXT_WIDTH = 60;
  var TEXT_Y_MARGIN = 4;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function ProjectilePanel( projectileMotionLabModel, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} label
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Object} range, range has keys min and max
     * @returns {VBox}
     * @private
     */
    function createParameterControlBox( label, property, range ) {
      // label
      var parameterLabel = new Text( label, LABEL_OPTIONS );

      // value text
      var valueText = new Text( property.get().toFixed( 2 ), LABEL_OPTIONS );

      // background for text
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        TEXT_WIDTH, // width
        valueText.height + 2 * TEXT_Y_MARGIN, // height
        4, // cornerXRadius
        4, // cornerYRadius
        TEXT_BACKGROUND_OPTIONS
      );
      valueText.center = backgroundNode.center;

      var valueNode = new Node( { children: [ backgroundNode, valueText ] } );

      var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueNode.width;

      return new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } );
    }

    var massBox = createParameterControlBox(
      massString,
      projectileMotionLabModel.projectileMassProperty,
      ProjectileMotionConstants.PROJECTILE_MASS_RANGE
    );

    var diameterBox = createParameterControlBox(
      diameterString,
      projectileMotionLabModel.projectileDiameterProperty,
      ProjectileMotionConstants.PROJECTILE_DIAMETER_RANGE
    );

    var dragCoefficientBox = createParameterControlBox(
      dragCoefficientString,
      projectileMotionLabModel.projectileDragCoefficientProperty,
      ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE
    );

    var airResistanceLabel = new Text( airResistanceString, BIGGER_LABEL_OPTIONS );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, projectileMotionLabModel.airResistanceOnProperty );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        massBox,
        diameterBox,
        airResistanceCheckBox,
        dragCoefficientBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'ProjectilePanel', ProjectilePanel );

  return inherit( Panel, ProjectilePanel );
} );

