// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  

  // strings
  var initialValuesString = 'Initial Values';
  var heightString = 'Height';
  var angleString = require( 'string!PROJECTILE_MOTION/angle' );
  var velocityString = require( 'string!PROJECTILE_MOTION/velocity' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var PANEL_TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;

  /**
   * Control panel constructor
   * @param {Property.<number>} cannonHeightProperty - height of the cannon
   * @param {Property.<number>} cannonAngleProperty - angle of the cannon, in radians
   * @param {Property.<number>} velocityProperty - velocity of next projectile
   * @constructor
   */
  function InitialValuesPanel( cannonHeightProperty, cannonAngleProperty, velocityProperty, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        titleToControlsVerticalSpace: 5,
        horizontalMin: 120,
        xMargin: 10,
        yMargin: 10,
        fill: ProjectileMotionConstants.PANEL_FILL_COLOR
      },
      options );

    var heightBox = this.createParameterControlBox(
      heightString,
      cannonHeightProperty,
      ProjectileMotionConstants.CANNON_HEIGHT_RANGE
    );

    var velocityBox = this.createParameterControlBox(
      velocityString,
      velocityProperty,
      ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE
    );

    var angleBox = this.createParameterControlBox(
      angleString,
      cannonAngleProperty,
      ProjectileMotionConstants.CANNON_ANGLE_RANGE
    );

    // contents of the panel
    var content = new VBox( {
      align: 'left',
      // spacing: 10,
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

    // @private Auxiliary function takes {string} label and {number} value
    // and returns {string} label and the value to two digits
    createLabelText: function( label, value ) {
      return label + ': ' + value.toFixed( 2 );
    },

    /**
     * Auxiliary function that creates vbox for a parameter label and slider
     * @param {string} label
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Object} range, range has keys min and max
     * @return {VBox}
     * @private
     */
    createParameterControlBox: function( label, property, range ) {
      var thisPanel = this;
      var parameterLabel = new Text( this.createLabelText( label, property.value ), LABEL_OPTIONS );
      property.link( function( v ) {
        parameterLabel.text = thisPanel.createLabelText( label, v );
      } );
      var setParameterSlider = new HSlider( property, range );
      return new VBox( { spacing: 2, children: [ parameterLabel, setParameterSlider ] } );
    }

  } );
} );

