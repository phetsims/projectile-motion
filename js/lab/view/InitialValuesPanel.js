// Copyright 2015, University of Colorado Boulder

/**
 * Control panel that allows users to modify initial values for how the cannon fires a projectile.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberSpinner = require( 'SUN/NumberSpinner' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Util = require( 'DOT/Util' );

  // strings
  var initialValuesString = require( 'string!PROJECTILE_MOTION/initialValues' );
  var pattern0Label1UnitsString = require( 'string!PROJECTILE_MOTION/pattern0Label1Units' );
  var pattern0Value1UnitsString = require( 'string!PROJECTILE_MOTION/pattern0Value1Units' );
  var heightString = require( 'string!PROJECTILE_MOTION/height' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var angleString = require( 'string!PROJECTILE_MOTION/angle' );
  var degreesSymbolString = require( 'string!PROJECTILE_MOTION/degreesSymbol' );
  var speedString = require( 'string!PROJECTILE_MOTION/speed' );
  var metersPerSecondString = require( 'string!PROJECTILE_MOTION/metersPerSecond' );

  // constants
  var TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

  /**
   * Control panel constructor
   * @param {Property.<number>} cannonHeightProperty - height of the cannon
   * @param {Property.<number>} cannonAngleProperty - angle of the cannon, in degrees
   * @param {Property.<number>} launchVelocityProperty - velocity of next projectile to be fired
   * @param {Object} [options]
   * @constructor
   */
  function InitialValuesPanel( cannonHeightProperty, cannonAngleProperty, launchVelocityProperty, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    // find max label width
    var exampleParameterSpinner = new NumberSpinner( new Property( 0 ), new Property( new Range( 0, 1 ) ), _.extend( {
      arrowsPosition: 'leftRight',
      xMargin: 8,
      yMargin: options.textDisplayYMargin,
      backgroundMinWidth: options.textDisplayWidth
    }, LABEL_OPTIONS ) );
    var maxLabelWidth = options.minWidth - 2 * options.xMargin - exampleParameterSpinner.width - options.xSpacing;

    var labelScale = Math.min( 1, maxLabelWidth / Math.max( new Text( StringUtils.format( pattern0Label1UnitsString, heightString, mString ), LABEL_OPTIONS ).width,
      new Text( angleString, LABEL_OPTIONS ).width,
      new Text( StringUtils.format( pattern0Label1UnitsString, speedString, metersPerSecondString ), LABEL_OPTIONS ).width
    ) );

    /**
     * Auxiliary function that creates vbox for a parameter label and slider
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Range} range - range for the property value
     * @returns {VBox}
     * @private
     */
    function createParameterControlBox( labelString, unitsString, property, range, valueUnitsString ) {
      var parameterLabel = new Text( unitsString ? StringUtils.format( pattern0Label1UnitsString, labelString, unitsString ) : labelString,
        LABEL_OPTIONS
      );

      var setParameterSpinner = new NumberSpinner( property, new Property( range ), _.extend( {
        arrowsPosition: 'leftRight',
        xMargin: 8,
        yMargin: options.textDisplayYMargin,
        backgroundMinWidth: options.textDisplayWidth,
        backgroundMaxWidth: options.textDisplayWidth,
        valuePattern: valueUnitsString ? StringUtils.format( pattern0Value1UnitsString, '{0}', valueUnitsString ) : '{0}'
      }, LABEL_OPTIONS ) );

      // TODO: layout for internationalized angle pattern string? E.g. backgroundMaxWidth?

      parameterLabel.scale( labelScale );

      var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - setParameterSpinner.width;

      var parameterBox = new HBox( {
        align: 'center',
        spacing: xSpacing,
        children: [ parameterLabel, setParameterSpinner ]
      } );

      parameterBox.parameterLabel = parameterLabel; // attach as property to resize

      return parameterBox;
    }

    var heightBox = createParameterControlBox(
      heightString,
      mString,
      cannonHeightProperty,
      ProjectileMotionConstants.CANNON_HEIGHT_RANGE
    );

    var angleBox = createParameterControlBox(
      angleString,
      null,
      cannonAngleProperty,
      ProjectileMotionConstants.CANNON_ANGLE_RANGE,
      degreesSymbolString
    );

    var velocityBox = createParameterControlBox(
      speedString,
      metersPerSecondString,
      launchVelocityProperty,
      ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE
    );

    var velocitySlider = new HSlider( launchVelocityProperty, ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE, {
      constrainValue: function( value ) { return Util.roundSymmetric( value ); },
      majorTickLength: 5,
      trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 20, 0.5 ),
      thumbSize: new Dimension2( 16, 28 ),
      thumbTouchAreaXDilation: 6,
      thumbTouchAreaYDilation: 4 // smaller to prevent overlap with above number spinner buttons
    } );
    velocitySlider.addMajorTick( ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE.min );
    velocitySlider.addMajorTick( ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE.max );

    // contents of the panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        heightBox,
        angleBox,
        velocityBox
      ]
    } );

    var initialValuesTitle = new Text( initialValuesString, TITLE_OPTIONS );
    initialValuesTitle.maxWidth = options.minWidth - 2 * options.xMargin;


    var initialValuesVBox = new VBox( {
      align: 'center',
      spacing: options.controlsVerticalSpace,
      children: [
        initialValuesTitle,
        content,
        velocitySlider
      ]
    } );

    Panel.call( this, initialValuesVBox, options );
  }

  projectileMotion.register( 'InitialValuesPanel', InitialValuesPanel );

  return inherit( Panel, InitialValuesPanel );
} );