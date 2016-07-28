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
  // var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberSpinner = require( 'SUN/NumberSpinner' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  // var VStrut = require( 'SCENERY/nodes/VStrut' );
  // var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );


  // strings
  var initialValuesString = 'Initial Values';
  var heightString = 'Height (m)';
  var angleString = require( 'string!PROJECTILE_MOTION/angle' );
  var speedString = 'Speed (m/s)';

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
    function createParameterControlBox( label, property, range ) {
      var parameterLabel = new Text( label, LABEL_OPTIONS );

      // TODO: degrees units for angle
      var setParameterSpinner = new NumberSpinner( property, range, _.extend( {
        arrowsPosition: 'leftRight',
        xMargin: 8,
        yMargin: 5
      }, LABEL_OPTIONS ) );

      var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - setParameterSpinner.width;

      var parameterBox = new HBox( {
        align: 'top',
        spacing: xSpacing,
        children: [ parameterLabel, setParameterSpinner ]
      } );

      return parameterBox;
    }

    // TODO: fix number spinner size and alignment

    var heightBox = createParameterControlBox(
      heightString,
      cannonHeightProperty,
      ProjectileMotionConstants.CANNON_HEIGHT_RANGE
    );

    var angleBox = createParameterControlBox(
      angleString,
      cannonAngleProperty,
      ProjectileMotionConstants.CANNON_ANGLE_RANGE
    );

    var velocityBox = createParameterControlBox(
      speedString,
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

