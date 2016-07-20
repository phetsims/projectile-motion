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
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HSlider = require( 'SUN/HSlider' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  

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
   * @param {Property} heightProperty - height of the cannon
   * @param {Property} angleProperty - angle of the cannon
   * @param {Property} velocityProperty - velocity of next projectile
   * @constructor
   */
  function InitialValuesPanel( heightProperty, angleProperty, velocityProperty, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        titleToControlsVerticalSpace: 5,
        horizontalMin: 120,
        xMargin: 10,
        yMargin: 10,
        fill: ProjectileMotionConstants.PANEL_FILL_COLOR
      },
      options );

    // auxiliary function that creates the string for a text label
    // @param {String} label
    // @param {Number} value
    // @return {String}
    var createLabelText = function( label, value ) {
      return label + ': ' + value.toFixed( 2 );
    };

    // auxiliary function that creates vbox for a parameter label and slider
    // @param {String} label
    // @param {Property} property
    // @param {Object} range, range has keys min and max
    // @return {VBox}
    var createParameterControlBox = function( label, property, range ) {
      var parameterLabel = new Text( createLabelText( label, property.value ), LABEL_OPTIONS );
      property.link( function( v ) {
        parameterLabel.text = createLabelText( label, v );
      } );
      var setParameterSlider = new HSlider( property, range );
      return new VBox( { spacing: 2, children: [ parameterLabel, setParameterSlider ] } );
    };

    var heightBox = createParameterControlBox(
      heightString,
      heightProperty,
      ProjectileMotionConstants.HEIGHT_RANGE
    );

    var velocityBox = createParameterControlBox(
      velocityString,
      velocityProperty,
      ProjectileMotionConstants.VELOCITY_RANGE
    );

    var angleBox = createParameterControlBox(
      angleString,
      angleProperty,
      ProjectileMotionConstants.ANGLE_RANGE
    );

    // The contents of the control panel
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

  return inherit( Panel, InitialValuesPanel );
} );

