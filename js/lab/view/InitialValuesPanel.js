// Copyright 2017, University of Colorado Boulder

/**
 * Control panel that allows users to modify initial values for how the cannon fires a projectile.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
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
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, { yMargin: 5 }, options );
    
    // local vars for layout and formatting
    var titleOptions = _.defaults( { maxWidth: options.minWidth - 2 * options.xMargin }, TITLE_OPTIONS );
    var parameterLabelOptions = _.defaults( { maxWidth: options.minWidth - 2 * options.xMargin }, LABEL_OPTIONS );

    /**
     * Auxiliary function that creates vbox for a parameter label and slider
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} valueProperty - the Property that is set and linked to
     * @param {Range} range - range for the valueProperty value
     * @param {string} degreeString - optional, just for the angle
     * @returns {VBox}
     */
    function createParameterControlBox( labelString, unitsString, valueProperty, range, degreeString ) {
      var parameterLabel = new Text( '', parameterLabelOptions );

      valueProperty.link( function( value ) {
        var valueReadout = degreeString ?
                           StringUtils.fillIn( pattern0Value1UnitsString, {
                             value: Util.toFixedNumber( value, 2 ),
                             units: degreeString
                           } ) :
                           StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
                             value: Util.toFixedNumber( value, 2 ),
                             units: unitsString
                           } );
        parameterLabel.setText( labelString + ': ' + valueReadout );
      } );

      return new VBox( {
        align: 'left',
        children: [ parameterLabel, new HStrut( options.minWidth - 2 * options.xMargin ) ]
      } );
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
      spacing: options.controlsVerticalSpace / 3,
      children: [
        heightBox,
        angleBox,
        velocityBox
      ]
    } );

    var initialValuesTitle = new Text( initialValuesString, titleOptions );

    var initialValuesVBox = new VBox( {
      align: 'center',
      spacing: 0,
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