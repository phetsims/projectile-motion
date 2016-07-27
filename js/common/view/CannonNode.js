// Copyright 2002-2016, University of Colorado Boulder

/**
 * Cannon view. Angle can change when user drags the cannon tip. Height can change when user drags cannon base.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var CANNON_LENGTH = ProjectileMotionConstants.CANNON_LENGTH;
  var CANNON_WIDTH = ProjectileMotionConstants.CANNON_WIDTH;
  var ANGLE_RANGE = ProjectileMotionConstants.CANNON_ANGLE_RANGE;
  var HEIGHT_RANGE = ProjectileMotionConstants.CANNON_HEIGHT_RANGE;


  /**
   * @param {Property.<number>} heightProperty - height of the cannon
   * @param {Property.<number>} angleProperty - angle of the cannon, in degrees
   * @param {ModelViewTransform2} modelViewTransform - meters to units, inverted y
   * @constructor
   */
  function CannonNode( heightProperty, angleProperty, modelViewTransform ) {
    var thisNode = this;

    Node.call( thisNode );

    // @private auxiliary functions, closures for setting the second coordinates of the line
    // TODO: remove when you use rotate
    function getX2() {
      return modelViewTransform.modelToViewX( CANNON_LENGTH * Math.cos( angleProperty.value * Math.PI / 180 ) );
    }

    function getY2() {
      return modelViewTransform.modelToViewY( CANNON_LENGTH * Math.sin( angleProperty.value * Math.PI / 180 ) + heightProperty.value );
    }

    // TODO: use image and rotation, fix pickable area. See FaucetNode
    // draw cannon
    // thisNode.cannon = new Line(
    //   modelViewTransform.modelToViewX( 0 ),
    //   modelViewTransform.modelToViewY( heightProperty.value ),
    //   getX2(),
    //   getY2(), {
    //     stroke: 'rgb( 100, 100, 100 )',
    //     lineWidth: modelViewTransform.modelToViewDeltaX( CANNON_WIDTH )
    //   }
    // );

    thisNode.cannon = ProjectileMotionConstants.RANDOM_ICON_FACTORY.createIcon();
    thisNode.cannon.mutate( {
      x: modelViewTransform.modelToViewX( 0 ),
      y: modelViewTransform.modelToViewY( heightProperty.value ),
      pickable: true,
      cursor: 'pointer'
    } );
    var xScale = modelViewTransform.modelToViewDeltaX( CANNON_LENGTH ) / thisNode.cannon.width;
    var yScale = modelViewTransform.modelToViewDeltaY( CANNON_WIDTH ) / thisNode.cannon.height;
    thisNode.cannon.scale( new Vector2( xScale, yScale ) );
    thisNode.addChild( thisNode.cannon );

    // // add invisible node for dragging height
    // thisNode.adjustableHeightArea = new Circle( modelViewTransform.modelToViewDeltaX( CANNON_WIDTH ) * 1.5, {
    //   x: thisNode.cannon.x1,
    //   y: thisNode.cannon.y1,
    //   pickable: true,
    //   cursor: 'pointer'
    // } );
    // thisNode.addChild( thisNode.adjustableHeightArea );

    // // add invisible node for dragging angle
    // thisNode.rotatableArea = new Circle( modelViewTransform.modelToViewDeltaX( CANNON_WIDTH ) * 1.5, {
    //   x: getX2(),
    //   y: getY2(),
    //   pickable: true,
    //   cursor: 'pointer'
    // } );
    // thisNode.addChild( thisNode.rotatableArea );

    // watch for if angle changes
    angleProperty.link( function( angle ) {
      // thisNode.cannon.rotation = angle * Math.PI / 180;
      // thisNode.cannon.x2 = getX2();
      // thisNode.cannon.y2 = getY2();
      // thisNode.adjustableHeightArea.x = thisNode.cannon.x1;
      // thisNode.adjustableHeightArea.y = thisNode.cannon.y1;
      // thisNode.rotatableArea.x = thisNode.cannon.x2;
      // thisNode.rotatableArea.y = thisNode.cannon.y2;
    } );

    // watch for if height changes
    heightProperty.link( function( height ) {
      thisNode.cannon.y = modelViewTransform.modelToViewY( height );
      // thisNode.cannon.y1 = modelViewTransform.modelToViewY( height );
      // thisNode.cannon.y2 = getY2();
      // thisNode.adjustableHeightArea.y = thisNode.cannon.y1;
      // thisNode.rotatableArea.y = thisNode.cannon.y2;
    } );

    // // @private variables used for drag handlers
    // var startPoint;
    // var startAngle;
    // var mousePoint;
    // var startHeight;

    // // drag the tip of the cannon to change angle
    // thisNode.rotatableArea.addInputListener( new SimpleDragHandler( {
    //   start: function( event ) {
    //     startPoint = thisNode.rotatableArea.globalToParentPoint( event.pointer.point );
    //     startAngle = angleProperty.value; // degrees
    //   },

    //   drag: function( event ) {
    //     mousePoint = thisNode.rotatableArea.globalToParentPoint( event.pointer.point );

    //     // find vector angles between mouse drag start and current points, to the base of the cannon
    //     var startPointAngle = new Vector2( startPoint.x - thisNode.cannon.x1, startPoint.y - thisNode.cannon.y1 ).angle();
    //     var mousePointAngle = new Vector2( mousePoint.x - thisNode.cannon.x1, mousePoint.y - thisNode.cannon.y1 ).angle();
    //     var angleChange = startPointAngle - mousePointAngle; // radians
    //     var angleChangeInDegrees = angleChange * 180 / Math.PI; // degrees

    //     var unboundedNewAngle = startAngle + angleChangeInDegrees;

    //     // mouse dragged angle is within angle range
    //     if ( ANGLE_RANGE.contains( unboundedNewAngle ) ) {
    //       angleProperty.value = unboundedNewAngle;
    //     }
    //     // the current, unchanged, angle is closer to max than min
    //     else if ( ANGLE_RANGE.max + ANGLE_RANGE.min < 2 * angleProperty.get() ) {
    //       angleProperty.set( ANGLE_RANGE.max );
    //     }
    //     // the current, unchanged, angle is closer or same distance to min than max
    //     else {
    //       angleProperty.set( ANGLE_RANGE.min );
    //     }

    //   }

    // } ) );

    // // drag the base of the cannon to change height
    // thisNode.adjustableHeightArea.addInputListener( new SimpleDragHandler( {
    //   start: function( event ) {
    //     startPoint = thisNode.adjustableHeightArea.globalToParentPoint( event.pointer.point );
    //     startHeight = thisNode.cannon.y1; // view units
    //   },

    //   drag: function( event ) {
    //     mousePoint = thisNode.adjustableHeightArea.globalToParentPoint( event.pointer.point );
    //     var heightChange = mousePoint.y - startPoint.y;

    //     var unboundedNewHeight = modelViewTransform.viewToModelY( startHeight + heightChange );

    //     // mouse dragged height is within height range
    //     if ( HEIGHT_RANGE.contains( unboundedNewHeight ) ) {
    //       heightProperty.value = unboundedNewHeight;
    //     }
    //     // the current, unchanged, height is closer to max than min
    //     else if ( HEIGHT_RANGE.max + HEIGHT_RANGE.min < 2 * heightProperty.get() ) {
    //       heightProperty.set( HEIGHT_RANGE.max );
    //     }
    //     // the current, unchanged, height is closer or same distance to min than max
    //     else {
    //       heightProperty.set( HEIGHT_RANGE.min );
    //     }
    //   }
    // } ) );
  }

  projectileMotion.register( 'CannonNode', CannonNode );

  return inherit( Node, CannonNode );
} );

