// Copyright 2017, University of Colorado Boulder

/**
 * icon node for the 'Drag' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Screen = require( 'JOIST/Screen' );

  // constants
  const WIDTH = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
  const HEIGHT = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;

  /**
   * @constructor
   */
  function DragIconNode() {

    // create the background
    const backgroundFill = new LinearGradient( 0, 0, 0, HEIGHT ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
    Rectangle.call( this, 0, 0, WIDTH, HEIGHT, { fill: backgroundFill } );

    const diameter = HEIGHT / 4;
    const inset = diameter * 0.7;
    
    // the three projectile object shapes
    const teardrop = ProjectileObjectViewFactory.createCustom( diameter, 0.04 );
    teardrop.left = 10; // empirically determined
    teardrop.y = HEIGHT / 2;
    this.addChild( teardrop );

    const circle = ProjectileObjectViewFactory.createCustom( diameter, 0.47 );
    circle.left = teardrop.children[ 0 ].right + inset; // gets the shape, without the strut
    circle.y = teardrop.y;
    this.addChild( circle );
    
    const almostSemiCircle = ProjectileObjectViewFactory.createCustom( diameter, 1 );
    almostSemiCircle.left = circle.right + inset;
    almostSemiCircle.y = teardrop.y;
    this.addChild( almostSemiCircle );

  }

  projectileMotion.register( 'DragIconNode', DragIconNode );

  return inherit( Rectangle, DragIconNode );
} );