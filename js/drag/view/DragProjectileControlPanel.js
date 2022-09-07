// Copyright 2016-2022, University of Colorado Boulder

/**
 * Control panel that allows users to alter properties of the projectile fired.
 * Also includes a slider for changing altitude, which changes air density.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import { HBox, HStrut, Node, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import ArrowlessNumberControl from '../../common/view/ArrowlessNumberControl.js';
import ProjectileObjectViewFactory from '../../common/view/ProjectileObjectViewFactory.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';

const altitudeString = ProjectileMotionStrings.altitude;
const diameterString = ProjectileMotionStrings.diameter;
const dragCoefficientString = ProjectileMotionStrings.dragCoefficient;
const kgString = ProjectileMotionStrings.kg;
const massString = ProjectileMotionStrings.mass;
const mString = ProjectileMotionStrings.m;
const pattern0Value1UnitsWithSpaceString = ProjectileMotionStrings.pattern0Value1UnitsWithSpace;

// constants
const DRAG_OBJECT_DISPLAY_DIAMETER = 24;
const DRAG_OBJECT_MAX_WIDTH = 70; // empirically determined to account for the largest width of dragObjectDisplay
const TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
const READOUT_X_MARGIN = ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS.readoutXMargin;

class DragProjectileControlPanel extends Panel {

  /**
   * @param {Property.<ProjectileObjectType>} selectedObjectTypeProperty
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<number>} altitudeProperty
   * @param {Object} [options]
   */
  constructor( selectedObjectTypeProperty,
               projectileDragCoefficientProperty,
               projectileDiameterProperty,
               projectileMassProperty,
               altitudeProperty,
               options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
      tandem: Tandem.REQUIRED
    }, options );

    const diameterNumberControl = new ArrowlessNumberControl(
      diameterString,
      mString,
      projectileDiameterProperty,
      selectedObjectTypeProperty.get().diameterRange,
      selectedObjectTypeProperty.get().diameterRound, {
        containerWidth: options.minWidth,
        xMargin: options.xMargin,
        numberDisplayMaxWidth: options.numberDisplayMaxWidth,
        tandem: options.tandem.createTandem( 'diameterNumberControl' ),
        phetioDocumentation: 'UI control to adjust the diameter of the projectile'
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
        numberDisplayMaxWidth: options.numberDisplayMaxWidth,
        tandem: options.tandem.createTandem( 'massNumberControl' ),
        phetioDocumentation: 'UI control to adjust the mass of the projectile'
      }
    );

    const defaultNumberControlOptions = {
      numberDisplayOptions: {
        align: 'right',
        maxWidth: options.numberDisplayMaxWidth + options.readoutXMargin * 2,
        xMargin: READOUT_X_MARGIN,
        yMargin: 4,
        textOptions: {
          font: TEXT_FONT
        }
      },
      titleNodeOptions: {
        font: TEXT_FONT,
        maxWidth: options.minWidth - options.numberDisplayMaxWidth - 3 * options.readoutXMargin - 2 * options.xMargin
      },
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
          constrainValue: value => Utils.roundToInterval( value, 100 )
        },
        delta: 100,
        layoutFunction: NumberControl.createLayoutFunction4( {
          arrowButtonSpacing: 10
        } ),
        tandem: options.tandem.createTandem( 'altitudeNumberControl' ),
        phetioDocumentation: 'UI control to adjust the altitude of position where the projectile is being launched'
      } )
    );

    const dragObjectDisplay = new Node( {
      tandem: options.tandem.createTandem( 'dragObjectDisplay' ),
      phetioDocumentation: 'the icon that changes shape as the drag coefficient changes value'
    } );
    dragObjectDisplay.addChild( new HStrut( DRAG_OBJECT_DISPLAY_DIAMETER ) ); // min size

    // layout function for drag coefficient NumberControl. This is needed to add the icon in
    const dragLayoutFunction = ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {

      const strut = new HStrut( DRAG_OBJECT_MAX_WIDTH ); //
      const displayBox = new VBox( { align: 'center', children: [ strut, dragObjectDisplay ] } );
      const displayAndValueBox = new HBox( { spacing: options.xMargin, children: [ displayBox, numberDisplay ] } );
      return NumberControl.createLayoutFunction4( {
        arrowButtonSpacing: 10
      } )( titleNode, displayAndValueBox, slider, leftArrowButton, rightArrowButton );
    };

    // create drag coefficient control box
    const dragCoefficientBox = new NumberControl(
      dragCoefficientString,
      projectileDragCoefficientProperty,
      selectedObjectTypeProperty.get().dragCoefficientRange,
      merge( {}, defaultNumberControlOptions, {
        titleNodeOptions: {

          // whole panel, take away margins, take away numberDisplay, take away drag icon
          maxWidth: options.minWidth - 2 * options.xMargin - options.numberDisplayMaxWidth - options.readoutXMargin -
                    DRAG_OBJECT_MAX_WIDTH
        },
        numberDisplayOptions: {
          constrainValue: value => Utils.roundToInterval( value, 0.01 ),
          decimalPlaces: 2
        },

        delta: 0.01,
        layoutFunction: dragLayoutFunction,
        tandem: options.tandem.createTandem( 'dragCoefficientNumberControl' ),
        phetioDocumentation: 'UI control to adjust the drag coefficient of the projectile'
      } )
    );

    // Listen to changes in model drag coefficient and update the little projectile object display
    projectileDragCoefficientProperty.link( dragCoefficient => {
      if ( dragObjectDisplay.children.length > 1 ) {
        dragObjectDisplay.removeChildAt( 1 );
      }
      const objectView = ProjectileObjectViewFactory.createCustom( DRAG_OBJECT_DISPLAY_DIAMETER, dragCoefficient );
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

    super( content, options );
  }
}

projectileMotion.register( 'DragProjectileControlPanel', DragProjectileControlPanel );
export default DragProjectileControlPanel;
