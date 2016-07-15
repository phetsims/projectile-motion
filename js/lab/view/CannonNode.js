// Copyright 2016, University of Colorado Boulder

/**
 * Cannon view. Angle can change when user drags the cannon
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  // var Util = require( 'DOT/Util' );
  // var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/lab/ProjectileMotionConstants' );

  // constants
  var CANNON_LENGTH = 3;
  var CANNON_WIDTH = 0.7;


  /**
   * @param {Particle} particle
   * @param {String|color} color
   * @constructor
   */
  function CannonNode( model, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode );

    // auxiliary functions for setting the coordinates of the line
    thisNode.getX2 = function( angle ) {
      return modelViewTransform.modelToViewX( CANNON_LENGTH * Math.cos( angle * Math.PI / 180 ) + model.cannonX );
    };

    thisNode.getY2 = function( angle ) {
      return modelViewTransform.modelToViewY( CANNON_LENGTH * Math.sin( angle * Math.PI / 180 ) + model.cannonY );
    };

    // node drawn 
    thisNode.cannon = new Line(
      modelViewTransform.modelToViewX( model.cannonX ),
      modelViewTransform.modelToViewY( model.cannonY ),
      thisNode.getX2( model.angle ),
      thisNode.getY2( model.angle ), {
        stroke: 'rgba(0,0,0,0.4)',
        lineWidth: modelViewTransform.modelToViewDeltaX( CANNON_WIDTH )
      }
    );

    thisNode.addChild( thisNode.cannon );

    thisNode.adjustableHeightArea = new Circle( modelViewTransform.modelToViewDeltaX( CANNON_WIDTH ) * 1.5, {
      x: thisNode.cannon.x1,
      y: thisNode.cannon.y1,
      // fill: 'rgba(0,0,0,0.6)',
      pickable: true,
      cursor: 'pointer'
    } );

    thisNode.addChild( thisNode.adjustableHeightArea );

    thisNode.rotatableArea = new Circle( modelViewTransform.modelToViewDeltaX( CANNON_WIDTH ) * 1.5, {
      x: thisNode.getX2( model.angle ),
      y: thisNode.getY2( model.angle ),
      // fill: 'rgba(0,0,0,0.6)',
      pickable: true,
      cursor: 'pointer'
    } );

    thisNode.addChild( thisNode.rotatableArea );

    // watch for if the trajectory changes angle
    model.angleProperty.link( function( angle ) {
      thisNode.cannon.x2 = thisNode.getX2( model.angle );
      thisNode.cannon.y2 = thisNode.getY2( model.angle );

      // TODO: do we need to reset base
      thisNode.adjustableHeightArea.x = thisNode.cannon.x1;
      thisNode.adjustableHeightArea.y = thisNode.cannon.y1;
      thisNode.rotatableArea.x = thisNode.cannon.x2;
      thisNode.rotatableArea.y = thisNode.cannon.y2;
    } );

    model.cannonYProperty.link( function( cannonY ) {
      thisNode.cannon.y1 = modelViewTransform.modelToViewY( model.cannonY );
      thisNode.cannon.y2 = thisNode.getY2( model.angle );
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
        startAngle = model.angle; // degrees
      },

      drag: function( event ) {
        mousePoint = thisNode.rotatableArea.globalToParentPoint( event.pointer.point );
 
        //
        var startPointAngle = new Vector2( startPoint.x - thisNode.cannon.x1, startPoint.y - thisNode.cannon.y1 ).angle();
        var mousePointAngle = new Vector2( mousePoint.x - thisNode.cannon.x1, mousePoint.y - thisNode.cannon.y1 ).angle();
        var angleChange = startPointAngle - mousePointAngle; // radians

        var angleChangeInDegrees = angleChange * 180 / Math.PI; // degrees

        // constrain angle to range
        // var newAngle = startAngle + angleChangeInDegrees
        // model.angle = Util.clamp( startAngle + angleChangeInDegrees, ProjectileMotionConstants.ANGLE_RANGE.min, ProjectileMotionConstants.ANGLE_RANGE.max ); // degrees

        // update model angle
        model.angle = startAngle + angleChangeInDegrees;
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
        // debugger;
        mousePoint = thisNode.adjustableHeightArea.globalToParentPoint( event.pointer.point );

        //
        var heightChange = mousePoint.y - startPoint.y;

        // update model height
        model.cannonY = modelViewTransform.viewToModelY( startHeight + heightChange );
      }

    } ) );


  }

  projectileMotion.register( 'CannonNode', CannonNode );

  return inherit( Node, CannonNode );
} );

