// Copyright 2015, University of Colorado Boulder

/**
 * Control panel that allows users to modify initial values for how the cannon fires a projectile.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  // var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  // var NumberSpinner = require( 'SUN/NumberSpinner' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  // var Property = require( 'AXON/Property' );
  // var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Util = require( 'DOT/Util' );

  // strings
  var initialValuesString = require( 'string!PROJECTILE_MOTION/initialValues' );
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
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

    // // find max label width for internationalization
    // var exampleParameterSpinner = new NumberSpinner( new Property( 0 ), new Property( new Range( 0, 1 ) ), _.extend( {
    //   arrowsPosition: 'leftRight',
    //   xMargin: 8,
    //   yMargin: options.textDisplayYMargin,
    //   backgroundMinWidth: options.textDisplayWidth
    // }, LABEL_OPTIONS ) );
    // var maxLabelWidth = options.minWidth - 2 * options.xMargin - exampleParameterSpinner.width - options.xSpacing;

    // var labelScale = Math.min( 1, maxLabelWidth / Math.max( new Text( StringUtils.format( pattern0Label1UnitsString, heightString, mString ), LABEL_OPTIONS ).width,
    //   new Text( angleString, LABEL_OPTIONS ).width,
    //   new Text( StringUtils.format( pattern0Label1UnitsString, speedString, metersPerSecondString ), LABEL_OPTIONS ).width
    // ) );

    /**
     * Auxiliary function that creates vbox for a parameter label and slider
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Range} range - range for the property value
     * @param {string} degreeString - optional, just for the angle
     * @returns {VBox}
     * @private
     */
    function createParameterControlBox( labelString, unitsString, property, range, degreeString ) {
      var parameterLabel = new Text( '', LABEL_OPTIONS );

      property.link( function( value ) {
        var valueReadout = degreeString ? StringUtils.format( pattern0Value1UnitsString, Util.toFixedNumber( value, 2 ), degreeString ) : StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( value, 2 ), unitsString );
        parameterLabel.setText( labelString + ': ' + valueReadout );
      } );

      return new VBox( { align: 'left', children: [ parameterLabel, new HStrut( options.minWidth - 2 * options.xMargin ) ] } );
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
      ]
    } );

    Panel.call( this, initialValuesVBox, options );

    // content.left = this.left;
  }

  projectileMotion.register( 'InitialValuesPanel', InitialValuesPanel );

  return inherit( Panel, InitialValuesPanel );
} );