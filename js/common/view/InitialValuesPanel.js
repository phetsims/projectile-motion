// Copyright 2013-2015, University of Colorado Boulder

/**
 * First control panel on the right.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
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
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

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
   * @param {Property.<number>} launchVelocityProperty - velocity of next projectile
   * @constructor
   */
  function InitialValuesPanel( cannonHeightProperty, cannonAngleProperty, launchVelocityProperty, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    /**
     * Auxiliary function that creates vbox for a parameter label and slider
     * @param {string} label
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Object} range, range has keys min and max
     * @returns {VBox}
     * @private
     */
    function createParameterControlBox( labelString, unitsString, property, range, valueUnitsString ) {
      var parameterLabel = new Text( unitsString ? StringUtils.format( pattern0Label1UnitsString, labelString, unitsString ) : labelString,
        LABEL_OPTIONS
      );

      var setParameterSpinner = new NumberSpinner( property, range, _.extend( {
        arrowsPosition: 'leftRight',
        xMargin: 8,
        yMargin: options.textDisplayYMargin,
        backgroundMinWidth: options.textDisplayWidth,
        valuePattern: valueUnitsString ? StringUtils.format( pattern0Value1UnitsString, '{0}', valueUnitsString ) : '{0}'
      }, LABEL_OPTIONS ) );

      var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - setParameterSpinner.width;

      var parameterBox = new HBox( {
        align: 'top',
        spacing: xSpacing,
        children: [ parameterLabel, setParameterSpinner ]
      } );

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
      majorTickLength: 5,
      trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 20, 0.5 ),
      thumbSize: new Dimension2( 16, 28 )
    } );
    velocitySlider.addMajorTick( ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE.min );
    velocitySlider.addMajorTick( ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE.max );
    // velocitySlider.scale( ( options.minWidth - 2 * options.xMargin - 20 ) / velocitySlider.width );

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

    var initialValuesVBox = new VBox( {
      align: 'center',
      spacing: options.controlsVerticalSpace,
      children: [
        new Text( initialValuesString, TITLE_OPTIONS ),
        content,
        velocitySlider
      ]
    } );

    Panel.call( this, initialValuesVBox, options );
  }

  projectileMotion.register( 'InitialValuesPanel', InitialValuesPanel );

  return inherit( Panel, InitialValuesPanel );
} );

