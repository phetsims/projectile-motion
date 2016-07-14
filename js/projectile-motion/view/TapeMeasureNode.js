// Copyright 2016, University of Colorado Boulder

/**
 * Tape measure node. Base drags the entire tape measure, end drags just the end
 * Readout is to two decimal places
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
  var Vector2 = require( 'DOT/Vector2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/projectile-motion/ProjectileMotionConstants' );

  // constants
  var INITIAL_TAPE_MEASURE_LENGTH = 10;
  var TAPE_MEASURE_WIDTH = 0.1;
  var BASE_OF_TAPE_MEASURE_RADIUS = 0.6;
  var END_OF_TAPE_MEASURE_RADIUS = 0.3;
  var LABEL_Y_OFFSET = 30; // no model view transform here, just moving it so we can see the text 

  /**
   * @param {Particle} particle
   * @param {String|color} color
   * @constructor
   */
  function TapeMeasureNode( model, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode );

    thisNode.baseCenter = new Vector2(
      modelViewTransform.modelToViewX( ProjectileMotionConstants.INITIAL_TAPE_MEASURE_X ),
      modelViewTransform.modelToViewY( ProjectileMotionConstants.INITIAL_TAPE_MEASURE_Y )
    );

    thisNode.endCenter = new Vector2(
      modelViewTransform.modelToViewX( INITIAL_TAPE_MEASURE_LENGTH ),
      modelViewTransform.modelToViewY( ProjectileMotionConstants.INITIAL_TAPE_MEASURE_Y )
    );

    thisNode.baseOfTapeMeasure = new Circle( modelViewTransform.modelToViewDeltaX( BASE_OF_TAPE_MEASURE_RADIUS ), {
      center: thisNode.baseCenter,
      pickable: true,
      cursor: 'pointer',
      fill: 'rgba(0,0,0,0.6)'
    } );

    thisNode.endOfTapeMeasure = new Circle( modelViewTransform.modelToViewDeltaX( END_OF_TAPE_MEASURE_RADIUS ), {
      center: thisNode.endCenter,
      pickable: true,
      cursor: 'pointer',
      fill: 'rgba(0,0,0,0.6)'
    } );

    // draw tape line
    thisNode.tape = new Line(
      thisNode.baseCenter.x,
      thisNode.baseCenter.y,
      thisNode.endCenter.x,
      thisNode.endCenter.y, {
        stroke: 'rgba(0,0,0,0.8)',
        lineWidth: modelViewTransform.modelToViewDeltaX( TAPE_MEASURE_WIDTH )
      }
    );

    // auxiliary function that takes a length in view, converts it to meters as in models, rounds it 
    // to two decimal places, and adds ' m' to it
    // @private
    var lengthToLabel = function( length ) {
      return Math.round( modelViewTransform.viewToModelDeltaX( length ) * 100 ) / 100 + ' m';
    };

    // length of tape measure, for readout
    thisNode.length = lengthToLabel( thisNode.baseCenter.distance( thisNode.endCenter ) );
    thisNode.lengthLabel = new Text( thisNode.length, {
      font: ProjectileMotionConstants.LABEL_FONT,
      width: 10,
      x: thisNode.baseCenter.x,
      y: thisNode.baseCenter.y + LABEL_Y_OFFSET
    } );

    // reset the ruler location and length
    model.resetListenerProperty.link( function() {
      thisNode.baseCenter = new Vector2(
        modelViewTransform.modelToViewX( ProjectileMotionConstants.INITIAL_TAPE_MEASURE_X ),
        modelViewTransform.modelToViewY( ProjectileMotionConstants.INITIAL_TAPE_MEASURE_Y )
      );

      thisNode.endCenter = new Vector2(
        modelViewTransform.modelToViewX( INITIAL_TAPE_MEASURE_LENGTH ),
        modelViewTransform.modelToViewY( ProjectileMotionConstants.INITIAL_TAPE_MEASURE_Y )
      );

      // relocate the tape measure based on the change
      thisNode.baseOfTapeMeasure.center = thisNode.baseCenter;
      thisNode.endOfTapeMeasure.center = thisNode.endCenter;
      thisNode.tape.setPoint1( thisNode.baseCenter.x, thisNode.baseCenter.y );
      thisNode.tape.setPoint2( thisNode.endCenter.x, thisNode.endCenter.y );
      thisNode.lengthLabel.x = thisNode.baseCenter.x;
      thisNode.lengthLabel.y = thisNode.baseCenter.y + LABEL_Y_OFFSET;
      
      // update length readout
      thisNode.length = lengthToLabel( thisNode.baseCenter.distance( thisNode.endCenter ) );
      thisNode.lengthLabel.text = thisNode.length;
    } );

    // track where mouse and location of tape is when drag started
    var startPoint;
    var startBaseCenter;
    var startEndCenter;
    var mousePoint; // where mouse is currently

    // the base of the tape measure drags the entire thing
    thisNode.baseOfTapeMeasure.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = thisNode.baseOfTapeMeasure.globalToParentPoint( event.pointer.point );
        startBaseCenter = new Vector2( thisNode.baseCenter.x, thisNode.baseCenter.y );
        startEndCenter = new Vector2( thisNode.endCenter.x, thisNode.endCenter.y );
      },

      drag: function( event ) {
        // Convert to parent coordinates for dragging node, so the mouse stays at the right relative position, see #26
        mousePoint = thisNode.baseOfTapeMeasure.globalToParentPoint( event.pointer.point );

        var changeVector = mousePoint.minus( startPoint );
        thisNode.baseCenter = startBaseCenter.plus( changeVector );
        thisNode.endCenter = startEndCenter.plus( changeVector );

        // relocate the tape measure based on the change
        thisNode.baseOfTapeMeasure.center = thisNode.baseCenter;
        thisNode.endOfTapeMeasure.center = thisNode.endCenter;
        thisNode.tape.setPoint1( thisNode.baseCenter.x, thisNode.baseCenter.y );
        thisNode.tape.setPoint2( thisNode.endCenter.x, thisNode.endCenter.y );
        thisNode.lengthLabel.x = thisNode.baseCenter.x;
        thisNode.lengthLabel.y = thisNode.baseCenter.y + LABEL_Y_OFFSET;
      }
    } ) );

    // the end of the tape measure changes just the tape and the end
    thisNode.endOfTapeMeasure.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = thisNode.endOfTapeMeasure.globalToParentPoint( event.pointer.point );
        startEndCenter = new Vector2( thisNode.endCenter.x, thisNode.endCenter.y );
      },

      drag: function( event ) {
        // Convert to parent coordinates for dragging node, so the mouse stays at the right relative position, see #26
        mousePoint = thisNode.baseOfTapeMeasure.globalToParentPoint( event.pointer.point );

        var changeVector = mousePoint.minus( startPoint );
        thisNode.endCenter = startEndCenter.plus( changeVector );

        // relocate the tape measure based on the how the end is dragged
        thisNode.endOfTapeMeasure.center = thisNode.endCenter;
        thisNode.tape.setPoint2( thisNode.endCenter.x, thisNode.endCenter.y );

        // update length readout
        thisNode.length = lengthToLabel( thisNode.baseCenter.distance( thisNode.endCenter ) );
        thisNode.lengthLabel.text = thisNode.length;
      }
    } ) );

    thisNode.addChild( thisNode.tape );
    thisNode.addChild( thisNode.baseOfTapeMeasure );
    thisNode.addChild( thisNode.endOfTapeMeasure );
    thisNode.addChild( thisNode.lengthLabel );



  }

  projectileMotion.register( 'TapeMeasureNode', TapeMeasureNode );

  return inherit( Node, TapeMeasureNode );
} );

