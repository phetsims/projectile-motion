// Copyright 2017-2020, University of Colorado Boulder

/**
 * icon node for the 'Vectors' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Screen from '../../../../joist/js/Screen.js';
import inherit from '../../../../phet-core/js/inherit.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import projectileMotion from '../../projectileMotion.js';

// constants
const SCREEN_ICON_SIZE = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE;
const NAV_ICON_SIZE = Screen.MINIMUM_NAVBAR_ICON_SIZE;
const VELOCITY_ARROW_FILL = 'rgb( 50, 255, 50 )';
const ACCELERATION_ARROW_FILL = 'rgb( 255, 255, 50 )';
const ARROW_TAIL_WIDTH = 6;
const ARROW_HEAD_WIDTH = 12;
const ARROW_HEAD_HEIGHT = 12;

/**
 * @param {string} type - 'nav' or 'screen'
 * @constructor
 */
function VectorsIconNode( type ) {

  Rectangle.call( this, 0, 0, 0, 0 );

  assert && assert( type === 'nav' || type === 'screen', 'invalid value for type: ' + type );

  // the nav bar icon has larger projectile object and vectors than those of the home screen icon
  if ( type === 'nav' ) {
    var width = NAV_ICON_SIZE.width;
    var height = NAV_ICON_SIZE.height;
    var projectileX = width * 0.4;
    var projectileY = height / 2;
    var projectile = new Circle( height / 4, { x: projectileX, y: projectileY, fill: 'black' } );
    this.addChild( projectile );
    var arrowScale = 1.5;
    var velocityArrow = new ArrowNode( projectileX, projectileY, width * 0.7, height * 0.1, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH * arrowScale,
      headWidth: ARROW_HEAD_WIDTH * arrowScale,
      headHeight: ARROW_HEAD_HEIGHT * arrowScale
    } );
    this.addChild( velocityArrow );
    var accelerationArrow = new ArrowNode( projectileX, projectileY, projectileX, height * 0.9, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH * arrowScale,
      headWidth: ARROW_HEAD_WIDTH * arrowScale,
      headHeight: ARROW_HEAD_HEIGHT * arrowScale
    } );
    this.addChild( accelerationArrow );
  }
  else {
    width = SCREEN_ICON_SIZE.width;
    height = SCREEN_ICON_SIZE.height;
    projectileX = width * 0.4;
    projectileY = height / 2;
    projectile = new Circle( height / 6, { x: projectileX, y: projectileY, fill: 'black' } );
    this.addChild( projectile );
    arrowScale = 4;
    velocityArrow = new ArrowNode( projectileX, projectileY, width * 0.7, height * 0.2, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH * arrowScale,
      headWidth: ARROW_HEAD_WIDTH * arrowScale,
      headHeight: ARROW_HEAD_HEIGHT * arrowScale
    } );
    this.addChild( velocityArrow );
    accelerationArrow = new ArrowNode( projectileX, projectileY, projectileX, height * 0.85, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH * arrowScale,
      headWidth: ARROW_HEAD_WIDTH * arrowScale,
      headHeight: ARROW_HEAD_HEIGHT * arrowScale
    } );
    this.addChild( accelerationArrow );
  }

  // create the background
  const backgroundFill = new LinearGradient( 0, 0, 0, height ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
  this.mutate( { fill: backgroundFill } );
  this.setRectWidth( width );
  this.setRectHeight( height );
}

projectileMotion.register( 'VectorsIconNode', VectorsIconNode );

inherit( Rectangle, VectorsIconNode );
export default VectorsIconNode;