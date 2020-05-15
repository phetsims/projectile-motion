// Copyright 2016-2020, University of Colorado Boulder

/**
 * View for the dataProbe, which can be dragged to change position.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectileMotionStrings from '../../projectileMotionStrings.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';

const heightString = projectileMotionStrings.height;
const mString = projectileMotionStrings.m;
const pattern0Value1UnitsWithSpaceString = projectileMotionStrings.pattern0Value1UnitsWithSpace;
const rangeString = projectileMotionStrings.range;
const sString = projectileMotionStrings.s;
const timeString = projectileMotionStrings.time;
const noValueString = MathSymbols.NO_VALUE;

// constants
const CIRCLE_AROUND_CROSSHAIR_RADIUS = 15; // view units, will not be transformed
const OPAQUE_BLUE = 'rgb( 41, 66, 150 )';
const TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.2 )';
const SPACING = 4; // {number} x and y spacing and margins
const TIME_PER_MAJOR_DOT = ProjectileMotionConstants.TIME_PER_MAJOR_DOT;
const LABEL_OPTIONS = merge( {}, ProjectileMotionConstants.LABEL_TEXT_OPTIONS, { fill: 'white' } );
const SMALL_HALO_RADIUS = ProjectileMotionConstants.SMALL_DOT_RADIUS * 5;
const LARGE_HALO_RADIUS = ProjectileMotionConstants.LARGE_DOT_RADIUS * 5;
const YELLOW_HALO_COLOR = 'rgba( 255, 255, 0, 0.8 )';
const YELLOW_HALO_EDGE_COLOR = 'rgba( 255, 255, 0, 0 )';
const YELLOW_HALO_FILL_SMALL = new RadialGradient( 0, 0, 0, 0, 0, SMALL_HALO_RADIUS )
  .addColorStop( 0, 'black' )
  .addColorStop( 0.2, 'black' )
  .addColorStop( 0.2, YELLOW_HALO_COLOR )
  .addColorStop( 0.4, YELLOW_HALO_COLOR )
  .addColorStop( 1, YELLOW_HALO_EDGE_COLOR );
const YELLOW_HALO_FILL_LARGE = new RadialGradient( 0, 0, 0, 0, 0, LARGE_HALO_RADIUS )
  .addColorStop( 0, 'black' )
  .addColorStop( 0.2, 'black' )
  .addColorStop( 0.2, YELLOW_HALO_COLOR )
  .addColorStop( 0.4, YELLOW_HALO_COLOR )
  .addColorStop( 1, YELLOW_HALO_EDGE_COLOR );
const GREEN_HALO_COLOR = 'rgba( 50, 255, 50, 0.8 )';
const GREEN_HALO_EDGE_COLOR = 'rgba( 50, 255, 50, 0 )';
const GREEN_HALO_FILL = new RadialGradient( 0, 0, 0, 0, 0, SMALL_HALO_RADIUS )
  .addColorStop( 0, 'black' )
  .addColorStop( 0.2, 'black' )
  .addColorStop( 0.2, GREEN_HALO_COLOR )
  .addColorStop( 0.4, GREEN_HALO_COLOR )
  .addColorStop( 1, GREEN_HALO_EDGE_COLOR );

const DATA_PROBE_CONTENT_WIDTH = 155;
const RIGHT_SIDE_PADDING = 6;
const READOUT_X_MARGIN = ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS.readoutXMargin;

/**
 * @param {Score} dataProbe - model of the dataProbe tool
 * @param {Property.<ModelViewTransform2>} transformProperty
 * @param {Object} [options]
 * @param {ScreenView} screenView
 * @constructor
 */
function DataProbeNode( dataProbe, transformProperty, screenView, options ) {
  const self = this;

  options = merge( {
    cursor: 'pointer',
    tandem: Tandem.REQUIRED
  }, options );

  // @public is this being handled by user?
  this.isUserControlledProperty = new BooleanProperty( false );

  // @private
  this.dataProbe = dataProbe; // model
  this.probeOrigin = Vector2.createFromPool( 0, 0 ); // where the crosshairs cross

  // draggable node
  const rectangle = new Rectangle(
    0,
    0,
    DATA_PROBE_CONTENT_WIDTH + RIGHT_SIDE_PADDING,
    95, {
      cornerRadius: 8,
      fill: OPAQUE_BLUE,
      stroke: 'gray',
      lineWidth: 4,
      opacity: 0.8
    }
  );

  // @private
  this.rectangle = rectangle;

  rectangle.setMouseArea( rectangle.bounds.dilatedXY( 10, 2 ) );
  rectangle.setTouchArea( rectangle.bounds.dilatedXY( 15, 6 ) );

  // shift the dataProbe drag bounds so that it can only be dragged until the center reaches the left or right side
  // of the screen
  const dragBoundsShift = -DATA_PROBE_CONTENT_WIDTH / 2 + RIGHT_SIDE_PADDING;

  // crosshair view
  const crosshairShape = new Shape()
    .moveTo( -CIRCLE_AROUND_CROSSHAIR_RADIUS, 0 )
    .lineTo( CIRCLE_AROUND_CROSSHAIR_RADIUS, 0 )
    .moveTo( 0, -CIRCLE_AROUND_CROSSHAIR_RADIUS )
    .lineTo( 0, CIRCLE_AROUND_CROSSHAIR_RADIUS );

  const crosshair = new Path( crosshairShape, { stroke: 'black' } );
  const circle = new Circle( CIRCLE_AROUND_CROSSHAIR_RADIUS, {
    lineWidth: 2,
    stroke: 'black',
    fill: TRANSPARENT_WHITE
  } );

  // Create the base of the crosshair
  const crosshairMount = new Rectangle(
    0,
    0,
    0.4 * CIRCLE_AROUND_CROSSHAIR_RADIUS,
    0.4 * CIRCLE_AROUND_CROSSHAIR_RADIUS,
    { fill: 'gray' }
  );

  const dragBoundsProperty = new Property( screenView.visibleBoundsProperty.get().shiftedX( dragBoundsShift ) );

  // @public so events can be forwarded to it by ToolboxPanel
  this.dragListener = new DragListener( {
    positionProperty: dataProbe.positionProperty,
    transform: transformProperty.get(),
    dragBoundsProperty: dragBoundsProperty,
    useParentOffset: true,
    start: () => self.isUserControlledProperty.set( true ),
    end: () => self.isUserControlledProperty.set( false ),
    tandem: options.tandem.createTandem( 'dragListener' ),
    phetioDocumentation: 'the listener for the dataProbe tool Node'
  } );

  // label and values readouts
  const timeReadoutProperty = new Property( noValueString );
  const rangeReadoutProperty = new Property( noValueString );
  const heightReadoutProperty = new Property( noValueString );

  const timeBox = createInformationBox( DATA_PROBE_CONTENT_WIDTH, timeString, timeReadoutProperty );
  const rangeBox = createInformationBox( DATA_PROBE_CONTENT_WIDTH, rangeString, rangeReadoutProperty );
  const heightBox = createInformationBox( DATA_PROBE_CONTENT_WIDTH, heightString, heightReadoutProperty );

  const textBox = new VBox( {
    align: 'left',
    spacing: SPACING,
    children: [
      timeBox,
      rangeBox,
      heightBox
    ]
  } );

  // halo node for highlighting the dataPoint whose information is shown in the dataProbe tool
  const smallHaloShape = Shape.circle( 0, 0, SMALL_HALO_RADIUS );
  const largeHaloShape = Shape.circle( 0, 0, LARGE_HALO_RADIUS );
  const haloNode = new Path( smallHaloShape, { pickable: false } );

  // Listen for when time, range, and height change, and update the readouts.
  dataProbe.dataPointProperty.link( function( point ) {
    if ( point !== null ) {
      timeReadoutProperty.set( StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        value: Utils.toFixedNumber( point.time, 2 ),
        units: sString
      } ) );
      rangeReadoutProperty.set( StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        value: Utils.toFixedNumber( point.position.x, 2 ),
        units: mString
      } ) );
      heightReadoutProperty.set( StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        value: Utils.toFixedNumber( point.position.y, 2 ),
        units: mString
      } ) );
      haloNode.centerX = transformProperty.get().modelToViewX( point.position.x );
      haloNode.centerY = transformProperty.get().modelToViewY( point.position.y );
      haloNode.visible = true;
      haloNode.shape = null;
      if ( point.apex ) {
        haloNode.shape = smallHaloShape;
        haloNode.fill = GREEN_HALO_FILL;
      }
      else if ( Utils.toFixedNumber( point.time * 1000, 0 ) % TIME_PER_MAJOR_DOT === 0 ) {
        haloNode.shape = largeHaloShape;
        haloNode.fill = YELLOW_HALO_FILL_LARGE;
      }
      else {
        haloNode.shape = smallHaloShape;
        haloNode.fill = YELLOW_HALO_FILL_SMALL;
      }
    }
    else {
      timeReadoutProperty.set( noValueString );
      rangeReadoutProperty.set( noValueString );
      heightReadoutProperty.set( noValueString );
      haloNode.visible = false;
    }
  } );

  // function align positions, and update model.
  const updatePosition = function( position ) {
    self.probeOrigin.set( transformProperty.get().modelToViewPosition( position ) );

    crosshair.center = self.probeOrigin;
    circle.center = self.probeOrigin;
    crosshairMount.left = self.probeOrigin.x + CIRCLE_AROUND_CROSSHAIR_RADIUS;
    crosshairMount.centerY = self.probeOrigin.y;
    rectangle.left = crosshairMount.right;
    rectangle.centerY = self.probeOrigin.y;
    textBox.left = rectangle.left + 2 * SPACING;
    textBox.top = rectangle.top + 2 * SPACING;

    if ( dataProbe.dataPointProperty.get() ) {
      haloNode.centerX = transformProperty.get().modelToViewX( dataProbe.dataPointProperty.get().position.x );
      haloNode.centerY = transformProperty.get().modelToViewY( dataProbe.dataPointProperty.get().position.y );
    }
  };

  // Observe changes in the modelViewTransform and update/adjust positions accordingly
  transformProperty.link( function( transform ) {
    self.dragListener.transform = transform;
    dragBoundsProperty.value = transform.viewToModelBounds( screenView.visibleBoundsProperty.get().shiftedX( dragBoundsShift ) );
    updatePosition( dataProbe.positionProperty.get() );
  } );

  // Observe changes in the visible bounds and update drag bounds and adjust positions accordingly
  screenView.visibleBoundsProperty.link( function( bounds ) {
    dragBoundsProperty.value = transformProperty.get().viewToModelBounds( screenView.visibleBoundsProperty.get().shiftedX( dragBoundsShift ) );
    updatePosition( dataProbe.positionProperty.get() );
  } );

  // Listen for position changes, align positions, and update model.
  dataProbe.positionProperty.link( function( position ) {
    updatePosition( position );
    self.dataProbe.updateData();
  } );

  // Rendering order
  assert && assert( !options.children, 'this type sets its own children' );
  options.children = [
    haloNode,
    crosshairMount,
    rectangle,
    circle,
    crosshair,
    textBox
  ];

  Node.call( this, options );

  // When dragging, move the dataProbe tool
  this.addInputListener( this.dragListener );

  // visibility of the dataProbe
  dataProbe.isActiveProperty.link( function( active ) {
    self.visible = active;
  } );

  // DataProbeNode lasts for the lifetime of the sim, so links don't need to be disposed.
}

projectileMotion.register( 'DataProbeNode', DataProbeNode );


/**
 * Auxiliary function to create label and number readout for information
 *
 * @param {number} maxWidth - max width for the label and value display
 * @param {string} labelString
 * @param {Property} readoutProperty
 */
function createInformationBox( maxWidth, labelString, readoutProperty ) {

  // width of white rectangular background, also used for calculating max width
  const backgroundWidth = 60;

  // label
  const labelText = new Text( labelString, merge( {}, LABEL_OPTIONS, {
    maxWidth: maxWidth - backgroundWidth - 25
  } ) );

  // number
  const numberOptions = merge( {}, ProjectileMotionConstants.LABEL_TEXT_OPTIONS, { maxWidth: backgroundWidth - 6 } );
  const numberNode = new Text( readoutProperty.get(), numberOptions );

  const backgroundNode = new Rectangle(
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
    if ( readout === noValueString ) {
      numberNode.center = backgroundNode.center;
    }
    else {
      numberNode.right = backgroundNode.right - READOUT_X_MARGIN;
      numberNode.centerY = backgroundNode.centerY;
    }
  } );

  const readoutParent = new Node( { children: [ backgroundNode, numberNode ] } );

  const spacing = maxWidth - labelText.width - readoutParent.width - 4 * SPACING;

  return new HBox( { spacing: spacing, children: [ labelText, readoutParent ] } );
}

inherit( Node, DataProbeNode, {

  /**
   * Get the bounds of just the dataProbe, excluding the halo node
   * @public
   */
  getJustDataProbeBounds: function() {
    const dataProbeBounds = Bounds2.point( this.probeOrigin.x, this.probeOrigin.y );

    // include every child except for the halo in the calculations of dataProbe bounds
    for ( let i = 1; i < this.children.length; i++ ) {
      dataProbeBounds.includeBounds( this.globalToParentBounds( this.children[ i ].getGlobalBounds() ) );
    }
    return dataProbeBounds;
  }
}, {

  /**
   * Create icon of DataProbe node
   * @public
   *
   * @param {Tandem} tandem
   * @returns {Node}
   */
  createIcon: function( tandem ) {
    const rectangle = new Rectangle(
      0,
      0,
      DATA_PROBE_CONTENT_WIDTH,
      95, {
        cornerRadius: 8,
        fill: OPAQUE_BLUE,
        stroke: 'gray',
        lineWidth: 4,
        opacity: 0.8,
        cursor: 'pointer'
      }
    );

    // crosshair view
    const crosshairShape = new Shape()
      .moveTo( -CIRCLE_AROUND_CROSSHAIR_RADIUS, 0 )
      .lineTo( CIRCLE_AROUND_CROSSHAIR_RADIUS, 0 )
      .moveTo( 0, -CIRCLE_AROUND_CROSSHAIR_RADIUS )
      .lineTo( 0, CIRCLE_AROUND_CROSSHAIR_RADIUS );

    const crosshair = new Path( crosshairShape, { stroke: 'black' } );
    const circle = new Circle( CIRCLE_AROUND_CROSSHAIR_RADIUS, {
      lineWidth: 2,
      stroke: 'black',
      fill: TRANSPARENT_WHITE
    } );

    // Create the base of the crosshair
    const crosshairMount = new Rectangle( 0, 0, 0.4 * CIRCLE_AROUND_CROSSHAIR_RADIUS, 0.4 * CIRCLE_AROUND_CROSSHAIR_RADIUS, { fill: 'gray' } );
    const timeBox = createInformationBox( DATA_PROBE_CONTENT_WIDTH, timeString, new Property( noValueString ) );
    const rangeBox = createInformationBox( DATA_PROBE_CONTENT_WIDTH, rangeString, new Property( noValueString ) );
    const heightBox = createInformationBox( DATA_PROBE_CONTENT_WIDTH, heightString, new Property( noValueString ) );

    const textBox = new VBox( {
      align: 'left',
      spacing: SPACING,
      children: [
        timeBox,
        rangeBox,
        heightBox
      ]
    } );

    const probeOrigin = Vector2.createFromPool( 0, 0 );

    crosshair.center = probeOrigin;
    circle.center = probeOrigin;
    crosshairMount.left = probeOrigin.x + CIRCLE_AROUND_CROSSHAIR_RADIUS;
    crosshairMount.centerY = probeOrigin.y;
    rectangle.left = crosshairMount.right;
    rectangle.centerY = probeOrigin.y;
    textBox.left = rectangle.left + 2 * SPACING;
    textBox.top = rectangle.top + 2 * SPACING;

    probeOrigin.freeToPool();

    return new Node( {
      children: [
        crosshairMount,
        rectangle,
        circle,
        crosshair,
        textBox
      ],
      tandem: tandem,
      phetioDocumentation: 'the icon for the DataProbeNode, this is not interactive'
    } );
  }
} );

export default DataProbeNode;
