// Copyright 2017, University of Colorado Boulder

/**
 * icon node for the 'Lab' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Image = require( 'SCENERY/nodes/Image' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var Node = require( 'SCENERY/nodes/Node' );

  // image
  var cannonBaseBottomImage = require( 'image!PROJECTILE_MOTION/cannon_base_bottom.png' );
  var cannonBaseTopImage = require( 'image!PROJECTILE_MOTION/cannon_base_top.png' );
  var cannonBarrelImage = require( 'image!PROJECTILE_MOTION/cannon_barrel.png' );
  var cannonBarrelTopImage = require( 'image!PROJECTILE_MOTION/cannon_barrel_top.png' );

  // constants
  var SCREEN_ICON_SIZE = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE;
  var NAV_ICON_SIZE = Screen.MINIMUM_NAVBAR_ICON_SIZE;
  var CANNON_ANGLE = 35;
  var BRIGHT_GRAY_COLOR = new Color( 230, 230, 230, 1 );
  var DARK_GRAY_COLOR = new Color( 103, 103, 103, 1 );

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
    var scalableNode = new Node( { x: cannonX, y: cannonY } );

    // cannon
    var cannonBarrel = new Node( { rotation: -CANNON_ANGLE * Math.PI / 180 } );
    scalableNode.addChild( cannonBarrel );

    var cannonBarrelTop = new Image( cannonBarrelTopImage, { centerY: 0 } );
    var cannonBarrelBase = new Image( cannonBarrelImage, { centerY: 0, right: cannonBarrelTop.right } );

    cannonBarrel.addChild( cannonBarrelBase );
    cannonBarrel.addChild( cannonBarrelTop );

    var cannonBase = new Node( { pickable: true, cursor: 'pointer' } );
    scalableNode.addChild( cannonBase );

    var cannonBaseBottom = new Image( cannonBaseBottomImage, { top: 0, centerX: 0 } );
    cannonBase.addChild( cannonBaseBottom );
    var cannonBaseTop = new Image( cannonBaseTopImage, { bottom: 0, centerX: 0 } );
    cannonBase.addChild( cannonBaseTop );

    scalableNode.setScaleMagnitude( cannonLength / cannonBarrelTop.width );
    
    //pedestal
    var ellipseShape = Shape.ellipse( 0, 0, scaledEllipseWidth / 2, scaledEllipseHeight / 2 );
    var cylinderTop = new Path( ellipseShape, {
      x: cannonX,
      y: scalableNode.bottom - scaledEllipseHeight / 4,
      fill: DARK_GRAY_COLOR,
      stroke: BRIGHT_GRAY_COLOR,
      lineWidth: 2
    } );

    var sideShape = new Shape();
    sideShape.moveTo( cannonX - scaledEllipseWidth / 2, height - 1 )
      .lineTo( cannonX - scaledEllipseWidth / 2, cylinderTop.y )
      .ellipticalArc( cannonX, cylinderTop.y, scaledEllipseWidth / 2, scaledEllipseHeight / 2, 0, Math.PI, 0, true )
      .lineTo( cannonX + scaledEllipseWidth / 2, height - 1 )
      .close();
    var sideFill = new LinearGradient( cannonX - scaledEllipseWidth / 2, 0, cannonX + scaledEllipseWidth / 2, 0 )
      .addColorStop( 0.0, DARK_GRAY_COLOR )
      .addColorStop( 0.3, BRIGHT_GRAY_COLOR )
      .addColorStop( 1, DARK_GRAY_COLOR );
    var cylinderSide = new Path( sideShape, { fill: sideFill, stroke: BRIGHT_GRAY_COLOR, lineWidth: 2 } );

    // layer for angle indicators
    var angleIndicator = new Node( { x: cannonX, y: cannonY } );

    // crosshair view
    var crosshairShape = new Shape()
      .moveTo( -width * 0.2, 0 )
      .lineTo( width * 0.5, 0 )
      .moveTo( 0, -height * 0.3 )
      .lineTo( 0, height * 0.3 );
    var crosshair = new Path( crosshairShape, { stroke: 'gray' } );
    angleIndicator.addChild( crosshair );

    var darkerCrosshairShape = new Shape()
      .moveTo( -height / 25, 0 )
      .lineTo( height / 25, 0 )
      .moveTo( 0, -height / 25 )
      .lineTo( 0, height / 25 );
    var darkerCrosshair = new Path( darkerCrosshairShape, { stroke: 'black', lineWidth: 3 } );
    angleIndicator.addChild( darkerCrosshair );

    // view for the angle arc
    var arcShape = Shape.arc( 0, 0, cannonLength + 5, 0, -CANNON_ANGLE * Math.PI / 180, true );
    var angleArc = new Path( arcShape, { stroke: 'gray' } );
    angleIndicator.addChild( angleArc );

    // create the background
    var backgroundFill = new LinearGradient( 0, 0, 0, height ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
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

  return inherit( Rectangle, LabIconNode );
} );