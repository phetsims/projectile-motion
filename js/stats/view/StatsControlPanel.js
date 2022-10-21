// Copyright 2022, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 * @author Matthew Blackman(PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ArrowlessNumberControl from '../../common/view/ArrowlessNumberControl.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import projectileMotion from '../../projectileMotion.js';

const TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
const READOUT_X_MARGIN = ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS.readoutXMargin;
const degreesString = MathSymbols.DEGREES;
const metersPerSecondString = ProjectileMotionStrings.metersPerSecond;
const angleStandardDeviationString = ProjectileMotionStrings.angleStandardDeviation;
const speedStandardDeviationString = ProjectileMotionStrings.speedStandardDeviation;
const pattern0Value1UnitsString = ProjectileMotionStrings.pattern0Value1Units;
const pattern0Value1UnitsWithSpaceString = ProjectileMotionStrings.pattern0Value1UnitsWithSpace;

class StatsControlPanel extends Panel {
  /**
   * @param {NumberProperty} groupSizeProperty - the property for the number of simultaneously launched projectiles
   * @param {NumberProperty} initialSpeedStandardDeviationProperty
   * @param {NumberProperty} initialAngleStandardDeviationProperty
   * @param {BooleanProperty} rapidFireModeProperty
   * @param {Object} [options]
   */
  constructor( groupSizeProperty, initialSpeedStandardDeviationProperty, initialAngleStandardDeviationProperty, rapidFireModeProperty, viewProperties, options ) {
    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge(
      {},
      ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS,
      {
        align: 'left',
        tandem: Tandem.REQUIRED
      },
      options
    );

    // create group size number control
    const groupSizeNumberControl = new ArrowlessNumberControl(
      ProjectileMotionStrings.projectileGroupSize, '', groupSizeProperty,
      new Range( ProjectileMotionConstants.GROUP_SIZE_INCREMENT, ProjectileMotionConstants.GROUP_SIZE_MAX ),
      ProjectileMotionConstants.GROUP_SIZE_INCREMENT,
      {
        containerWidth: options.minWidth,
        xMargin: options.xMargin,
        numberDisplayMaxWidth: options.numberDisplayMaxWidth,
        tandem: options.tandem.createTandem( 'groupSizeNumberControl' ),
        phetioDocumentation: 'UI control to adjust the number of simultaneously launched projectiles'
      }
    );

    //standard deviation sliders
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

    // results in '{{value}} m/s'
    const valuePatternSpeed = StringUtils.fillIn(
      pattern0Value1UnitsWithSpaceString,
      {
        units: metersPerSecondString
      }
    );

    // results in '{{value}} degrees'
    const valuePatternAngle = StringUtils.fillIn(
      pattern0Value1UnitsString,
      {
        units: degreesString
      }
    );

    // create speed standard deviation number control
    const speedStandardDeviationNumberControl = new NumberControl(
      speedStandardDeviationString, initialSpeedStandardDeviationProperty,
      ProjectileMotionConstants.SPEED_STANDARD_DEVIATION_RANGE,
      merge( {}, defaultNumberControlOptions, {
        numberDisplayOptions: {
          valuePattern: valuePatternSpeed,
          xMargin: 8,
          textOptions: {
            font: TEXT_FONT
          }
        },
        sliderOptions: {
          constrainValue: value => Utils.roundToInterval( value, 1 )
        },
        delta: 1,
        layoutFunction: NumberControl.createLayoutFunction4( {
          arrowButtonSpacing: 10
        } ),
        tandem: options.tandem.createTandem( 'speedStandardDeviationNumberControl' ),
        phetioDocumentation: 'UI control to adjust the standard deviation of the launch speed'
      } )
    );

    // create angle standard deviation number control
    const angleStandardDeviationNumberControl = new NumberControl(
      angleStandardDeviationString, initialAngleStandardDeviationProperty,
      ProjectileMotionConstants.ANGLE_STANDARD_DEVIATION_RANGE,
      merge( {}, defaultNumberControlOptions, {
        numberDisplayOptions: {
          valuePattern: valuePatternAngle,
          xMargin: 8,
          textOptions: {
            font: TEXT_FONT
          }
        },
        sliderOptions: {
          constrainValue: value => Utils.roundToInterval( value, 1 )
        },
        delta: 1,
        layoutFunction: NumberControl.createLayoutFunction4( {
          arrowButtonSpacing: 10
        } ),
        tandem: options.tandem.createTandem( 'angleStandardDeviationNumberControl' ),
        phetioDocumentation: 'UI control to adjust the standard deviation of the launch angle'
      } )
    );

    const checkboxTitleOptions = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
    const checkboxOptions = { maxWidth: checkboxTitleOptions.maxWidth, boxWidth: 18 };
    const rapidFireModeLabel = new Text( 'Rapid fire', ProjectileMotionConstants.LABEL_TEXT_OPTIONS );
    const rapidFireModeCheckbox = new Checkbox( rapidFireModeProperty, rapidFireModeLabel,
      merge( { tandem: options.tandem.createTandem( 'rapidFireCheckbox' ) }, checkboxOptions )
    );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        new VBox( {
          align: 'center',
          spacing: options.controlsVerticalSpace,
          children: [
            groupSizeNumberControl,
            new VStrut( 1 ),
            speedStandardDeviationNumberControl,
            angleStandardDeviationNumberControl,
            new VStrut( 6 )
          ]
        } ),
        new VBox( {
          align: 'left',
          spacing: options.controlsVerticalSpace,
          children: [ rapidFireModeCheckbox ]
        } )
      ]
    } );

    super( content, options );
  }
}

projectileMotion.register( 'StatsControlPanel', StatsControlPanel );
export default StatsControlPanel;
