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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HSlider = require( 'SUN/HSlider' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );

  // strings

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

    var setVelocitySlider = new HSlider( projectileMotionModel.velocityProperty, { min: 0, max: 100 } );

    var goListener = function() {
      console.log( 'made it into go listener function' );
      projectileMotionModel.createTrajectory();
      projectileMotionModel.running = true;
    };

    var goButton = new RoundPushButton( {
      baseColor: '#94b830',
      listener: goListener
    } ); //green

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
        setVelocitySlider,
        goButton,
        resetAllButton
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'ControlPanel', ControlPanel );

  return inherit( Panel, ControlPanel );
} );

