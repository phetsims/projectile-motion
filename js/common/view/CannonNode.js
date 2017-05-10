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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

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
    var self = this;

    Node.call( self );

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
    self.cannon = new Line(
      modelViewTransform.modelToViewX( 0 ),
      modelViewTransform.modelToViewY( heightProperty.value ),
      getX2(),
      getY2(), {
        stroke: 'white',
        lineWidth: modelViewTransform.modelToViewDeltaX( CANNON_WIDTH )
      }
    );
    self.addChild( self.cannon );

    // add invisible node for dragging height
    self.adjustableHeightArea = new Circle( modelViewTransform.modelToViewDeltaX( CANNON_WIDTH ) * 1.5, {
      x: self.cannon.x1,
      y: self.cannon.y1,
      pickable: true,
      cursor: 'pointer'
    } );
    self.addChild( self.adjustableHeightArea );

    // add invisible node for dragging angle
    self.rotatableArea = new Circle( modelViewTransform.modelToViewDeltaX( CANNON_WIDTH ) * 1.5, {
      x: getX2(),
      y: getY2(),
      pickable: true,
      cursor: 'pointer'
    } );
    self.addChild( self.rotatableArea );

    // watch for if angle changes
    angleProperty.link( function() {
      self.cannon.x2 = getX2();
      self.cannon.y2 = getY2();
      self.adjustableHeightArea.x = self.cannon.x1;
      self.adjustableHeightArea.y = self.cannon.y1;
      self.rotatableArea.x = self.cannon.x2;
      self.rotatableArea.y = self.cannon.y2;
    } );

    // watch for if height changes
    heightProperty.link( function( height ) {
      self.cannon.y1 = modelViewTransform.modelToViewY( height );
      self.cannon.y2 = getY2();
      self.adjustableHeightArea.y = self.cannon.y1;
      self.rotatableArea.y = self.cannon.y2;
    } );

    // @private variables used for drag handlers
    var startPoint;
    var startAngle;
    var mousePoint;
    var startHeight;

    // drag the tip of the cannon to change angle
    self.rotatableArea.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = self.rotatableArea.globalToParentPoint( event.pointer.point );
        startAngle = angleProperty.value; // degrees
      },

      drag: function( event ) {
        mousePoint = self.rotatableArea.globalToParentPoint( event.pointer.point );

        // find vector angles between mouse drag start and current points, to the base of the cannon
        var startPointAngle = new Vector2( startPoint.x - self.cannon.x1, startPoint.y - self.cannon.y1 ).angle();
        var mousePointAngle = new Vector2( mousePoint.x - self.cannon.x1, mousePoint.y - self.cannon.y1 ).angle();
        var angleChange = startPointAngle - mousePointAngle; // radians
        var angleChangeInDegrees = angleChange * 180 / Math.PI; // degrees

        var unboundedNewAngle = startAngle + angleChangeInDegrees;

        // mouse dragged angle is within angle range
        if ( ANGLE_RANGE.contains( unboundedNewAngle ) ) {
          angleProperty.value = Util.roundSymmetric( unboundedNewAngle );
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
    self.adjustableHeightArea.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = self.adjustableHeightArea.globalToParentPoint( event.pointer.point );
        startHeight = self.cannon.y1; // view units
      },

      drag: function( event ) {
        mousePoint = self.adjustableHeightArea.globalToParentPoint( event.pointer.point );
        var heightChange = mousePoint.y - startPoint.y;

        var unboundedNewHeight = modelViewTransform.viewToModelY( startHeight + heightChange );

        // mouse dragged height is within height range
        if ( HEIGHT_RANGE.contains( unboundedNewHeight ) ) {
          heightProperty.value = Util.roundSymmetric( unboundedNewHeight );
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

