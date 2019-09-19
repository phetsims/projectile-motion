// Copyright 2016-2019, University of Colorado Boulder

/**
 * Control panel that allows users to alter properties of the projectile fired.
 * Also includes a slider for changing altitude, which changes air density.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HSlider = require( 'SUN/HSlider' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Panel = require( 'SUN/Panel' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const altitudeString = require( 'string!PROJECTILE_MOTION/altitude' );
  const diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  const dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  const kgString = require( 'string!PROJECTILE_MOTION/kg' );
  const massString = require( 'string!PROJECTILE_MOTION/mass' );
  const mString = require( 'string!PROJECTILE_MOTION/m' );
  const pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );

  // constants
  const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  const DRAG_OBJECT_DISPLAY_DIAMETER = 24;
  const TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
  const READOUT_X_MARGIN = ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS.readoutXMargin;
  const NUMBER_CONTROL_OPTIONS = {
    numberDisplayOptions: {
      align: 'right',
      xMargin: READOUT_X_MARGIN,
      yMargin: 4,
      font: TEXT_FONT
    },
    titleNodeOptions: { font: TEXT_FONT },
    sliderOptions: {
      thumbSize: new Dimension2( 13, 22 ),
      thumbTouchAreaXDilation: 6,
      thumbTouchAreaYDilation: 4
    },
    arrowButtonOptions: {
      scale: 0.56,
      touchAreaXDilation: 20,
      touchAreaYDilation: 20
    }
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
    const textDisplayWidth = options.textDisplayWidth * 1.2;
    const parameterLabelOptions = _.defaults( {
      maxWidth: options.minWidth - 3 * options.xMargin - textDisplayWidth
    }, LABEL_OPTIONS );

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
      const parameterLabel = new Text( labelString, parameterLabelOptions );

      const valuePattern = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: unitsString } );
      const valueLabel = new NumberDisplay(
        valueProperty,
        range,
        _.extend(
          ProjectileMotionConstants.NUMBER_DISPLAY_OPTIONS, {
            valuePattern: valuePattern,
            decimalPlaces: null
          }
        )
      );

      const slider = new HSlider( valueProperty, range, {
        constrainValue: function( value ) { return Util.roundToInterval( value, round ); }, // two decimal place accuracy
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
        for ( let i = range.min + round; i < range.max; i += round ) {
          slider.addMinorTick( i );
        }
      }

      const xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueLabel.width;
      return new VBox( {
        spacing: options.sliderLabelSpacing, children: [
          new HBox( { spacing: xSpacing, children: [ parameterLabel, valueLabel ] } ),
          slider
        ]
      } );
    }

    const diameterBox = createParameterControlBox(
      diameterString,
      mString,
      projectileDiameterProperty,
      selectedObjectTypeProperty.get().diameterRange,
      selectedObjectTypeProperty.get().diameterRound
    );

    const massBox = createParameterControlBox(
      massString,
      kgString,
      projectileMassProperty,
      selectedObjectTypeProperty.get().massRange,
      selectedObjectTypeProperty.get().massRound
    );

    // layout function for altitude NumberControl
    const altitudeLayoutFunction = function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
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

    const numberControlOptions = _.extend( {
      sliderOptions: null,
      numberDisplayOptions: null,
      layoutFunction: altitudeLayoutFunction
    }, NUMBER_CONTROL_OPTIONS );

    numberControlOptions.sliderOptions = _.extend( {
      trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 80, 0.5 )
    }, numberControlOptions.sliderOptions );

    numberControlOptions.numberDisplayOptions = _.extend( {
      maxWidth: textDisplayWidth + options.readoutXMargin * 2
    }, numberControlOptions.numberDisplayOptions );

    // results in '{{value}} m'
    const valuePattern = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
      units: mString
    } );

    // create altitude control box
    const altitudeOptions = _.extend( {}, numberControlOptions, { delta: 100 } );
    altitudeOptions.numberDisplayOptions = _.extend( {}, numberControlOptions.numberDisplayOptions, {
      valuePattern: valuePattern,
      xMargin: 8
    } );
    altitudeOptions.sliderOptions = _.extend( {}, numberControlOptions.sliderOptions, {
      constrainValue: function( value ) { return Util.roundToInterval( value, 100 ); }
    } );
    const altitudeBox = new NumberControl(
      altitudeString, altitudeProperty,
      ProjectileMotionConstants.ALTITUDE_RANGE,
      altitudeOptions
    );

    const dragObjectDisplay = new Node();
    dragObjectDisplay.addChild( new HStrut( DRAG_OBJECT_DISPLAY_DIAMETER ) );

    // layout function for drag coefficient NumberControl
    const dragLayoutFunction = function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
      const strut = new HStrut( 70 ); // empirically determined to account for the largest width of dragObjectDisplay
      const displayBox = new VBox( { align: 'center', children: [ strut, dragObjectDisplay ] } );
      const displayAndValueBox = new HBox( { spacing: options.xMargin, children: [ displayBox, numberDisplay ] } );
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
    const dragCoefficientOptions = _.extend( {}, numberControlOptions, { delta: 0.01 } );
    dragCoefficientOptions.numberDisplayOptions = _.extend( {},
      numberControlOptions.numberDisplayOptions,
      {
        constrainValue: function( value ) { return Util.roundToInterval( value, 0.01 ); },
        decimalPlaces: 2
      }
    );
    const dragCoefficientBox = new NumberControl(
      dragCoefficientString, projectileDragCoefficientProperty,
      selectedObjectTypeProperty.get().dragCoefficientRange,
      dragCoefficientOptions
    );

    // Listen to changes in model drag coefficient and update the little projectile object display
    projectileDragCoefficientProperty.link( function( dragCoefficient ) {
      if ( dragObjectDisplay.children.length > 1 ) {
        dragObjectDisplay.removeChildAt( 1 );
      }
      const objectView = ProjectileObjectViewFactory.createCustom( DRAG_OBJECT_DISPLAY_DIAMETER
        , dragCoefficient );
      objectView.center = dragObjectDisplay.center;
      dragObjectDisplay.addChild( objectView );
    } );

    // The contents of the control panel
    const content = new VBox( {
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

