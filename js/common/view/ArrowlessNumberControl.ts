// Copyright 2019-2023, University of Colorado Boulder

/**
 * A specific NumberControl for this sim that doesn't have tweaker buttons.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import { Text, TextOptions } from '../../../../scenery/js/imports.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import ProjectileMotionConstants, { ProjectileMotionUIOptions } from '../ProjectileMotionConstants.js';

const pattern0Value1UnitsWithSpaceString = ProjectileMotionStrings.pattern0Value1UnitsWithSpace;

type SelfOptions = {
  containerWidth?: number;
};

type ArrowlessNumberControlOptions = SelfOptions & ProjectileMotionUIOptions;

class ArrowlessNumberControl extends NumberControl {

  /**
   * Auxiliary function that creates a NumberControl
   * @param labelString - label for the parameter
   * @param unitsString - units
   * @param valueProperty - the Property that is set and linked to
   * @param range - range for the valueProperty value
   * @param round - for minor ticks
   */
  public constructor( labelString: string, unitsString: string, valueProperty: Property<number>, range: Range,
                      round: number, providedOptions?: ArrowlessNumberControlOptions ) {
    // options used to compute other option values
    const initialOptions = optionize<ArrowlessNumberControlOptions, SelfOptions, ProjectileMotionUIOptions>()( {
      containerWidth: 200,
      numberDisplayMaxWidth: 50, // this is a separate option as it is used to compute other components' maxWidth.
      xMargin: 8
    }, providedOptions );

    // compute maxWidth for subcomponents
    const titleMaxWidth = initialOptions.containerWidth - 3 * initialOptions.xMargin - initialOptions.numberDisplayMaxWidth;

    // now specify the rest of the options
    const options = optionize<ArrowlessNumberControlOptions, EmptySelfOptions, NumberControlOptions>()( {
      titleNodeOptions: combineOptions<TextOptions>( {}, ProjectileMotionConstants.PANEL_LABEL_OPTIONS, {
        maxWidth: titleMaxWidth
      } ),
      numberDisplayOptions: combineOptions<NumberDisplayOptions>( {}, ProjectileMotionConstants.NUMBER_DISPLAY_OPTIONS, {
        valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: unitsString } ),
        decimalPlaces: null,
        maxWidth: initialOptions.numberDisplayMaxWidth
      } ),
      sliderOptions: {
        constrainValue: value => Utils.roundToInterval( value, round ), // two decimal place accuracy
        majorTickLength: 12,
        minorTickLength: 5,
        minorTickSpacing: round,
        tickLabelSpacing: 2,
        trackSize: new Dimension2( initialOptions.containerWidth - 2 * initialOptions.xMargin - 30, 0.5 ),
        thumbSize: new Dimension2( 13, 22 ),
        thumbTouchAreaXDilation: 6,
        thumbTouchAreaYDilation: 4, // smaller to prevent overlap with above number spinner buttons
        majorTicks: [
          { value: range.min, label: new Text( range.min, ProjectileMotionConstants.PANEL_LABEL_OPTIONS ) },
          { value: range.max, label: new Text( range.max, ProjectileMotionConstants.PANEL_LABEL_OPTIONS ) }
        ]
      },
      includeArrowButtons: false,
      layoutFunction: NumberControl.createLayoutFunction4( {
        sliderPadding: initialOptions.xMargin / 2
      } )
    }, initialOptions );

    super( labelString, valueProperty, range, options );
  }
}

projectileMotion.register( 'ArrowlessNumberControl', ArrowlessNumberControl );
export default ArrowlessNumberControl;