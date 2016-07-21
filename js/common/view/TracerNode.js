// Copyright 2016, University of Colorado Boulder

/**
 * View for the tracer, which can be dragged to change location.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  // var Vector2 = require( 'DOT/Vector2' );


  /**
   * @param {Score} scoreModel - model of the tracer and scoring algorithms
   * @param {String|color} color
   * @constructor
   */
  function TracerNode( tracerModel, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode );

    thisNode.tracerModel = tracerModel;

    // add view for tracer
    thisNode.tracer = new Rectangle(
      0,
      0,
      100,
      60, {
        fill: 'rgba( 0, 0, 255, 0.4 )',
        pickable: true,
        cursor: 'pointer'
      }
    );
    thisNode.addChild( thisNode.tracer );

    // text readouts
    thisNode.textBox = new VBox( { align: 'left' } );
    thisNode.addChild( thisNode.textBox );

    thisNode.timeText = new Text( 'Time (s): ', ProjectileMotionConstants.TRACER_TEXT_OPTIONS );
    thisNode.rangeText = new Text( 'Range (m): ', ProjectileMotionConstants.TRACER_TEXT_OPTIONS );
    thisNode.heightText = new Text( 'Height (m): ', ProjectileMotionConstants.TRACER_TEXT_OPTIONS );
    thisNode.textBox.setChildren( [
      thisNode.timeText,
      thisNode.rangeText,
      thisNode.heightText
    ] );

    // Listen for when time, range, and height change, and update the readouts.
    Property.multilink( [ tracerModel.timeProperty, tracerModel.rangeProperty, tracerModel.heightProperty ], function(
      time,
      range,
      height
    ) {
      thisNode.timeText.text = 'Time (s) ' + ( time ? time.toFixed( 2 ) : '' );
      thisNode.rangeText.text = 'Range (m) ' + ( range ? range.toFixed( 2 ) : '' );
      thisNode.heightText.text = 'Height (m) ' + ( height ? height.toFixed( 2 ) : '' );
    } );

    // Listen for location changes, align locations, and update model.
    Property.multilink( [ tracerModel.xProperty, tracerModel.yProperty ], function() {
      thisNode.tracer.rectX = modelViewTransform.modelToViewX( tracerModel.x );
      thisNode.tracer.rectY = modelViewTransform.modelToViewY( tracerModel.y );
      thisNode.textBox.top = thisNode.tracer.top;
      thisNode.textBox.left = thisNode.tracer.left;
      thisNode.tracerModel.updateData();
    } );

    // @private variables used for drag handler
    var startPoint;
    var startX;
    var startY;
    var mousePoint;

    // drag tracer to change position
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

