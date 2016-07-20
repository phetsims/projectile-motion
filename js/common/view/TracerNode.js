// Copyright 2016, University of Colorado Boulder

/**
 * tracer view. X position can change when user drags the cannon, y remains constant (on the ground)
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  // var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  // var Text = require( 'SCENERY/nodes/Text' );
  // var Vector2 = require( 'DOT/Vector2' );


  /**
   * @param {Score} scoreModel - model of the tracer and scoring algorithms
   * @param {String|color} color
   * @constructor
   */
  function TracerNode( tracerModel, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode );

    // draw tracer view
    thisNode.tracer = new Rectangle(
      0,
      0,
      50,
      20, {
        fill: 'rgba( 0, 0, 255, 0.4 )',
        pickable: true,
        cursor: 'pointer'
      }
    );

    // listen for location
    Property.multilink( [ tracerModel.xProperty, tracerModel.yProperty ], function() {
      thisNode.tracer.rectX = modelViewTransform.modelToViewX( tracerModel.x );
      thisNode.tracer.rectY = modelViewTransform.modelToViewY( tracerModel.y );
    } );

    thisNode.addChild( thisNode.tracer );

    var startPoint;
    var startX;
    var startY;
    var mousePoint;

    // drag tracer to change horizontal position
    thisNode.tracer.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = thisNode.tracer.globalToParentPoint( event.pointer.point );
        startX = thisNode.tracer.rectX; // view units
        startY = thisNode.tracer.rectY; // view units
      },

      drag: function( event ) {
        mousePoint = thisNode.tracer.globalToParentPoint( event.pointer.point );

        // change in x, view units
        var change = mousePoint.minus( startPoint );

        tracerModel.x = modelViewTransform.viewToModelX( startX + change.x );
        tracerModel.y = modelViewTransform.viewToModelY( startY + change.y );
      }

    } ) );

  }

  projectileMotion.register( 'TracerNode', TracerNode );

  return inherit( Node, TracerNode );
} );

