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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  

  // strings
  var initialValuesString = 'Initial Values';
  var heightString = 'Height';
  var angleString = require( 'string!PROJECTILE_MOTION/angle' );
  var velocityString = require( 'string!PROJECTILE_MOTION/velocity' );

  // constants
  var LABEL_OPTIONS = { font: new PhetFont( 11 ) };
  var PANEL_TITLE_OPTIONS = { font: new PhetFont( 16 ), align: 'center' };

  /**
   * Control panel constructor
   * @param {BarMagnet} barMagnetModel the entire model for the bar magnet screen
   * @param {Object} [options] scenery options for rendering the control panel, see the constructor for options.
   * @constructor
   */
  function InitialValuesPanel( projectileMotionModel, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        titleToControlsVerticalSpace: 5,
        xMargin: 10,
        yMargin: 10,
        stroke: 'orange',
        lineWidth: 3
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
      projectileMotionModel.heightProperty,
      ProjectileMotionConstants.HEIGHT_RANGE
    );

    var velocityBox = createParameterControlBox(
      velocityString,
      projectileMotionModel.velocityProperty,
      ProjectileMotionConstants.VELOCITY_RANGE
    );

    var angleBox = createParameterControlBox(
      angleString,
      projectileMotionModel.angleProperty,
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
        new VStrut( options.titleToControlsVerticalSpace ),
        new HBox( { children: [ content ] } )
        // TODO: add HStrut so panel size doesn't change
      ]
    } );

    Panel.call( this, initialValuesVBox, options );
  }

  projectileMotion.register( 'InitialValuesPanel', InitialValuesPanel );

  return inherit( Panel, InitialValuesPanel );
} );

