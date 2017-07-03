// Copyright 2016, University of Colorado Boulder

/**
 * View for the tracer, which can be dragged to change location.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var timeString = require( 'string!PROJECTILE_MOTION/time' );
  var sString = require( 'string!PROJECTILE_MOTION/s');
  var rangeString = require( 'string!PROJECTILE_MOTION/range' );
  var heightString = require( 'string!PROJECTILE_MOTION/height');
  var mString = require( 'string!PROJECTILE_MOTION/m');

  // constants
  var CIRCLE_RADIUS = 15; // view units, will not be transformed
  var OPAQUE_BLUE = 'rgb( 41, 66, 150 )';
  var TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.2 )';
  var LABEL_OPTIONS = _.defaults( { fill: 'white' }, ProjectileMotionConstants.LABEL_TEXT_OPTIONS );
  var SPACING = 4;

  /**
   * @param {Score} tracer - model of the tracer tool
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {Object} [options]
   * @param {ScreenView} screenView
   * @constructor
   */
  function TracerNode( tracer, transformProperty, screenView, options ) {
    options = options || {};
    var self = this;

    this.isUserControlledProperty = new Property( false );

    this.spacing = SPACING;
    this.tracer = tracer;
    this.probeOrigin = Vector2.createFromPool( 0, 0 );

    // draggable node
    var rectangle = new Rectangle(
      0,
      0,
      150,
      95, {
        cornerRadius: 8,
        fill: OPAQUE_BLUE,
        stroke: 'gray',
        lineWidth: 4,
        opacity: 0.8,
        pickable: true,
        cursor: 'pointer'
      }
    );
    this.rectangle = rectangle;

    // @public Should be added as a listener by our parent when the time is right
    this.movableDragHandler = new MovableDragHandler( tracer.positionProperty, {
      modelViewTransform: transformProperty.get(),
      dragBounds: screenView.layoutBounds,
      startDrag: function( event ) {
        self.isUserControlledProperty.set( true );
      },
      endDrag: function( event ) {
        self.isUserControlledProperty.set( false );
      }
    } );

    // When dragging, move the tracer tool
    rectangle.addInputListener( this.movableDragHandler );

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

    var timeReadoutProperty = new Property( '-' );
    var rangeReadoutProperty = new Property( '-' );
    var heightReadoutProperty = new Property( '-' );

    var timeBox = this.createInformationBox( timeString, timeReadoutProperty );
    var rangeBox = this.createInformationBox( rangeString, rangeReadoutProperty );
    var heightBox = this.createInformationBox( heightString, heightReadoutProperty );

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
    tracer.pointProperty.link( function( point ) {
      if ( point !== null ) {
        timeReadoutProperty.set( StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( point.time, 2 ), sString ) );
        rangeReadoutProperty.set( StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( point.position.x, 2 ), mString ) );
        heightReadoutProperty.set( StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( point.position.y, 2 ), mString ) );
      } else {
        timeReadoutProperty.set( '-' );
        rangeReadoutProperty.set( '-' );
        heightReadoutProperty.set( '-' );
      }
    } );

    var updatePosition = function( position ) {
      self.probeOrigin.set( transformProperty.get().modelToViewPosition( position ) );

      crosshair.center = self.probeOrigin;
      circle.center = self.probeOrigin;
      crosshairMount.left = self.probeOrigin.x + CIRCLE_RADIUS;
      crosshairMount.centerY = self.probeOrigin.y;
      rectangle.left = crosshairMount.right;
      rectangle.centerY = self.probeOrigin.y;
      textBox.left = rectangle.left + 2 * SPACING;
      textBox.top = rectangle.top + 2 * SPACING;
    };

    transformProperty.link( function( transform ) {
      self.movableDragHandler.setModelViewTransform( transform );
      self.movableDragHandler.setDragBounds( transform.viewToModelBounds( screenView.layoutBounds ) );
      updatePosition( tracer.positionProperty.get() );
    } );

    // Listen for location changes, align locations, and update model.
    tracer.positionProperty.link( function( position ) {
      updatePosition( position );
      self.tracer.updateData();
    } );

    // Rendering order
    options.children = [
      crosshairMount,
      rectangle,
      circle,
      crosshair,
      textBox
    ];

    Node.call( this, options );

    // visibility
    tracer.isActiveProperty.link( function( active ) {
      self.visible = active;
    });
  }

  projectileMotion.register( 'TracerNode', TracerNode );

  return inherit( Node, TracerNode, {
    // @private auxiliary function to create label and number readout for information
    // @param {string} label
    // @param {Property} readoutProperty
    createInformationBox: function( labelString, readoutProperty ) {
      var labelText = new Text( labelString, LABEL_OPTIONS );
      // TODO: make sure scales are the same for all labels. 70 is the empirically determined width for label
      labelText.scale( Math.min( 1, 70 / labelText.width ) );

      // number
      var numberNode = new Text( readoutProperty.get(), ProjectileMotionConstants.LABEL_TEXT_OPTIONS );

      var backgroundWidth = 60;
      var backgroundNode = new Rectangle(
        0,
        0,
        backgroundWidth,
        numberNode.height + 2 * SPACING, {
          cornerRadius: 4,
          fill: 'white',
          stroke: 'black',
          lineWidth: 0.5
        }
      );

      // update text readout if information changes
      readoutProperty.link( function( readout ) {
        numberNode.setText( readout );
        numberNode.center = backgroundNode.center;
      } );

      var readoutParent = new Node( { children: [ backgroundNode, numberNode ] } );

      var spacing = this.rectangle.width - labelText.width - readoutParent.width - 4 * this.spacing;

      return new HBox( { spacing: spacing, children: [ labelText, readoutParent ] } );
    },

    // @public
    createIcon: function( options ) {
      options = options || {};
      var rectangle = new Rectangle(
        0,
        0,
        150,
        95, {
          cornerRadius: 8,
          fill: OPAQUE_BLUE,
          stroke: 'gray',
          lineWidth: 4,
          opacity: 0.8,
          pickable: true,
          cursor: 'pointer'
        }
      );

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
      var timeBox = this.createInformationBox( timeString, new Property( '-' ) );
      var rangeBox = this.createInformationBox( rangeString, new Property( '-' ) );
      var heightBox = this.createInformationBox( heightString, new Property( '-' ) );

      var textBox = new VBox( {
        align: 'left',
        spacing: SPACING,
        children: [
          timeBox,
          rangeBox,
          heightBox
        ]
      } );

      var probeOrigin = Vector2.createFromPool( 0, 0 );

      crosshair.center = probeOrigin;
      circle.center = probeOrigin;
      crosshairMount.left = probeOrigin.x + CIRCLE_RADIUS;
      crosshairMount.centerY = probeOrigin.y;
      rectangle.left = crosshairMount.right;
      rectangle.centerY = probeOrigin.y;
      textBox.left = rectangle.left + 2 * SPACING;
      textBox.top = rectangle.top + 2 * SPACING;

      probeOrigin.freeToPool();

      var tracerIcon = new Node( {
        children: [
          crosshairMount,
          rectangle,
          circle,
          crosshair,
          textBox
        ]
      } );

      return tracerIcon;
    }
  } );
} );

