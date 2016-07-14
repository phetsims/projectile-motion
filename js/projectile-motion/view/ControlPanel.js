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
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HSlider = require( 'SUN/HSlider' );
  var CheckBox = require( 'SUN/CheckBox' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/projectile-motion/ProjectileMotionConstants' );

  // strings
  var velocityString = require( 'string!PROJECTILE_MOTION/velocity' );
  var angleString = require( 'string!PROJECTILE_MOTION/angle' );
  var massString = 'Mass';
  var diameterString = 'Diameter';
  var airResistanceString = 'Air Resistance';

  // constants
  var LABEL_OPTIONS = { font: ProjectileMotionConstants.LABEL_FONT };

  /**
   * Control panel constructor
   * @param {BarMagnet} barMagnetModel the entire model for the bar magnet screen
   * @param {Object} [options] scenery options for rendering the control panel, see the constructor for options.
   * @constructor
   */
  function ControlPanel( projectileMotionModel, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        xMargin: 10,
        yMargin: 10,
        stroke: 'orange',
        lineWidth: 3
      },
      options );

    // auxiliary function that creates the string for a text label
    // @param {String} label
    // @param {Number} value
    var createLabelText = function( label, value ) {
      return label + ': ' + value.toFixed( 2 );
    };

    var createParameterControlBox = function( label, property, range ) {
      var parameterLabel = new Text( createLabelText( label, property.value ), LABEL_OPTIONS );
      property.link( function( v ) {
        parameterLabel.text = createLabelText( label, v );
      } );
      var setParameterSlider = new HSlider( property, range );
      return new VBox( { spacing: 10, children: [ parameterLabel, setParameterSlider ] } );
    };

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

    var massBox = createParameterControlBox(
      massString,
      projectileMotionModel.massProperty,
      ProjectileMotionConstants.MASS_RANGE
    );

    var diameterBox = createParameterControlBox(
      diameterString,
      projectileMotionModel.diameterProperty,
      ProjectileMotionConstants.DIAMETER_RANGE
    );

    var airResistanceLabel = new Text( airResistanceString );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, projectileMotionModel.airResistanceOnProperty );

    var fireListener = function() {
      projectileMotionModel.cannonFired();
    };

    var fireButton = new RoundPushButton( {
      baseColor: '#94b830', //green
      listener: fireListener
    } );

    // 'Reset All' button, resets the sim to its initial state
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        projectileMotionModel.reset();
      }
    } );

    // The contents of the control panel
    var content = new VBox( {
      align: 'center',
      spacing: 10,
      children: [
        velocityBox,
        angleBox,
        massBox,
        diameterBox,
        airResistanceCheckBox,
        fireButton,
        resetAllButton
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'ControlPanel', ControlPanel );

  return inherit( Panel, ControlPanel );
} );

