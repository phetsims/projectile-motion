// Copyright 2017-2020, University of Colorado Boulder

/**
 * icon node for the 'Lab' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Screen from '../../../../joist/js/Screen.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import cannonBarrelTopImage from '../../../images/cannon_barrel_top_png.js';
import cannonBarrelImage from '../../../mipmaps/cannon_barrel_png.js';
import cannonBaseBottomImage from '../../../mipmaps/cannon_base_bottom_png.js';
import cannonBaseTopImage from '../../../mipmaps/cannon_base_top_png.js';
import projectileMotion from '../../projectileMotion.js';

// image

// constants
const SCREEN_ICON_SIZE = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE;
const NAV_ICON_SIZE = Screen.MINIMUM_NAVBAR_ICON_SIZE;
const CANNON_ANGLE = 35;
const BRIGHT_GRAY_COLOR = new Color( 230, 230, 230, 1 );
const DARK_GRAY_COLOR = new Color( 103, 103, 103, 1 );

/**
 * @constructor
 * @param {string} type - 'nav' or 'screen'
 */
function LabIconNode( type ) {

  assert && assert( type === 'nav' || type === 'screen', 'invalid value for type: ' + type );

  // nav bar icon has a bigger cannon than that of the home screen icon

  if ( type === 'nav' ) {
    var width = NAV_ICON_SIZE.width;
    var height = NAV_ICON_SIZE.height;
    var cannonLength = width / 2;
    var cannonX = width * 0.4;
    var cannonY = height * 0.6;

    var scaledEllipseWidth = cannonLength * 1.2;
    var scaledEllipseHeight = cannonLength * 0.15;
  }
  else {
    width = SCREEN_ICON_SIZE.width;
    height = SCREEN_ICON_SIZE.height;
    cannonLength = width * 0.4;
    cannonX = width * 0.4;
    cannonY = height / 2;

    scaledEllipseWidth = cannonLength * 1.2;
    scaledEllipseHeight = cannonLength * 0.15;
  }

  // layer for scalable cannon parts
  const scalableNode = new Node( { x: cannonX, y: cannonY } );

  // cannon
  const cannonBarrel = new Node( { rotation: -CANNON_ANGLE * Math.PI / 180 } );
  scalableNode.addChild( cannonBarrel );

  const cannonBarrelTop = new Image( cannonBarrelTopImage, { centerY: 0 } );
  const cannonBarrelBase = new Image( cannonBarrelImage, { centerY: 0, right: cannonBarrelTop.right } );

  cannonBarrel.addChild( cannonBarrelBase );
  cannonBarrel.addChild( cannonBarrelTop );

  const cannonBase = new Node( { pickable: true, cursor: 'pointer' } );
  scalableNode.addChild( cannonBase );

  const cannonBaseBottom = new Image( cannonBaseBottomImage, { top: 0, centerX: 0 } );
  cannonBase.addChild( cannonBaseBottom );
  const cannonBaseTop = new Image( cannonBaseTopImage, { bottom: 0, centerX: 0 } );
  cannonBase.addChild( cannonBaseTop );

  scalableNode.setScaleMagnitude( cannonLength / cannonBarrelTop.width );

  //pedestal
  const ellipseShape = Shape.ellipse( 0, 0, scaledEllipseWidth / 2, scaledEllipseHeight / 2 );
  const cylinderTop = new Path( ellipseShape, {
    x: cannonX,
    y: scalableNode.bottom - scaledEllipseHeight / 4,
    fill: DARK_GRAY_COLOR,
    stroke: BRIGHT_GRAY_COLOR,
    lineWidth: 2
  } );

  const sideShape = new Shape();
  sideShape.moveTo( cannonX - scaledEllipseWidth / 2, height - 1 )
    .lineTo( cannonX - scaledEllipseWidth / 2, cylinderTop.y )
    .ellipticalArc( cannonX, cylinderTop.y, scaledEllipseWidth / 2, scaledEllipseHeight / 2, 0, Math.PI, 0, true )
    .lineTo( cannonX + scaledEllipseWidth / 2, height - 1 )
    .close();
  const sideFill = new LinearGradient( cannonX - scaledEllipseWidth / 2, 0, cannonX + scaledEllipseWidth / 2, 0 )
    .addColorStop( 0.0, DARK_GRAY_COLOR )
    .addColorStop( 0.3, BRIGHT_GRAY_COLOR )
    .addColorStop( 1, DARK_GRAY_COLOR );
  const cylinderSide = new Path( sideShape, { fill: sideFill, stroke: BRIGHT_GRAY_COLOR, lineWidth: 2 } );

  // layer for angle indicators
  const angleIndicator = new Node( { x: cannonX, y: cannonY } );

  // crosshair view
  const crosshairShape = new Shape()
    .moveTo( -width * 0.2, 0 )
    .lineTo( width * 0.5, 0 )
    .moveTo( 0, -height * 0.3 )
    .lineTo( 0, height * 0.3 );
  const crosshair = new Path( crosshairShape, { stroke: 'gray' } );
  angleIndicator.addChild( crosshair );

  const darkerCrosshairShape = new Shape()
    .moveTo( -height / 25, 0 )
    .lineTo( height / 25, 0 )
    .moveTo( 0, -height / 25 )
    .lineTo( 0, height / 25 );
  const darkerCrosshair = new Path( darkerCrosshairShape, { stroke: 'black', lineWidth: 3 } );
  angleIndicator.addChild( darkerCrosshair );

  // view for the angle arc
  const arcShape = Shape.arc( 0, 0, cannonLength + 5, 0, -CANNON_ANGLE * Math.PI / 180, true );
  const angleArc = new Path( arcShape, { stroke: 'gray' } );
  angleIndicator.addChild( angleArc );

  // create the background
  const backgroundFill = new LinearGradient( 0, 0, 0, height ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
  Rectangle.call( this, 0, 0, width, height, {
    fill: backgroundFill,
    children: [
      cylinderSide,
      cylinderTop,
      scalableNode,
      angleIndicator
    ]
  } );

}

projectileMotion.register( 'LabIconNode', LabIconNode );

inherit( Rectangle, LabIconNode );
export default LabIconNode;