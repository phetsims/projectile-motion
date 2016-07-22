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
      120,
      60, {
        fill: 'rgba( 0, 255, 10, 0.4 )',
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
      thisNode.timeText.text = 'Time (s): ' + ( time ? time.toFixed( 2 ) : '' );
      thisNode.rangeText.text = 'Range (m): ' + ( range ? range.toFixed( 2 ) : '' );
      thisNode.heightText.text = 'Height (m): ' + ( height ? height.toFixed( 2 ) : '' );
    } );

    // Listen for location changes, align locations, and update model.
    Property.multilink( [ tracerModel.xProperty, tracerModel.yProperty ], function() {
      thisNode.tracer.rectX = modelViewTransform.modelToViewX( tracerModel.x );
      thisNode.tracer.rectY = modelViewTransform.modelToViewY( tracerModel.y );
      thisNode.textBox.top = thisNode.tracer.top + 10;
      thisNode.textBox.left = thisNode.tracer.left + 10;
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

<<<<<<< Updated upstream
    } ) );
=======
    // crosshair view
    var crosshairShape = new Shape()
      .moveTo( -CIRCLE_RADIUS, 0 )
      .lineTo( CIRCLE_RADIUS, 0 )
      .moveTo( 0, -CIRCLE_RADIUS )
      .lineTo( 0, CIRCLE_RADIUS );

    var crosshair = new Path( crosshairShape, { stroke: 'black' } );

    var circle = new Circle( CIRCLE_RADIUS, { lineWidth: 2, stroke: 'black' } );

    // information readouts
    var timeText = new Text( 'Time (s): ', ProjectileMotionConstants.LABEL_TEXT_OPTIONS );
    var rangeText = new Text( 'Range (m): ', ProjectileMotionConstants.LABEL_TEXT_OPTIONS );
    var heightText = new Text( 'Height (m): ', ProjectileMotionConstants.LABEL_TEXT_OPTIONS );

    var textBox = new VBox( {
      align: 'left',
      children: [
        timeText,
        rangeText,
        heightText
      ]
    } );

    // Listen for when time, range, and height change, and update the readouts.
    Property.multilink( [ tracerModel.timeProperty, tracerModel.rangeProperty, tracerModel.heightProperty ], function(
      time,
      range,
      height
    ) {
      timeText.text = 'Time (s): ' + ( time ? time.toFixed( 2 ) : '' );
      rangeText.text = 'Range (m): ' + ( range ? range.toFixed( 2 ) : '' );
      heightText.text = 'Height (m): ' + ( height ? height.toFixed( 2 ) : '' );
    } );

    // Listen for location changes, align locations, and update model.
    Property.multilink( [ tracerModel.xProperty, tracerModel.yProperty ], function() {
      thisNode.probeOrigin.x = modelViewTransform.modelToViewX( tracerModel.x );
      thisNode.probeOrigin.y = modelViewTransform.modelToViewY( tracerModel.y );

      crosshair.center = thisNode.probeOrigin;
      circle.center = thisNode.probeOrigin;
      rectangle.centerX = thisNode.probeOrigin.x;
      rectangle.top = thisNode.probeOrigin.y + CIRCLE_RADIUS;
      textBox.left = rectangle.left + 5;
      textBox.top = rectangle.top + 5;

      thisNode.tracerModel.updateData(); // TODO: investiage, this may be create a cycle
    } );

    // Rendering order
    Node.call( thisNode, {
      children: [
        rectangle,
        crosshair,
        circle,
        textBox
      ]
    } );
>>>>>>> Stashed changes

  }

  projectileMotion.register( 'TracerNode', TracerNode );

  return inherit( Node, TracerNode );
} );

