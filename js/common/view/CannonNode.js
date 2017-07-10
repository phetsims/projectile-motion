// Copyright 2002-2016, University of Colorado Boulder

/**
 * Cannon view.
 * Angle can change when user drags the cannon tip. Height can change when user drags cannon base.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Range = require( 'DOT/Range' );

  // image
  var cannonBaseBottomImage = require( 'image!PROJECTILE_MOTION/cannon_base_bottom.png' );
  var cannonBaseTopImage = require( 'image!PROJECTILE_MOTION/cannon_base_top.png' );
  var cannonBarrelBottomImage = require( 'image!PROJECTILE_MOTION/cannon_barrel_bottom.png' );
  var cannonBarrelTopImage = require( 'image!PROJECTILE_MOTION/cannon_barrel_top.png' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var pattern0Value1UnitsString = require( 'string!PROJECTILE_MOTION/pattern0Value1Units' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var degreesSymbolString = require( 'string!PROJECTILE_MOTION/degreesSymbol' );

  // constants
  var CANNON_LENGTH = 4;
  var ELLIPSE_WIDTH = 400; // empirically determined in view coordinates
  var ELLIPSE_HEIGHT = 50; // empirically determinedin view coordinates
  var ANGLE_RANGE = ProjectileMotionConstants.CANNON_ANGLE_RANGE;
  var HEIGHT_RANGE = ProjectileMotionConstants.CANNON_HEIGHT_RANGE;
  var HEIGHT_LEADER_LINE_POSITION = -2.6;
  var CROSSHAIR_LENGTH = 120;
  var LABEL_OPTIONS = ProjectileMotionConstants.LABEL_TEXT_OPTIONS;
  var BRIGHT_GRAY_COLOR = new Color( 230, 230, 230, 1 );
  var DARK_GRAY_COLOR = new Color( 103, 103, 103, 1 );
  var TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.6 )';
  var ANGLE_RANGE_MINS = [ 25, -5, -20, -40 ]; // angle range minimums, corresponding to height through their index

  /**
   * @param {Property.<number>} heightProperty - height of the cannon
   * @param {Property.<number>} angleProperty - angle of the cannon, in degrees
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {ScreenView} screenView
   * @constructor
   */
  function CannonNode( heightProperty, angleProperty, transformProperty, screenView ) {
    Node.call( this );

    var clippableNode = new Node( { x: transformProperty.get().modelToViewX( 0 ), y: transformProperty.get().modelToViewY( 0 ), cursor: 'pointer' } );

    // var cannon = new Node( { x: transformProperty.get().modelToViewX( 0 ) } );

    var ellipseShape = Shape.ellipse( 0, 0, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2 );
    var groundFill = new LinearGradient( -ELLIPSE_WIDTH / 2, 0, ELLIPSE_WIDTH / 2, 0 ).addColorStop( 0.0, 'gray' ).addColorStop( 0.3, 'white' ).addColorStop( 1, 'gray' );
    var groundCircle = new Path( ellipseShape, { x: clippableNode.x, y: transformProperty.get().modelToViewY( 0 ), fill: groundFill, stroke: BRIGHT_GRAY_COLOR } );

    var sideFill = new LinearGradient( -ELLIPSE_WIDTH / 2, 0, ELLIPSE_WIDTH / 2, 0 ).addColorStop( 0.0, DARK_GRAY_COLOR ).addColorStop( 0.3, BRIGHT_GRAY_COLOR ).addColorStop( 1, DARK_GRAY_COLOR );
    var cylinderSide = new Path( null, { fill: sideFill, stroke: BRIGHT_GRAY_COLOR } );
    clippableNode.addChild( cylinderSide );

    var cylinderTop = new Path( ellipseShape, { fill: DARK_GRAY_COLOR, stroke: BRIGHT_GRAY_COLOR } );
    clippableNode.addChild( cylinderTop );

    var cannonBarrel = new Node();
    clippableNode.addChild( cannonBarrel );

    var cannonBarrelBottom = new Image( cannonBarrelBottomImage, { right: 0, centerY: 0 } );
    cannonBarrel.addChild( cannonBarrelBottom );
    var cannonBarrelTop = new Image( cannonBarrelTopImage, { left: 0, centerY: 0 } );
    cannonBarrel.addChild( cannonBarrelTop );

    var cannonBase = new Node();
    clippableNode.addChild( cannonBase );

    var cannonBaseBottom = new Image( cannonBaseBottomImage, { top: 0, centerX: 0 } );
    cannonBase.addChild( cannonBaseBottom );
    var cannonBaseTop = new Image( cannonBaseTopImage, { bottom: 0, centerX: 0 } );
    cannonBase.addChild( cannonBaseTop );

    clippableNode.setScaleMagnitude( transformProperty.get().modelToViewDeltaX( CANNON_LENGTH ) / cannonBarrelTop.width );

    // add line for indicating the height
    var heightLeaderLine = new ArrowNode(
      transformProperty.get().modelToViewX( HEIGHT_LEADER_LINE_POSITION ),
      transformProperty.get().modelToViewY( 0 ),
      transformProperty.get().modelToViewX( HEIGHT_LEADER_LINE_POSITION ),
      transformProperty.get().modelToViewY( heightProperty.get() ), {
        stroke: 'black',
        headHeight: 5,
        headWidth: 5,
        lineDash: [ 5, 5 ],
        tailWidth: 0,
        doubleHead: true
      }
    );

    // draw the line caps for the height leader line

    var heightLeaderLineTopCap = new Line( -6, 0, 6, 0, {
        stroke: 'black',
        lineWidth: 2
    } );
    
    var heightLeaderLineBottomCap = new Line( -6, 0, 6, 0, {
        stroke: 'black',
        lineWidth: 2
    } );
    heightLeaderLineBottomCap.x = heightLeaderLine.tipX;
    heightLeaderLineBottomCap.y = heightLeaderLine.tipY;

    // height readout
    var heightLabelBackground = new Rectangle( 0, 0, 0, 0, { fill: TRANSPARENT_WHITE } );
    var heightLabelOptions = _.extend( {
      pickable: true,
      cursor: 'pointer',
      maxWidth: 40 // empirically determined
    }, LABEL_OPTIONS );
    var heightLabel = new Text( StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( heightProperty.get(), 2 ), mString ), heightLabelOptions );
    heightLabel.setMouseArea( heightLabel.bounds.dilatedXY( 5, 2 ) );
    heightLabel.setTouchArea( heightLabel.bounds.dilatedXY( 6, 4 ) );
    heightLabel.centerX = heightLeaderLine.tipX;

    // angle indicator
    var angleIndicator = new Node();
    angleIndicator.x = clippableNode.x;

    // crosshair view
    var crosshairShape = new Shape()
      .moveTo( -CROSSHAIR_LENGTH / 4, 0 )
      .lineTo( CROSSHAIR_LENGTH, 0 )
      .moveTo( 0, -CROSSHAIR_LENGTH )
      .lineTo( 0, CROSSHAIR_LENGTH );

    var crosshair = new Path( crosshairShape, { stroke: 'gray' } );
    angleIndicator.addChild( crosshair );

    var darkerCrosshairShape = new Shape()
      .moveTo( -CROSSHAIR_LENGTH / 15, 0 )
      .lineTo( CROSSHAIR_LENGTH / 15, 0 )
      .moveTo( 0, -CROSSHAIR_LENGTH / 15 )
      .lineTo( 0, CROSSHAIR_LENGTH / 15 );

    var darkerCrosshair = new Path( darkerCrosshairShape, { stroke: 'black', lineWidth: 3 } );
    angleIndicator.addChild( darkerCrosshair );

    // view for the angle arc
    var angleArc = new Path( null, { stroke: 'gray' } );
    angleIndicator.addChild( angleArc );

    // angle readout
    var angleLabelBackground = new Rectangle( 0, 0, 0, 0, { fill: TRANSPARENT_WHITE } );
    angleIndicator.addChild( angleLabelBackground );
    var angleLabel = new Text( StringUtils.format( pattern0Value1UnitsString, Util.toFixedNumber( angleProperty.get(), 2 ), degreesSymbolString ), LABEL_OPTIONS );
    angleLabel.bottom = -5;
    angleLabel.left = CROSSHAIR_LENGTH * 2 / 3 + 10;
    angleIndicator.addChild( angleLabel );

    // rendering order
    this.setChildren( [
      groundCircle,
      // cylinderSide,
      // cylinderTop,
      // cannon,
      clippableNode,
      heightLeaderLine,
      heightLeaderLineTopCap,
      heightLeaderLineBottomCap,
      heightLabelBackground,
      heightLabel,
      angleIndicator//,
    ] );

    // watch for if angle changes
    angleProperty.link( function( angle ) {
      cannonBarrel.setRotation( -angle * Math.PI / 180 );
      var arcShape = angle > 0
        ? Shape.arc( 0, 0, CROSSHAIR_LENGTH * 2 / 3, 0, -angle * Math.PI / 180, true )
        : Shape.arc( 0, 0, CROSSHAIR_LENGTH * 2 / 3, 0, -angle * Math.PI / 180 );
      angleArc.setShape( arcShape );
      angleLabel.text = StringUtils.format( pattern0Value1UnitsString, Util.toFixedNumber( angleProperty.get(), 2 ), degreesSymbolString );
      angleLabelBackground.setRectWidth( angleLabel.width + 2 );
      angleLabelBackground.setRectHeight( angleLabel.height );
      angleLabelBackground.center = angleLabel.center;
    } );

    var scaleMagnitude = 1;

    var updateHeight = function( height ) {
      var viewHeightPoint = Vector2.createFromPool( 0, transformProperty.get().modelToViewY( height ) );
      var heightInClipCoordinates = clippableNode.globalToLocalPoint( screenView.localToGlobalPoint( viewHeightPoint ) ).y;
      viewHeightPoint.freeToPool();
      cannonBarrel.y = heightInClipCoordinates;
      cannonBase.y = heightInClipCoordinates;
      cylinderTop.y = cannonBase.bottom - ELLIPSE_HEIGHT / 4;

      var sideShape = new Shape();
      sideShape.moveTo( -ELLIPSE_WIDTH / 2, 0 )
      .lineTo( -ELLIPSE_WIDTH / 2, cylinderTop.y )
      .ellipticalArc( 0, cylinderTop.y, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2, 0, Math.PI, 0, true )
      .lineTo( ELLIPSE_WIDTH / 2, 0 )
      .ellipticalArc( 0, 0, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2, 0, 0, Math.PI, false )
      .close();
      cylinderSide.setShape( sideShape );

      var clipArea = new Shape();
      clipArea.moveTo( -ELLIPSE_WIDTH / 2, 0 )
      .lineTo( -ELLIPSE_WIDTH / 2, -ELLIPSE_WIDTH * 50 ) // high enough to include how high the cannon could be
      .lineTo( ELLIPSE_WIDTH * 2, -ELLIPSE_WIDTH * 50 ) // high enough to include how high the cannon could be
      .lineTo( ELLIPSE_WIDTH * 2, 0 )
      .lineTo( ELLIPSE_WIDTH / 2, 0 )
      .ellipticalArc( 0, 0, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2, 0, 0, Math.PI, false )
      .close();
      clippableNode.setClipArea( clipArea );

      heightLeaderLine.setTailAndTip( heightLeaderLine.tailX, heightLeaderLine.tailY, heightLeaderLine.tipX, transformProperty.get().modelToViewY( height ) );
      heightLeaderLineTopCap.x = heightLeaderLine.tipX;
      heightLeaderLineTopCap.y = heightLeaderLine.tipY;
      heightLabel.text = StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( height, 2 ), mString );
      heightLabel.centerX = heightLeaderLine.tipX;
      heightLabel.y = heightLeaderLine.tipY - 5;
      heightLabelBackground.setRectWidth( heightLabel.width + 2 );
      heightLabelBackground.setRectHeight( heightLabel.height );
      heightLabelBackground.center = heightLabel.center;

      angleIndicator.y = transformProperty.get().modelToViewY( height );
    };

    // watch for if height changes
    heightProperty.link( function( height ) {
      updateHeight( height );
      if ( height < 4 && angleProperty.get() < ANGLE_RANGE_MINS[ height ] ) {
        angleProperty.set( ANGLE_RANGE_MINS[ height ] );
      }
    } );

    // update if transform changes
    transformProperty.link( function( transform ) {
      scaleMagnitude = transformProperty.get().modelToViewDeltaX( CANNON_LENGTH ) / cannonBarrelTop.width;
      clippableNode.setScaleMagnitude( scaleMagnitude );
      // cannon.setScaleMagnitude( scaleMagnitude );
      groundCircle.setScaleMagnitude( scaleMagnitude );
      // cylinderTop.setScaleMagnitude( scaleMagnitude );
      updateHeight( heightProperty.get() );
    } );

    // @private variables used for drag handlers
    var startPoint;
    var startAngle;
    var mousePoint;
    var startHeight;

    // drag the tip of the cannon to change angle
    cannonBarrelTop.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = screenView.globalToLocalPoint( event.pointer.point );
        startAngle = angleProperty.get(); // degrees
      },

      drag: function( event ) {
        mousePoint = screenView.globalToLocalPoint( event.pointer.point );

        // find vector angles between mouse drag start and current points, to the base of the cannon
        var startPointAngle = Vector2.createFromPool( startPoint.x - clippableNode.x, startPoint.y - transformProperty.get().modelToViewY( heightProperty.get() ) ).angle();
        var mousePointAngle = Vector2.createFromPool( mousePoint.x - clippableNode.x, mousePoint.y - transformProperty.get().modelToViewY( heightProperty.get() ) ).angle();
        var angleChange = startPointAngle - mousePointAngle; // radians
        var angleChangeInDegrees = angleChange * 180 / Math.PI; // degrees

        var unboundedNewAngle = startAngle + angleChangeInDegrees;

        var angleRange = heightProperty.get() < 4 ? new Range( ANGLE_RANGE_MINS[ heightProperty.get() ], 90 ) : ANGLE_RANGE;

        // mouse dragged angle is within angle range
        if ( angleRange.contains( unboundedNewAngle ) ) {
          angleProperty.set( Util.roundSymmetric( unboundedNewAngle / 5 ) * 5 );
        }
        // the current, unchanged, angle is closer to max than min
        else if ( angleRange.max + angleRange.min < 2 * angleProperty.get() ) {
          angleProperty.set( angleRange.max );
        }
        // the current, unchanged, angle is closer or same distance to min than max
        else {
          angleProperty.set( angleRange.min );
        }

      }

    } ) );

    var heightDragHandler = new SimpleDragHandler( {
      start: function( event ) {
        startPoint = screenView.globalToLocalPoint( event.pointer.point );
        startHeight = transformProperty.get().modelToViewY( heightProperty.get() ); // view units
      },

      drag: function( event ) {
        mousePoint = screenView.globalToLocalPoint( event.pointer.point );
        var heightChange = mousePoint.y - startPoint.y;

        var unboundedNewHeight = transformProperty.get().viewToModelY( startHeight + heightChange );

        // mouse dragged height is within height range
        if ( HEIGHT_RANGE.contains( unboundedNewHeight ) ) {
          heightProperty.set( Util.roundSymmetric( unboundedNewHeight ) );
        }
        // the current, unchanged, height is closer to max than min
        else if ( HEIGHT_RANGE.max + HEIGHT_RANGE.min < 2 * heightProperty.get() ) {
          heightProperty.set( HEIGHT_RANGE.max );
        }
        // the current, unchanged, height is closer or same distance to min than max
        else {
          heightProperty.set( HEIGHT_RANGE.min );
        }

        // constrain within visible bounds, but this allows for decimal heights and overrides the roundsymmetric above
        // heightProperty.set( transformProperty.get().viewToModelY( Util.clamp( transformProperty.get().modelToViewY( heightProperty.get() ), screenView.layoutBounds.minY, screenView.layoutBounds.maxY ) ) );
      }
    } );

    // drag the base of the cannon to change height
    cannonBase.addInputListener( heightDragHandler );
    cylinderSide.addInputListener( heightDragHandler );
    cylinderTop.addInputListener( heightDragHandler );
    cannonBarrelBottom.addInputListener( heightDragHandler );
    heightLabel.addInputListener( heightDragHandler );

  }

  projectileMotion.register( 'CannonNode', CannonNode );

  return inherit( Node, CannonNode );
} );

