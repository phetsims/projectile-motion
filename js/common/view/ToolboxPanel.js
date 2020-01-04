// Copyright 2016-2020, University of Colorado Boulder

/**
 * Toolbox from which the user can drag (or otherwise enable) tools.
 * The toolbox includes a measuring tape and a tracer tool.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Tandem = require( 'TANDEM/Tandem' );
  const TracerNode = require( 'PROJECTILE_MOTION/common/view/TracerNode' );

  /**
   * Toolbox constructor
   * @param {ProjectileMotionMeasuringTape} measuringTape - model for the measuring tape
   * @param {Tracer} tracer - model for the tracer tool
   * @param {MeasuringTapeNode} measuringTapeNode - view for the measuring tape
   * @param {TracerNode} tracerNode - view for the tracer tool
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {Object} [options]
   * @constructor
   */
  function ToolboxPanel( measuringTape, tracer, measuringTapeNode, tracerNode, transformProperty, options ) {
    const self = this;

    // The first object is an empty placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
      xMargin: 12,
      yMargin: 18,
      fill: 'white',
      minWidth: 200,
      tandem: Tandem.REQUIRED
    }, options );

    // Create the icon Node for the tracer tool
    const tracerIconNode = TracerNode.createIcon( options.tandem.createTandem( 'tracerIconNode' ) );
    tracerIconNode.cursor = 'pointer';
    tracerIconNode.scale( 0.4 );

    // Create the icon image for the measuringTape
    const measuringTapeIconNode = MeasuringTapeNode.createIcon( {}, options.tandem.createTandem( 'measuringTapeIconNode' ), );
    measuringTapeIconNode.cursor = 'pointer';
    measuringTapeIconNode.scale( 0.8 );

    // The content panel with the two icons
    const panelContent = new HBox( {
      spacing: 30,
      children: [ tracerIconNode, measuringTapeIconNode ]
    } );

    // add the panelContent
    Panel.call( this, panelContent, options );

    // listens to the isUserControlled Property of the tracer tool
    // return the tracer to the toolboxPanel if not user Controlled and its position is located within the toolbox panel
    tracerNode.isUserControlledProperty.lazyLink( function( isUserControlled ) {
      assert && assert( tracerNode.parent instanceof ScreenView );
      assert && assert( tracerNode.parent === self.parent );

      const tracerNodeBounds = tracerNode.getJustTracerBounds(); //globalToParentBounds( tracerNode.getGlobalBounds() );
      const toolboxBounds = tracerNode.globalToParentBounds( self.getGlobalBounds() );
      if ( !isUserControlled && toolboxBounds.intersectsBounds( tracerNodeBounds.eroded( 5 ) ) ) {
        tracer.isActiveProperty.set( false );
      }
    } );

    // When pressed, forwards dragging to the actual tracer Node
    tracerIconNode.addInputListener( DragListener.createForwardingListener( event => {
      tracer.isActiveProperty.set( true );

      // offset when pulling out of the toolbox so that the pointer isn't on top of the tool. Convert to parent point
      // because the TracerNode's DragListener is applying its pointer offset in the parent coordinate frame (see https://github.com/phetsims/scenery/issues/1014)
      const parentPoint = this.globalToParentPoint( event.pointer.point ).plusXY( -180, 0 );
      tracer.positionProperty.value = transformProperty.value.viewToModelPosition( parentPoint );
      tracerNode.dragListener.press( event, tracerNode );
    }, { allowTouchSnag: true } ) );

    // tracer visibility has the opposite visibility of the tracerIcon
    tracer.isActiveProperty.link( function( active ) {
      tracerIconNode.visible = !active;
    } );

    // listens to the isUserControlled Property of the measuring tape
    // return the measuring tape to the toolboxPanel if not user Controlled and its position is located within the toolbox panel
    measuringTapeNode.isBaseUserControlledProperty.lazyLink( isUserControlled => {
      assert && assert( measuringTapeNode.parent instanceof ScreenView );
      assert && assert( measuringTapeNode.parent === self.parent );

      const tapeBaseBounds = measuringTapeNode.localToParentBounds( measuringTapeNode.getLocalBaseBounds() );
      const toolboxBounds = measuringTapeNode.globalToParentBounds( self.getGlobalBounds() );
      if ( !isUserControlled && toolboxBounds.intersectsBounds( tapeBaseBounds.eroded( 5 ) ) ) {
        measuringTape.isActiveProperty.set( false );
      }
    } );

    // determine the distance (in model coordinates) between the tip and the base position of the measuring tape
    const tipToBasePosition = measuringTape.tipPositionProperty.get().minus( measuringTape.basePositionProperty.get() );

    // Add the listener that will allow the user to click on this and forward the dragging to the actual measuring tape node
    measuringTapeIconNode.addInputListener( DragListener.createForwardingListener( event => {

      measuringTape.isActiveProperty.set( true );

      const tapeBasePosition = measuringTapeNode.globalToParentPoint( measuringTapeNode.localToGlobalPoint( measuringTapeNode.getLocalBaseCenter() ) );
      const initialViewPosition = measuringTapeNode.globalToParentPoint( event.pointer.point ).minus( tapeBasePosition );
      measuringTape.basePositionProperty.set( transformProperty.get().viewToModelPosition( initialViewPosition ) );
      measuringTape.tipPositionProperty.set( measuringTape.basePositionProperty.get().plus( tipToBasePosition ) );

      measuringTapeNode.startBaseDrag( event );

    }, { allowTouchSnag: true } ) );

    // measuringTape visibility has the opposite visibility of the measuringTape Icon
    measuringTape.isActiveProperty.link( function( active ) {
      measuringTapeIconNode.visible = !active;
    } );

    // Links for the toolboxPanel and its tools last for the lifetime of the sim, so they don't need to be disposed

  }

  projectileMotion.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( Panel, ToolboxPanel );
} );

