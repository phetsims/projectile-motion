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
  // var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  // var HSlider = require( 'SUN/HSlider' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberSpinner = require( 'SUN/NumberSpinner' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  // var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );


  // strings
  var initialValuesString = 'Initial Values';
  var heightString = 'Height (m)';
  var angleString = require( 'string!PROJECTILE_MOTION/angle' );
  var speedString = 'Speed (m/s)'
  
  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var PANEL_TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;

  /**
   * Control panel constructor
   * @param {Property.<number>} cannonHeightProperty - height of the cannon
   * @param {Property.<number>} cannonAngleProperty - angle of the cannon, in degrees
   * @param {Property.<number>} launchVelocityProperty - velocity of next projectile
   * @constructor
   */
  function InitialValuesPanel( cannonHeightProperty, cannonAngleProperty, launchVelocityProperty, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
      titleToControlsVerticalSpace: 5,
      horizontalMin: 180,
      xMargin: 10,
      yMargin: 10,
      fill: ProjectileMotionConstants.PANEL_FILL_COLOR
    }, options );

    var heightBox = this.createParameterControlBox(
      heightString,
      cannonHeightProperty,
      ProjectileMotionConstants.CANNON_HEIGHT_RANGE
    );

    var angleBox = this.createParameterControlBox(
      angleString,
      cannonAngleProperty,
      ProjectileMotionConstants.CANNON_ANGLE_RANGE
    );

    var velocityBox = this.createParameterControlBox(
      speedString,
      launchVelocityProperty,
      ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE
    );

    // contents of the panel
    var content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        heightBox,
        angleBox,
        velocityBox
      ]
    } );

    var initialValuesVBox = new VBox( {
      align: 'center',
      // spacing: 10,
      children: [
        new Text( initialValuesString, PANEL_TITLE_OPTIONS ),
        new HStrut( options.horizontalMin ),
        new VStrut( options.titleToControlsVerticalSpace ),
        new HBox( { children: [ content ] } )
      ]
    } );

    Panel.call( this, initialValuesVBox, options );
  }

  projectileMotion.register( 'InitialValuesPanel', InitialValuesPanel );

  return inherit( Panel, InitialValuesPanel, {

    /**
     * Auxiliary function that creates vbox for a parameter label and slider
     * @param {string} label
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Object} range, range has keys min and max
     * @returns {VBox}
     * @private
     */
    createParameterControlBox: function( label, property, range ) {
      var parameterLabel = new Text( label, LABEL_OPTIONS );
      var setParameterSpinner = new NumberSpinner( property, range, _.extend( {
        arrowsPosition: 'leftRight'
      }, LABEL_OPTIONS ) );
      return new HBox( {
        align: 'top',
        spacing: 2,
        children: [ parameterLabel, setParameterSpinner ]
      } );
    }

  } );
} );

