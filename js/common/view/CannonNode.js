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


  /**
   * @param {Property.<number>} heightProperty - height of the cannon
   * @param {Property.<number>} angleProperty - angle of the cannon, in degrees
   * @param {ModelViewTransform2} modelViewTransform - meters to units, inverted y
   * @constructor
   */
  function CannonNode( heightProperty, angleProperty, modelViewTransform ) {
    var thisNode = this;

    Node.call( thisNode );

    // auxiliary functions for setting the second coordinates of the line
    // TODO: move to inherit
    thisNode.getX2 = function() {
      return modelViewTransform.modelToViewX( CANNON_LENGTH * Math.cos( angleProperty.value * Math.PI / 180 ) );
    };
    thisNode.getY2 = function() {
      return modelViewTransform.modelToViewY( CANNON_LENGTH * Math.sin( angleProperty.value * Math.PI / 180 ) + heightProperty.value );
    };

    // draw cannon
    thisNode.cannon = new Line(
      modelViewTransform.modelToViewX( 0 ),
      modelViewTransform.modelToViewY( heightProperty.value ),
      thisNode.getX2(),
      thisNode.getY2(), {
        stroke: 'rgba( 0, 0, 0, 0.4 )',
        lineWidth: modelViewTransform.modelToViewDeltaX( CANNON_WIDTH )
      }
    );
    thisNode.addChild( thisNode.cannon );

    // add invisible node for dragging height
    thisNode.adjustableHeightArea = new Circle( modelViewTransform.modelToViewDeltaX( CANNON_WIDTH ) * 1.5, {
      x: thisNode.cannon.x1,
      y: thisNode.cannon.y1,
      pickable: true,
      cursor: 'pointer'
    } );
    thisNode.addChild( thisNode.adjustableHeightArea );

    // add invisible node for dragging angle
    thisNode.rotatableArea = new Circle( modelViewTransform.modelToViewDeltaX( CANNON_WIDTH ) * 1.5, {
      x: thisNode.getX2(),
      y: thisNode.getY2(),
      pickable: true,
      cursor: 'pointer'
    } );
    thisNode.addChild( thisNode.rotatableArea );

    // watch for if angle changes
    angleProperty.link( function() {
      thisNode.cannon.x2 = thisNode.getX2();
      thisNode.cannon.y2 = thisNode.getY2();
      thisNode.adjustableHeightArea.x = thisNode.cannon.x1;
      thisNode.adjustableHeightArea.y = thisNode.cannon.y1;
      thisNode.rotatableArea.x = thisNode.cannon.x2;
      thisNode.rotatableArea.y = thisNode.cannon.y2;
    } );

    // watch for if height changes
    heightProperty.link( function( height ) {
      thisNode.cannon.y1 = modelViewTransform.modelToViewY( height );
      thisNode.cannon.y2 = thisNode.getY2();
      thisNode.adjustableHeightArea.y = thisNode.cannon.y1;
      thisNode.rotatableArea.y = thisNode.cannon.y2;
    } );

    var startPoint;
    var startAngle;
    var mousePoint;

    // drag the tip of the cannon to change angle
    thisNode.rotatableArea.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = thisNode.rotatableArea.globalToParentPoint( event.pointer.point );
        startAngle = angleProperty.value; // degrees
      },

      drag: function( event ) {
        mousePoint = thisNode.rotatableArea.globalToParentPoint( event.pointer.point );

        // find vector angles between mouse drag start and current points, to the base of the cannon
        var startPointAngle = new Vector2( startPoint.x - thisNode.cannon.x1, startPoint.y - thisNode.cannon.y1 ).angle();
        var mousePointAngle = new Vector2( mousePoint.x - thisNode.cannon.x1, mousePoint.y - thisNode.cannon.y1 ).angle();
        var angleChange = startPointAngle - mousePointAngle; // radians

        var angleChangeInDegrees = angleChange * 180 / Math.PI; // degrees

        ///TODO: constrain angle to range

        // update model angle
        angleProperty.value = startAngle + angleChangeInDegrees;
      }

    } ) );

    var startHeight;

    // drag the base of the cannon to change height
    thisNode.adjustableHeightArea.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = thisNode.adjustableHeightArea.globalToParentPoint( event.pointer.point );
        startHeight = thisNode.cannon.y1; // view units
      },

      drag: function( event ) {
        mousePoint = thisNode.adjustableHeightArea.globalToParentPoint( event.pointer.point );

        var heightChange = mousePoint.y - startPoint.y;

        // update model height
        heightProperty.value = modelViewTransform.viewToModelY( startHeight + heightChange );
      }

    } ) );


  }

  projectileMotion.register( 'CannonNode', CannonNode );

  return inherit( Node, CannonNode );
} );

