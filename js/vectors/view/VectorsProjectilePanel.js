// Copyright 2016-2017, University of Colorado Boulder

/**
 * Control panel that allows users to alter Properties of the projectile fired.
 * Also includes a slider for changing altitude, which changes air density.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
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
  var Line = require( 'SCENERY/nodes/Line' );

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
  var TEXT_BACKGROUND_OPTIONS = ProjectileMotionConstants.TEXT_BACKGROUND_OPTIONS;

  var DRAG_OBJECT_DISPlAY_DIAMETER = 24;
  var AIR_RESISTANCE_ICON = ProjectileMotionConstants.AIR_RESISTANCE_ICON;

  /**
   * @param {Property.<ProjectiLeObjectType} selectedObjectTypeProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<boolean>} airResistanceOnProperty - whether air resistance is on
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Object} [options]
   * @constructor
   */
  function VectorsProjectilePanel( selectedObjectTypeProperty,
                                   projectileDiameterProperty,
                                   projectileMassProperty,
                                   airResistanceOnProperty,
                                   projectileDragCoefficientProperty,
                                   options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );
    
    // local vars for layout and formatting
    var textDisplayWidth = options.textDisplayWidth * 1.2;
    var parameterLabelOptions = _.defaults( { maxWidth: options.minWidth - 3 * options.xMargin - textDisplayWidth }, LABEL_OPTIONS );
    var textOptions = _.defaults( { maxWidth: textDisplayWidth - 2 * options.xMargin }, LABEL_OPTIONS );

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} valueProperty - the Property that is set and linked to
     * @param {Range} range - range for the valueProperty value
     * @param {Number} round - optional, for minor ticks
     * @returns {VBox}
     */
    function createParameterControlBox( labelString, unitsString, valueProperty, range, round ) {
      // label
      var parameterLabel = new Text( labelString, parameterLabelOptions );

      // value text
      var valueText = new Text( unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        value: Util.toFixedNumber( valueProperty.get(), 2 ),
        units: unitsString
      } ) : Util.toFixedNumber( valueProperty.get(), 2 ), textOptions );

      // background for text
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        textDisplayWidth, // width, widened
        options.textDisplayHeight,
        _.defaults( { cornerRadius: 1 }, TEXT_BACKGROUND_OPTIONS )
      );

      // text node updates if valueProperty value changes
      valueProperty.link( function( value ) {
        valueText.setText( unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
          value: Util.toFixedNumber( value, 2 ),
          units: unitsString
        } ) : Util.toFixedNumber( valueProperty.get(), 2 ) );
        valueText.center = backgroundNode.center;
      } );

      var slider = new HSlider( valueProperty, range, {
        constrainValue: function( value ) { return Util.roundSymmetric( value / round ) * round; }, // two decimal place accuracy
        majorTickLength: 12,
        minorTickLength: 5,
        tickLabelSpacing: 2,
        trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 30, 0.5 ),
        thumbSize: new Dimension2( 13, 22 ),
        thumbTouchAreaXDilation: 6,
        thumbTouchAreaYDilation: 4 // smaller to prevent overlap with above number spinner buttons
      } );
      slider.addMajorTick( range.min, new Text( range.min, LABEL_OPTIONS ) );
      slider.addMajorTick( range.max, new Text( range.max, LABEL_OPTIONS ) );

      if ( round ) {
        for ( var i = range.min + round; i < range.max; i += round ) {
          slider.addMinorTick( i );
        }
      }

      var valueNode = new Node( { children: [ backgroundNode, valueText ] } );

      var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueNode.width;
      return new VBox( {
        spacing: options.sliderLabelSpacing, children: [
          new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } ),
          slider
        ]
      } );

    }
    
    // drag coefficient object shape view
    var objectView = ProjectileObjectViewFactory.createCustom( DRAG_OBJECT_DISPlAY_DIAMETER, ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT );
    var objectDisplay = new HBox( {
      spacing: options.xMargin,
      children: [
        new Text( cannonballString, _.defaults( { maxWidth: options.minWidth - 3 * options.xMargin - objectView.width }, LABEL_OPTIONS ) ),
        objectView
      ]
    } );

    var diameterBox = createParameterControlBox(
      diameterString,
      mString,
      projectileDiameterProperty,
      selectedObjectTypeProperty.get().diameterRange,
      selectedObjectTypeProperty.get().diameterRound
    );

    var massBox = createParameterControlBox(
      massString,
      kgString,
      projectileMassProperty,
      selectedObjectTypeProperty.get().massRange,
      selectedObjectTypeProperty.get().massRound
    );

    var dragCoefficientBox = new Text( '', _.defaults( { maxWidth: options.minWidth - 2 * options.xMargin }, LABEL_OPTIONS ) );
    
    // air resistance
    var airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, airResistanceOnProperty, {
      maxWidth: options.minWidth - 3 * options.xMargin - AIR_RESISTANCE_ICON.width,
      boxWidth: 18
    } );
    var airResistanceCheckBoxAndIcon = new HBox( {
      spacing: options.xMargin,
      children: [ airResistanceCheckBox, AIR_RESISTANCE_ICON ]
    } );

    // disabling and enabling drag and altitude controls depending on whether air resistance is on
    airResistanceOnProperty.link( function( airResistanceOn ) {
      var opacity = airResistanceOn ? 1 : 0.5;
      dragCoefficientBox.setOpacity( opacity );
    } );
    
    // Listen to changes in model drag coefficient and update the view text
    projectileDragCoefficientProperty.link( function( value ) {
      dragCoefficientBox.setText( dragCoefficientString + ': ' + Util.toFixed( value, 2 ) );
    } );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        objectDisplay,
        diameterBox,
        massBox,
        new Line( 0, 0, options.minWidth - 2 * options.xMargin, 0, { stroke: 'gray' } ),
        airResistanceCheckBoxAndIcon,
        dragCoefficientBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'VectorsProjectilePanel', VectorsProjectilePanel );

  return inherit( Panel, VectorsProjectilePanel );
} );

