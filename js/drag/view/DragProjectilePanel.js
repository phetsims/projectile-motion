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
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const Panel = require( 'SUN/Panel' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const ArrowlessNumberControl = require( 'PROJECTILE_MOTION/common/view/ArrowlessNumberControl' );
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
  const DRAG_OBJECT_DISPLAY_DIAMETER = 24;
  const TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
  const READOUT_X_MARGIN = ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS.readoutXMargin;

  /**
   * @param {Property.<ProjectileObjectType>} selectedObjectTypeProperty
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<number>} altitudeProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function DragProjectilePanel( selectedObjectTypeProperty,
                                projectileDragCoefficientProperty,
                                projectileDiameterProperty,
                                projectileMassProperty,
                                altitudeProperty,
                                tandem,
                                options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    const diameterNumberControl = new ArrowlessNumberControl(
      diameterString,
      mString,
      projectileDiameterProperty,
      selectedObjectTypeProperty.get().diameterRange,
      selectedObjectTypeProperty.get().diameterRound, {
        containerWidth: options.minWidth,
        xMargin: options.xMargin,
        textDisplayWidth: options.textDisplayWidth,
        tandem: tandem.createTandem( 'diameterNumberControl' )
      }
    );

    const massNumberControl = new ArrowlessNumberControl(
      massString,
      kgString,
      projectileMassProperty,
      selectedObjectTypeProperty.get().massRange,
      selectedObjectTypeProperty.get().massRound, {
        containerWidth: options.minWidth,
        xMargin: options.xMargin,
        textDisplayWidth: options.textDisplayWidth,
        tandem: tandem.createTandem( 'massNumberControl' )
      }
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

    const defaultNumberControlOptions = {
      numberDisplayOptions: {
        align: 'right',
        maxWidth: options.textDisplayWidth * 1.2 + options.readoutXMargin * 2,
        xMargin: READOUT_X_MARGIN,
        yMargin: 4,
        font: TEXT_FONT
      },
      titleNodeOptions: { font: TEXT_FONT },
      sliderOptions: {
        trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 80, 0.5 ),
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

    // create altitude number control
    const altitudeBox = new NumberControl(
      altitudeString, altitudeProperty,
      ProjectileMotionConstants.ALTITUDE_RANGE,
      merge( {}, defaultNumberControlOptions, {
        numberDisplayOptions: {

          // results in '{{value}} m'
          valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: mString } ),
          xMargin: 8
        },
        sliderOptions: {
          constrainValue: value => Util.roundToInterval( value, 100 )
        },
        delta: 100,

        // TODO: does this need a custom layout function?
        layoutFunction: altitudeLayoutFunction,
        tandem: tandem.createTandem( 'altitudeNumberControl' )
      } )
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

    // create drag coefficient control box
    const dragCoefficientBox = new NumberControl(
      dragCoefficientString, projectileDragCoefficientProperty,
      selectedObjectTypeProperty.get().dragCoefficientRange,
      merge( {}, defaultNumberControlOptions, {
        numberDisplayOptions: {
          constrainValue: value => Util.roundToInterval( value, 0.01 ),
          decimalPlaces: 2
        },

        delta: 0.01,
        layoutFunction: dragLayoutFunction,
        tandem: tandem.createTandem( 'dragCoefficientNumberControl' )
      } )
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
        diameterNumberControl,
        massNumberControl,
        altitudeBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'DragProjectilePanel', DragProjectilePanel );

  return inherit( Panel, DragProjectilePanel );
} );

