// Copyright 2017-2020, University of Colorado Boulder

/**
 * icon node for the 'Drag' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Screen from '../../../../joist/js/Screen.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import ProjectileObjectViewFactory from '../../common/view/ProjectileObjectViewFactory.js';
import projectileMotion from '../../projectileMotion.js';

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

inherit( Rectangle, DragIconNode );
export default DragIconNode;