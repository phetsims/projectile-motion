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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
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
  var CANNON_LENGTH = ProjectileMotionConstants.CANNON_LENGTH;
  var ANGLE_RANGE = ProjectileMotionConstants.CANNON_ANGLE_RANGE;
  var HEIGHT_RANGE = ProjectileMotionConstants.CANNON_HEIGHT_RANGE;
  var HEIGHT_LEADER_LINE_POSITION = -2;
  var CROSSHAIR_LENGTH = 120;
  var LABEL_OPTIONS = ProjectileMotionConstants.LABEL_TEXT_OPTIONS;
  var ADJUSTABLE_HEIGHT_AREA_RADIUS = 50;
  var ROTATABLE_AREA_RADIUS = 30;

  /**
   * @param {Property.<number>} heightProperty - height of the cannon
   * @param {Property.<number>} angleProperty - angle of the cannon, in degrees
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @constructor
   */
  function CannonNode( heightProperty, angleProperty, transformProperty ) {
    Node.call( this );

    // auxiliary functions, closures for getting the second coordinates of the line
    // TODO: remove when you use rotate
    function getX2() {
      return transformProperty.get().modelToViewX( CANNON_LENGTH * Math.cos( angleProperty.get() * Math.PI / 180 ) );
    }

    function getY2() {
      return transformProperty.get().modelToViewY( CANNON_LENGTH * Math.sin( angleProperty.get() * Math.PI / 180 ) + heightProperty.get() );
    }

    var cannon = new Node( { x: transformProperty.get().modelToViewX( 0 ) } );
    this.addChild( cannon );

    var cannonBarrel = new Node( { origin: cannon.orign } );
    cannon.addChild( cannonBarrel );

    var cannonBarrelBottom = new Image( cannonBarrelBottomImage, { right: 0, centerY: 0 } );
    cannonBarrel.addChild( cannonBarrelBottom );
    var cannonBarrelTop = new Image( cannonBarrelTopImage, { left: 0, centerY: 0 } );
    cannonBarrel.addChild( cannonBarrelTop );

    var cannonBaseBottom = new Image( cannonBaseBottomImage, { top: 0, centerX: 0 } );
    cannon.addChild( cannonBaseBottom );
    var cannonBaseTop = new Image( cannonBaseTopImage, { bottom: 0, centerX: 0 } );
    cannon.addChild( cannonBaseTop );

    cannon.setScaleMagnitude( transformProperty.get().modelToViewDeltaX( CANNON_LENGTH ) / cannonBarrelTop.width );

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
    this.addChild( heightLeaderLine );

    // draw the line caps for the height leader line

    var heightLeaderLineTopCap = new Line( -6, 0, 6, 0, {
        stroke: 'black',
        lineWidth: 2
    } );
    this.addChild( heightLeaderLineTopCap );
    
    var heightLeaderLineBottomCap = new Line( -6, 0, 6, 0, {
        stroke: 'black',
        lineWidth: 2
    } );
    heightLeaderLineBottomCap.x = heightLeaderLine.tipX;
    heightLeaderLineBottomCap.y = heightLeaderLine.tipY;
    this.addChild( heightLeaderLineBottomCap );

    // height readout
    var heightLabel = new Text( StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( heightProperty.get(), 2 ), mString ), LABEL_OPTIONS );
    heightLabel.centerX = heightLeaderLine.tipX;
    this.addChild( heightLabel );

    // angle indicator
    var angleIndicator = new Node();
    angleIndicator.x = cannon.x;
    this.addChild( angleIndicator );

    // crosshair view
    var crosshairShape = new Shape()
      .moveTo( -CROSSHAIR_LENGTH / 4, 0 )
      .lineTo( CROSSHAIR_LENGTH, 0 )
      .moveTo( 0, -CROSSHAIR_LENGTH )
      .lineTo( 0, CROSSHAIR_LENGTH );

    var crosshair = new Path( crosshairShape, { stroke: 'gray' } );
    angleIndicator.addChild( crosshair );

    var darkerCrosshairShape = new Shape()
      .moveTo( -CROSSHAIR_LENGTH / 9, 0 )
      .lineTo( CROSSHAIR_LENGTH / 9, 0 )
      .moveTo( 0, -CROSSHAIR_LENGTH / 9 )
      .lineTo( 0, CROSSHAIR_LENGTH / 9 );

    var darkerCrosshair = new Path( darkerCrosshairShape, { stroke: 'black', strokeWidth: 3 } );
    angleIndicator.addChild( darkerCrosshair );

    // view for the angle arc
    var angleArc = new Path( null, { stroke: 'gray' } );
    angleIndicator.addChild( angleArc );

    // angle readout
    var angleLabel = new Text( StringUtils.format( pattern0Value1UnitsString, Util.toFixedNumber( angleProperty.get(), 2 ), degreesSymbolString ), LABEL_OPTIONS );
    angleLabel.bottom = -5;
    angleLabel.left = CROSSHAIR_LENGTH * 2 / 3 + 10;
    angleIndicator.addChild( angleLabel );

    // add invisible node for dragging height
    var adjustableHeightArea = new Circle( ADJUSTABLE_HEIGHT_AREA_RADIUS, {
      x: cannon.x,
      y: cannon.y,
      pickable: true,
      cursor: 'pointer'
    } );
    this.addChild( adjustableHeightArea );

    // add invisible node for dragging angle
    var rotatableArea = new Circle( ROTATABLE_AREA_RADIUS, {
      x: getX2(),
      y: getY2(),
      pickable: true,
      cursor: 'pointer'
    } );
    this.addChild( rotatableArea );

    // watch for if angle changes
    angleProperty.link( function( angle ) {
      cannonBarrel.setRotation( -angle * Math.PI / 180 );
      var arcShape = angle > 0
        ? Shape.arc( 0, 0, CROSSHAIR_LENGTH * 2 / 3, 0, -angle * Math.PI / 180, true )
        : Shape.arc( 0, 0, CROSSHAIR_LENGTH * 2 / 3, 0, -angle * Math.PI / 180 );
      angleArc.setShape( arcShape );
      angleLabel.text = StringUtils.format( pattern0Value1UnitsString, Util.toFixedNumber( angleProperty.get(), 2 ), degreesSymbolString );
      adjustableHeightArea.x = cannon.x;
      adjustableHeightArea.y = cannon.y;
      rotatableArea.x = getX2();
      rotatableArea.y = getY2();
    } );

    var updateHeight = function( height ) {
      cannon.y = transformProperty.get().modelToViewY( height );
      heightLeaderLine.setTailAndTip( heightLeaderLine.tailX, heightLeaderLine.tailY, heightLeaderLine.tipX, cannon.y );
      heightLeaderLineTopCap.x = heightLeaderLine.tipX;
      heightLeaderLineTopCap.y = heightLeaderLine.tipY;
      heightLabel.text = StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( height, 2 ), mString );
      heightLabel.y = heightLeaderLine.tipY - 5;
      angleIndicator.y = transformProperty.get().modelToViewY( height );
      adjustableHeightArea.y = cannon.y;
      rotatableArea.y = getY2();
    };

    // watch for if height changes
    heightProperty.link( updateHeight );

    // update if transform changes
    transformProperty.link( function( transform ) {
      cannon.setScaleMagnitude( transformProperty.get().modelToViewDeltaX( CANNON_LENGTH ) / cannonBarrelTop.width );
      rotatableArea.x = getX2();
      rotatableArea.y = getY2();
      updateHeight( heightProperty.get() );
    } );

    // @private variables used for drag handlers
    var startPoint;
    var startAngle;
    var mousePoint;
    var startHeight;

    // drag the tip of the cannon to change angle
    rotatableArea.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = rotatableArea.globalToParentPoint( event.pointer.point );
        startAngle = angleProperty.get(); // degrees
      },

      drag: function( event ) {
        mousePoint = rotatableArea.globalToParentPoint( event.pointer.point );

        // find vector angles between mouse drag start and current points, to the base of the cannon
        var startPointAngle = new Vector2( startPoint.x - cannon.x, startPoint.y - cannon.y ).angle();
        var mousePointAngle = new Vector2( mousePoint.x - cannon.x, mousePoint.y - cannon.y ).angle();
        var angleChange = startPointAngle - mousePointAngle; // radians
        var angleChangeInDegrees = angleChange * 180 / Math.PI; // degrees

        var unboundedNewAngle = startAngle + angleChangeInDegrees;

        // mouse dragged angle is within angle range
        if ( ANGLE_RANGE.contains( unboundedNewAngle ) ) {
          angleProperty.set( Util.roundSymmetric( unboundedNewAngle ) );
        }
        // the current, unchanged, angle is closer to max than min
        else if ( ANGLE_RANGE.max + ANGLE_RANGE.min < 2 * angleProperty.get() ) {
          angleProperty.set( ANGLE_RANGE.max );
        }
        // the current, unchanged, angle is closer or same distance to min than max
        else {
          angleProperty.set( ANGLE_RANGE.min );
        }

      }

    } ) );

    // drag the base of the cannon to change height
    adjustableHeightArea.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = adjustableHeightArea.globalToParentPoint( event.pointer.point );
        startHeight = cannon.y; // view units
      },

      drag: function( event ) {
        mousePoint = adjustableHeightArea.globalToParentPoint( event.pointer.point );
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
      }
    } ) );
  }

  projectileMotion.register( 'CannonNode', CannonNode );

  return inherit( Node, CannonNode );
} );

