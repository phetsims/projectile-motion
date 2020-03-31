// Copyright 2019-2020, University of Colorado Boulder

/**
 * A specific NumberControl for this sim that doesn't have tweaker buttons.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import projectileMotionStrings from '../../projectileMotionStrings.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';

const pattern0Value1UnitsWithSpaceString = projectileMotionStrings.pattern0Value1UnitsWithSpace;

class ArrowlessNumberControl extends NumberControl {

  /**
   * Auxiliary function that creates a NumberControl
   * @param {string} labelString - label for the parameter
   * @param {string} unitsString - units
   * @param {Property.<number>} valueProperty - the Property that is set and linked to
   * @param {Range} range - range for the valueProperty value
   * @param {Number} round - for minor ticks
   * @param {Object} [options]
   * @returns {VBox}
   */
  constructor( labelString, unitsString, valueProperty, range, round, options ) {

    // options used to compute other option values
    options = merge( {
      containerWidth: 200,
      numberDisplayMaxWidth: 50, // this is a separate option as it is used to compute other components' maxWidth.
      xMargin: 8
    }, options );

    // compute maxWidth for subcomponents
    const titleMaxWidth = options.containerWidth - 3 * options.xMargin - options.numberDisplayMaxWidth;

    // now specify the rest of the options
    options = merge( {
      titleNodeOptions: merge( {}, ProjectileMotionConstants.PANEL_LABEL_OPTIONS, {
        maxWidth: titleMaxWidth
      } ),
      numberDisplayOptions: merge( {}, ProjectileMotionConstants.NUMBER_DISPLAY_OPTIONS, {
        valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: unitsString } ),
        decimalPlaces: null,
        maxWidth: options.numberDisplayMaxWidth
      } ),
      sliderOptions: {
        constrainValue: value => Utils.roundToInterval( value, round ), // two decimal place accuracy
        majorTickLength: 12,
        minorTickLength: 5,
        minorTickSpacing: round,
        tickLabelSpacing: 2,
        trackSize: new Dimension2( options.containerWidth - 2 * options.xMargin - 30, 0.5 ),
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
        sliderPadding: options.xMargin / 2
      } )
    }, options );

    super( labelString, valueProperty, range, options );
  }
}

projectileMotion.register( 'ArrowlessNumberControl', ArrowlessNumberControl );
export default ArrowlessNumberControl;