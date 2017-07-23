// Copyright 2017, University of Colorado Boulder

/**
 * icon node for the 'Drag' screen
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
  var ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );

  // constants
  var WIDTH = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
  var HEIGHT = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;

  /**
   * @constructor
   */
  function DragIconNode() {

    // create the background
    var backgroundFill = new LinearGradient( 0, 0, 0, HEIGHT ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
    Rectangle.call( this, 0, 0, WIDTH, HEIGHT, { fill: backgroundFill } );

    var diameter = HEIGHT / 4;
    var inset = diameter * 0.7;
    
    // the three projectile object shapes
    var teardrop = ProjectileObjectViewFactory.createCustom( diameter, 0.04 );
    teardrop.left = 10; // empirically determined
    teardrop.y = HEIGHT / 2;
    this.addChild( teardrop );

    var circle = ProjectileObjectViewFactory.createCustom( diameter, 0.47 );
    circle.left = teardrop.children[ 0 ].right + inset; // gets the shape, without the strut
    circle.y = teardrop.y;
    this.addChild( circle );
    
    var almostSemiCircle = ProjectileObjectViewFactory.createCustom( diameter, 1 );
    almostSemiCircle.left = circle.right + inset;
    almostSemiCircle.y = teardrop.y;
    this.addChild( almostSemiCircle );

  }

  projectileMotion.register( 'DragIconNode', DragIconNode );

  return inherit( Rectangle, DragIconNode );
} );