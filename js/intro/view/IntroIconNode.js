// Copyright 2017, University of Colorado Boulder

/**
 * icon node for the 'Intro' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );

  // constants
  var WIDTH = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
  var HEIGHT = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;

  /**
   * @constructor
   */
  function IntroIconNode() {

    // create the background
    var backgroundFill = new LinearGradient( 0, 0, 0, HEIGHT ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
    Rectangle.call( this, 0, 0, WIDTH, HEIGHT, { fill: backgroundFill } );


  }

  projectileMotion.register( 'IntroIconNode', IntroIconNode );

  return inherit( Rectangle, IntroIconNode );
} );