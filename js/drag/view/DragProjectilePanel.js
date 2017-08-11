// Copyright 2016-2017, University of Colorado Boulder

/**
 * Control panel that allows users to alter properties of the projectile fired.
 * Also includes a slider for changing altitude, which changes air density.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
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
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var altitudeString = require( 'string!PROJECTILE_MOTION/altitude' );
  var massString = require( 'string!PROJECTILE_MOTION/mass' );
  var kgString = require( 'string!PROJECTILE_MOTION/kg' );
  var diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var TEXT_BACKGROUND_OPTIONS = ProjectileMotionConstants.TEXT_BACKGROUND_OPTIONS;
  var DRAG_OBJECT_DISPLAY_DIAMETER = 24;
  var TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
  var NUMBER_CONTROL_OPTIONS = {
    valueAlign: 'center',
    titleFont: TEXT_FONT,
    valueFont: TEXT_FONT,
    thumbSize: new Dimension2( 13, 22 ),
    thumbTouchAreaXDilation: 6,
    thumbTouchAreaYDilation: 4,
    arrowButtonScale: 0.56,
    valueYMargin: 4
  };

  /**
   * @param {Property.<ProjectileObjectType>} selectedObjectTypeProperty
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<number>} altitudeProperty
   * @param {Object} [options]
   * @constructor
   */
  function DragProjectilePanel( selectedObjectTypeProperty,
                                projectileDragCoefficientProperty,
                                projectileDiameterProperty,
                                projectileMassProperty,
                                altitudeProperty,
                                options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );
    
    // local vars used for layout and formatting
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
        TEXT_BACKGROUND_OPTIONS
      );

      // text node updates if valueProperty changes
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
    
    // layout function for altitude NumberControl
    var altitudeLayoutFunction = function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
      titleNode.setMaxWidth( options.minWidth - 2 * options.xMargin - numberDisplay.width );
      return new VBox( {
        spacing: options.sliderLabelSpacing,
        children: [
          new HBox( {
            spacing: options.minWidth - 2 * options.xMargin - titleNode.width - numberDisplay.width,
            children: [ titleNode, numberDisplay ]
          } ),
          new HBox( {
            spacing: ( options.minWidth - 2 * options.xMargin - slider.width - leftArrowButton.width - rightArrowButton.width ) / 2,
            resize: false, // prevent slider from causing a resize when thumb is at min or max
            children: [ leftArrowButton, slider, rightArrowButton ]
          } )
        ]
      } );
    };

    var numberControlOptions = _.extend( {
      trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 80, 0.5 ),
      layoutFunction: altitudeLayoutFunction,
      valueMaxWidth: textDisplayWidth
    }, NUMBER_CONTROL_OPTIONS );

    // results in '{0} m'
    var valuePattern = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
      value: '{0}', // map to numbered placeholder for NumberControl
      units: mString
    } );

    // create altitude control box
    var altitudeBox = new NumberControl(
      altitudeString, altitudeProperty,
      ProjectileMotionConstants.ALTITUDE_RANGE, _.extend( {
        valuePattern: valuePattern,
        constrainValue: function( value ) { return Util.roundSymmetric( value / 100 ) * 100; },
        decimalPlaces: 0,
        delta: 100,
      }, numberControlOptions )
    );

    var dragObjectDisplay = new Node();
    dragObjectDisplay.addChild( new HStrut( DRAG_OBJECT_DISPLAY_DIAMETER ) );

    // layout function for drag coefficient NumberControl
    var dragLayoutFunction = function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
      var strut = new HStrut( 70 ); // empirically determined to account for the largest width of dragObjectDisplay
      var displayBox = new VBox( { align: 'center', children: [ strut, dragObjectDisplay ] } );
      var displayAndValueBox = new HBox( { spacing: options.xMargin, children: [ displayBox, numberDisplay ] } );
      titleNode.setMaxWidth( options.minWidth - 2 * options.xMargin - displayAndValueBox.width );
      return new VBox( {
        spacing: options.sliderLabelSpacing,
        children: [
          new HBox( {
            spacing: options.minWidth - 2 * options.xMargin - titleNode.width - displayAndValueBox.width,
            children: [ titleNode, displayAndValueBox ]
          } ),
          new HBox( {
            spacing: ( options.minWidth - 2 * options.xMargin - slider.width - leftArrowButton.width - rightArrowButton.width ) / 2,
            resize: false, // prevent slider from causing a resize when thumb is at min or max
            children: [ leftArrowButton, slider, rightArrowButton ]
          } )
        ]
      } );
    };
    
    // replace the number control options with the new layout function
    _.extend( numberControlOptions, {
      layoutFunction: dragLayoutFunction
    } );

    // create drag coefficient control box
    var dragCoefficientBox = new NumberControl(
      dragCoefficientString, projectileDragCoefficientProperty,
      selectedObjectTypeProperty.get().dragCoefficientRange, _.extend( {
        constrainValue: function( value ) { return Util.roundSymmetric( value * 100 ) / 100; },
        decimalPlaces: 2,
        delta: 0.01,
      }, numberControlOptions )
    );
    
    // Listen to changes in model drag coefficient and update the little projectile object display
    projectileDragCoefficientProperty.link( function( dragCoefficient ) {
      if ( dragObjectDisplay.children.length > 1 ) {
        dragObjectDisplay.removeChildAt( 1 );
      }
      var objectView = ProjectileObjectViewFactory.createCustom( DRAG_OBJECT_DISPLAY_DIAMETER
        , dragCoefficient );
      objectView.center = dragObjectDisplay.center;
      dragObjectDisplay.addChild( objectView );
    } );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        dragCoefficientBox,
        diameterBox,
        massBox,
        altitudeBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'DragProjectilePanel', DragProjectilePanel );

  return inherit( Panel, DragProjectilePanel );
} );

