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
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/projectile-motion/ProjectileMotionConstants' );

  // strings
  var velocityString = require( 'string!PROJECTILE_MOTION/velocity' );
  var angleString = require( 'string!PROJECTILE_MOTION/angle' );

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
    var createLabelText = function( label, value ) {
      return label + ': ' + Math.round( value );
    };

    // all things control related to velocity
    var velocityLabel = new Text( createLabelText( velocityString, projectileMotionModel.velocity ), LABEL_OPTIONS );
    projectileMotionModel.velocityProperty.link( function( v ) {
      velocityLabel.text = createLabelText( velocityString, v );
    } );
    var setVelocitySlider = new HSlider(
      projectileMotionModel.velocityProperty,
      ProjectileMotionConstants.VELOCITY_RANGE
    );
    var velocityBox = new VBox( { spacing: 10, children: [ velocityLabel, setVelocitySlider ] } );

    // all things control related to angle
    var angleLabel = new Text( createLabelText( angleString, projectileMotionModel.angle ), { font: ProjectileMotionConstants.LABEL_FONT } );
    projectileMotionModel.angleProperty.link( function( a ) {
      angleLabel.text = createLabelText( angleString, a );
    } );
    var setAngleSlider = new HSlider(
      projectileMotionModel.angleProperty,
      ProjectileMotionConstants.ANGLE_RANGE
    );
    var angleBox = new VBox( { spacing: 10, children: [ angleLabel, setAngleSlider ] } );

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
        fireButton,
        resetAllButton
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'ControlPanel', ControlPanel );

  return inherit( Panel, ControlPanel );
} );

