// Copyright 2019, University of Colorado Boulder

/**
 * A specific NumberControl for this sim that doesn't have tweaker buttons.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  const pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );

  // constants
  const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

  class TweakerlessNumberControl extends NumberControl {

    /**
     * Auxiliary function that creates a NumberControl
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} valueProperty - the Property that is set and linked to
     * @param {Range} range - range for the valueProperty value
     * @param {Number} round - for minor ticks
     * @param {Tandem} tandem
     * @param {Object} [options]
     * @returns {VBox}
     */
    constructor( labelString, unitsString, valueProperty, range, round, options ) {
      options = merge( {
        containerWidth: 200,
        textDisplayWidth: 20,
        xMargin: 8
      }, options );

      // local vars used for layout and formatting
      const textDisplayWidth = options.textDisplayWidth * 1.2;
      const parameterLabelOptions = merge( {}, LABEL_OPTIONS, {
        maxWidth: options.containerWidth - 3 * options.xMargin - textDisplayWidth
      } );

      options = merge( {
        numberDisplayOptions: {
          valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: unitsString } ),
          decimalPlaces: null,
          maxWidth: textDisplayWidth
        },
        sliderOptions: {
          constrainValue: value => Util.roundToInterval( value, round ), // two decimal place accuracy
          majorTickLength: 12,
          minorTickLength: 5,
          minorTickSpacing: round,
          tickLabelSpacing: 2,
          trackSize: new Dimension2( options.containerWidth - 2 * options.xMargin - 30, 0.5 ),
          thumbSize: new Dimension2( 13, 22 ),
          thumbTouchAreaXDilation: 6,
          thumbTouchAreaYDilation: 4, // smaller to prevent overlap with above number spinner buttons
          majorTicks: [
            { value: range.min, label: new Text( range.min, LABEL_OPTIONS ) },
            { value: range.max, label: new Text( range.max, LABEL_OPTIONS ) }
          ]
        },
        includeArrowButtons: false,
        layoutFunction: NumberControl.createLayoutFunction4( {
          sliderPadding: options.xMargin / 2
        } ),
        width: options.containerWidth - 3 * options.xMargin //  left, right, and sliderPadding *2
      }, {
        numberDisplayOptions: ProjectileMotionConstants.NUMBER_DISPLAY_OPTIONS,
        titleNodeOptions: parameterLabelOptions
      }, options );

      super( labelString, valueProperty, range, options );
    }
  }

  return projectileMotion.register( 'TweakerlessNumberControl', TweakerlessNumberControl );
} );

