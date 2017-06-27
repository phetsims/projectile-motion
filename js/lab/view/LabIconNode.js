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
  var cannonBarrelBottomImage = require( 'image!PROJECTILE_MOTION/cannon_barrel_bottom.png' );
  var cannonBarrelTopImage = require( 'image!PROJECTILE_MOTION/cannon_barrel_top.png' );

  // constants
  var SCREEN_ICON_SIZE = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE;
  var NAV_ICON_SIZE = Screen.MINIMUM_NAVBAR_ICON_SIZE;
  var CANNON_ANGLE = 35;
  var BRIGHT_BLUE_COLOR = new Color( 26, 87, 230, 1 );
  var DARK_BLUE_COLOR = new Color( 10, 43, 116, 1 );

  /**
   * @constructor
   * @param {string} type - 'nav' or 'screen'
   */
  function LabIconNode( type ) {

    Rectangle.call( this, 0, 0, 0, 0 );

    assert && assert( type === 'nav' || type === 'screen', 'argument type should be nav or screen' );

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

    var cylinderSide = new Path( null );
    this.addChild( cylinderSide );

    var ellipseShape = Shape.ellipse( 0, 0, scaledEllipseWidth / 2, scaledEllipseHeight / 2 );
    
    var cylinderTop = new Path( ellipseShape, { x: cannonX, fill: DARK_BLUE_COLOR, stroke: BRIGHT_BLUE_COLOR, lineWidth: 2 } );
    this.addChild( cylinderTop );

    // layer for scalable cannon parts
    var scalableNode = new Node();
    this.addChild( scalableNode );

    var cannonBarrel = new Node();
    scalableNode.addChild( cannonBarrel );

    var cannonBarrelBottom = new Image( cannonBarrelBottomImage, { right: 0, centerY: 0 } );
    cannonBarrel.addChild( cannonBarrelBottom );
    var cannonBarrelTop = new Image( cannonBarrelTopImage, { left: 0, centerY: 0, pickable: true, cursor: 'pointer' } );
    cannonBarrel.addChild( cannonBarrelTop );

    var cannonBase = new Node( { pickable: true, cursor: 'pointer' } );
    scalableNode.addChild( cannonBase );

    var cannonBaseBottom = new Image( cannonBaseBottomImage, { top: 0, centerX: 0 } );
    cannonBase.addChild( cannonBaseBottom );
    var cannonBaseTop = new Image( cannonBaseTopImage, { bottom: 0, centerX: 0 } );
    cannonBase.addChild( cannonBaseTop );

    // layer for angle indicators
    var angleIndicator = new Node();
    this.addChild( angleIndicator );

    // view for the angle arc
    var angleArc = new Path( null, { stroke: 'gray' } );
    angleIndicator.addChild( angleArc );

    // crosshair view
    var crosshairShape = new Shape()
      .moveTo( -width * 0.1, 0 )
      .lineTo( width * 0.4, 0 )
      .moveTo( 0, -height * 0.3 )
      .lineTo( 0, height * 0.3 );

    var darkerCrosshairShape = new Shape()
      .moveTo( -height / 25, 0 )
      .lineTo( height / 25, 0 )
      .moveTo( 0, -height / 25 )
      .lineTo( 0, height / 25 );

    var arcShape = Shape.arc( 0, 0, cannonLength + 5, 0, -CANNON_ANGLE * Math.PI / 180, true );
    angleArc.setShape( arcShape );

    scalableNode.setScaleMagnitude( cannonLength / cannonBarrelTop.width );
    scalableNode.x = cannonX;
    scalableNode.y = cannonY;

    cylinderTop.y = scalableNode.bottom - scaledEllipseHeight / 4;

    var sideShape = new Shape();
    sideShape.moveTo( cannonX - scaledEllipseWidth / 2, height - 1 )
      .lineTo( cannonX - scaledEllipseWidth / 2, cylinderTop.y )
      .ellipticalArc( cannonX, cylinderTop.y, scaledEllipseWidth / 2, scaledEllipseHeight / 2, 0, Math.PI, 0, true )
      .lineTo( cannonX + scaledEllipseWidth / 2, height - 1 )
      .close();
    cylinderSide.setShape( sideShape );
    var sideFill = new LinearGradient( cannonX - scaledEllipseWidth / 2, 0, cannonX + scaledEllipseWidth / 2, 0 ).addColorStop( 0.0, DARK_BLUE_COLOR ).addColorStop( 0.3, BRIGHT_BLUE_COLOR ).addColorStop( 1, DARK_BLUE_COLOR );
    cylinderSide.mutate( { fill: sideFill, stroke: BRIGHT_BLUE_COLOR, lineWidth: 2 } );

    var crosshair = new Path( crosshairShape, { stroke: 'gray' } );
    angleIndicator.addChild( crosshair );

    var darkerCrosshair = new Path( darkerCrosshairShape, { stroke: 'black', lineWidth: 3 } );
    angleIndicator.addChild( darkerCrosshair );

    cannonBarrel.setRotation( -CANNON_ANGLE * Math.PI / 180 );

    angleIndicator.x = cannonX;
    angleIndicator.y = cannonY;

    // create the background
    var backgroundFill = new LinearGradient( 0, 0, 0, height ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
    this.mutate( { fill: backgroundFill } );
    this.setRectWidth( width );
    this.setRectHeight( height );
  }

  projectileMotion.register( 'LabIconNode', LabIconNode );

  return inherit( Rectangle, LabIconNode );
} );