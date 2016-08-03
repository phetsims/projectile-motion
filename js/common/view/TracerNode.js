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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  // constants
  var CIRCLE_RADIUS = 15; // view units, will not be transformed
  var OPAQUE_BLUE = 'rgb( 41, 66, 150 )';
  var TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.2 )';
  var LABEL_OPTIONS = _.defaults( { fill: 'white' }, ProjectileMotionConstants.LABEL_TEXT_OPTIONS );
  var SPACING = 4;
  // var TRANSPARENT_BLUE = 'rgba( 0, 0, 255, 0.8 )';
  // var TRANSPARENT_GRAY = 'rgba( 100, 100, 100, 0.8 ';


  /**
   * @param {Score} scoreModel - model of the tracer and scoring algorithms
   * @param {String|color} color
   * @constructor
   */
  function TracerNode( tracerModel, modelViewTransform, options ) {
    options = options || {};
    var thisNode = this;

    thisNode.tracerModel = tracerModel;
    thisNode.probeOrigin = new Vector2( 0, 0 );

    // draggable node
    var rectangle = new Rectangle(
      0,
      0,
      150,
      95,
      8,
      8, {
        fill: OPAQUE_BLUE,
        stroke: 'gray',
        lineWidth: 4,
        opacity: 0.8,
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
    var circle = new Circle( CIRCLE_RADIUS, { lineWidth: 2, stroke: 'black', fill: TRANSPARENT_WHITE } );

    // Create the base of the crosshair
    var crosshairMount = new Rectangle( 0, 0, 0.4 * CIRCLE_RADIUS, 0.4 * CIRCLE_RADIUS, { fill: 'gray' } );

    // @private auxiliary function to create label and number readout for information
    // @param {string} label
    // @param {Property} readoutProperty
    function informationBox( label, readoutProperty ) {
      var labelText = new Text( label, LABEL_OPTIONS );
      // number
      var numberNode = new Text( readoutProperty.get(), ProjectileMotionConstants.LABEL_TEXT_OPTIONS );

      var backgroundWidth = 50;
      var backgroundNode = new Rectangle(
        0,
        0,
        backgroundWidth,
        numberNode.height + 2 * SPACING,
        4,
        4, {
          fill: 'white',
          stroke: 'black',
          lineWidth: 0.5
        }
      );

      // update text readout if information changes
      readoutProperty.link( function( value ) {
        numberNode.setText( value );
        numberNode.center = backgroundNode.center;
      } );
      
      var readoutParent = new Node( { children: [ backgroundNode, numberNode ] } );

      var spacing = rectangle.width - labelText.width - readoutParent.width - 4 * SPACING;

      return new HBox( { spacing: spacing, children: [ labelText, readoutParent ] } );
    }

    var timeReadoutProperty = new Property( '-' );
    var rangeReadoutProperty = new Property( '-' );
    var heightReadoutProperty = new Property( '-' );

    var timeBox = informationBox( 'Time (s)', timeReadoutProperty );
    var rangeBox = informationBox( 'Range (m)', rangeReadoutProperty );
    var heightBox = informationBox( 'Height (m)', heightReadoutProperty );

    var textBox = new VBox( {
      align: 'left',
      spacing: SPACING,
      children: [
        timeBox,
        rangeBox,
        heightBox
      ]
    } );

    // Listen for when time, range, and height change, and update the readouts.
    tracerModel.pointProperty.link( function( point ) {
      if ( point !== null ) {
        timeReadoutProperty.set( point.time.toFixed( 2 ) );
        rangeReadoutProperty.set( point.x.toFixed( 2 ) );
        heightReadoutProperty.set( point.y.toFixed( 2 ) );
      } else {
        timeReadoutProperty.set( '-' );
        rangeReadoutProperty.set( '-' );
        heightReadoutProperty.set( '-' );
      }
    } );

    // Listen for location changes, align locations, and update model.
    Property.multilink( [ tracerModel.xProperty, tracerModel.yProperty ], function() {
      thisNode.probeOrigin.x = modelViewTransform.modelToViewX( tracerModel.x );
      thisNode.probeOrigin.y = modelViewTransform.modelToViewY( tracerModel.y );

      crosshair.center = thisNode.probeOrigin;
      circle.center = thisNode.probeOrigin;
      crosshairMount.centerX = thisNode.probeOrigin.x;
      crosshairMount.top = thisNode.probeOrigin.y + CIRCLE_RADIUS;
      rectangle.centerX = thisNode.probeOrigin.x;
      rectangle.top = crosshairMount.bottom;
      textBox.left = rectangle.left + 2 * SPACING;
      textBox.top = rectangle.top + 2 * SPACING;

      thisNode.tracerModel.updateData(); // TODO: investiage, this may be create a cycle
    } );

    // Rendering order
    options.children = [
      crosshairMount,
      rectangle,
      circle,
      crosshair,
      textBox
    ];

    Node.call( thisNode, options );

  }

  projectileMotion.register( 'TracerNode', TracerNode );

  return inherit( Node, TracerNode );
} );

