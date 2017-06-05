// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control panel that allows users to alter properties of the projectile fired.
 * Also includes a slider for changing altitude, which changes air density.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Util = require( 'DOT/Util' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var massString = require( 'string!PROJECTILE_MOTION/mass' );
  var kgString = require( 'string!PROJECTILE_MOTION/kg' );
  var diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var cannonballString = require( 'string!PROJECTILE_MOTION/cannonball' );
  var dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  var airResistanceString = require( 'string!PROJECTILE_MOTION/airResistance' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var BIGGER_LABEL_OPTIONS = ProjectileMotionConstants.PANEL_BIGGER_LABEL_OPTIONS;
  var TEXT_BACKGROUND_OPTIONS = {
    fill: 'white',
    stroke: 'lightGray'
  };

  var DRAG_OBJECT_DISPLAY_RADIUS = 12;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function VectorsProjectilePanel(
                                projectileDiameterProperty,
                                projectileMassProperty,
                                airResistanceOnProperty,
                                projectileDragCoefficientProperty,
                                options
  ) {
    // TODO: rename labModel to projectileMotionViewModel

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
     * @param {Node} a view display to be shown with the value
     * @returns {VBox}
     * @private
     */
    function createParameterControlBox( labelString, unitsString, property, range ) {
      // label
      var parameterLabel = new Text( labelString, LABEL_OPTIONS );

      // value text
      var valueText = new Text( unitsString ? StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( property.get(), 2 ), unitsString ) : Util.toFixedNumber( property.get(), 2 ), LABEL_OPTIONS );

      // background for text
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        options.textDisplayWidth * 1.5, // width, widened
        valueText.height + 2 * options.textDisplayYMargin, // height
        _.defaults( { cornerRadius: 1 }, TEXT_BACKGROUND_OPTIONS )
      );

      // text node updates if property value changes
      property.link( function( value ) {
        valueText.setText( value );
        valueText.center = backgroundNode.center;
      } );

      var slider = new HSlider( property, range, {
        constrainValue: function( value ) { return Util.roundSymmetric( value * 100 ) / 100; }, // two decimal place accuracy
        majorTickLength: 5,
        trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 20, 0.5 ),
        thumbSize: new Dimension2( 16, 28 ),
        thumbTouchAreaXDilation: 6,
        thumbTouchAreaYDilation: 4 // smaller to prevent overlap with above number spinner buttons
      } );
      slider.addMajorTick( range.min );
      slider.addMajorTick( range.max );

      var valueNode = new Node( { children: [ backgroundNode, valueText ] } );

      var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueNode.width;
      return new VBox( { spacing: options.yMargin, children: [
          new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } ),
          slider
      ] } );
      
    }

    var objectView = ProjectileObjectViewFactory.createCustom( DRAG_OBJECT_DISPLAY_RADIUS, ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT );
    var objectDisplay = new HBox( { spacing: options.xMargin, children: [ new Text( cannonballString, LABEL_OPTIONS ), objectView ]});

    var diameterBox = createParameterControlBox(
      diameterString,
      mString,
      projectileDiameterProperty,
      ProjectileMotionConstants.PROJECTILE_DIAMETER_RANGE
    );

    var massBox = createParameterControlBox(
      massString,
      kgString,
      projectileMassProperty,
      ProjectileMotionConstants.PROJECTILE_MASS_RANGE
    );

    var airResistanceLabel = new Text( airResistanceString, BIGGER_LABEL_OPTIONS );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, airResistanceOnProperty );

    var dragCoefficientBox = ( function( labelString, property ) {
      var parameterLabel = new Text( labelString, LABEL_OPTIONS );
      var valueText = new Text( Util.toFixedNumber( property.get(), 2 ), _.defaults( { fill: 'blue' }, LABEL_OPTIONS ) );

      // background for text
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        options.textDisplayWidth, // width
        valueText.height + 2 * options.textDisplayYMargin, // height
        _.defaults( { cornerRadius: 4, stroke: 'black', fill: ProjectileMotionConstants.LIGHT_GRAY }, TEXT_BACKGROUND_OPTIONS )
      );

      var valueNode = new Node( { children: [ backgroundNode, valueText ] } );
      valueText.center = backgroundNode.center;

      var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueNode.width;

      return new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } );
    }) (
      dragCoefficientString,
      projectileDragCoefficientProperty
    );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        objectDisplay,
        diameterBox,
        massBox,
        airResistanceCheckBox,
        dragCoefficientBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'VectorsProjectilePanel', VectorsProjectilePanel );

  return inherit( Panel, VectorsProjectilePanel );
} );

