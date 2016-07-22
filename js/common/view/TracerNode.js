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
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  // constants
  var CIRCLE_RADIUS = 10; // view units, will not be transformed


  /**
   * @param {Score} scoreModel - model of the tracer and scoring algorithms
   * @param {String|color} color
   * @constructor
   */
  function TracerNode( tracerModel, modelViewTransform, options ) {
    options = options || {};
    var thisNode = this;

    // Define properties in one place ----------------------------------------------------------------------------------
    thisNode.tracerModel = tracerModel;
    thisNode.probeOrigin = new Vector2( 0, 0 );

    // Declarations and listeners in one place -------------------------------------------------------------------------

    // draggable node
    var rectangle = new Rectangle(
      0,
      0,
      120,
      60, {
        fill: 'rgb( 100, 255, 170 )',
        pickable: true,
        cursor: 'pointer'
      }
    );

    // @private variables used for drag handler
    var startPoint;
    var startX;
    var startY;
    var mousePoint;

    // drag tracer to change position
    rectangle.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = rectangle.globalToParentPoint( event.pointer.point );
        startX = thisNode.probeOrigin.x; // view units
        startY = thisNode.probeOrigin.y; // view units
      },

      drag: function( event ) {
        mousePoint = rectangle.globalToParentPoint( event.pointer.point );

        // change in x, view units
        var change = mousePoint.minus( startPoint );

        tracerModel.x = modelViewTransform.viewToModelX( startX + change.x );
        tracerModel.y = modelViewTransform.viewToModelY( startY + change.y );
      }
    } ) );

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
    options.children = [
      rectangle,
      crosshair,
      circle,
      textBox
    ];

    Node.call( thisNode, options );

  }

  projectileMotion.register( 'TracerNode', TracerNode );

  return inherit( Node, TracerNode );
} );

