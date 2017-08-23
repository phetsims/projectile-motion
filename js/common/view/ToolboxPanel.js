// Copyright 2016-2017, University of Colorado Boulder

/**
 * Toolbox from which the user can drag (or otherwise enable) tools.
 * The toolbox includes a measuring tape and a tracer tool.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var TracerNode = require( 'PROJECTILE_MOTION/common/view/TracerNode' );
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
    var self = this;

    // The first object is an empty placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
      xMargin: 12,
      yMargin: 18,
      fill: 'white',
      minWidth: 200
    }, options );
    
    // Create the icon Node for the tracer tool
    var tracerIconNode = TracerNode.createIcon();
    tracerIconNode.cursor = 'pointer';
    tracerIconNode.scale( 0.4 );

    // Create the icon image for the measuringTape
    var measuringTapeIconNode = MeasuringTapeNode.createIcon();
    measuringTapeIconNode.cursor = 'pointer';
    measuringTapeIconNode.scale( 0.8 );

    // The content panel with the two icons
    var panelContent = new HBox( {
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

      var tracerNodeBounds = tracerNode.getJustTracerBounds(); //globalToParentBounds( tracerNode.getGlobalBounds() );
      var toolboxBounds = tracerNode.globalToParentBounds( self.getGlobalBounds() );
      if ( !isUserControlled && toolboxBounds.intersectsBounds( tracerNodeBounds.eroded( 5 ) ) ) {
        tracer.isActiveProperty.set( false );
      }
    } );

    // When pressed, forwards dragging to the actual tracer Node
    tracerIconNode.addInputListener( SimpleDragHandler.createForwardingListener( function( event ) {

        tracer.isActiveProperty.set( true );

        // coordinates empirically determined to shift tracer to mouse when pulled out of the toolbox
        var initialViewPosition = tracerNode.globalToParentPoint( event.pointer.point ).plusXY( -180, 0 );
        tracer.positionProperty.set( transformProperty.get().viewToModelPosition( initialViewPosition ) );
        tracerNode.movableDragHandler.startDrag( event );

    }, { allowTouchSnag: true } ) );

    // tracer visibility has the opposite visibility of the tracerIcon
    tracer.isActiveProperty.link( function( active ) {
      tracerIconNode.visible = !active;
    } );

    // listens to the isUserControlled Property of the measuring tape
    // return the measuring tape to the toolboxPanel if not user Controlled and its position is located within the toolbox panel
    measuringTapeNode.isBaseUserControlledProperty.lazyLink( function( isUserControlled ) {
      assert && assert( measuringTapeNode.parent instanceof ScreenView );
      assert && assert( measuringTapeNode.parent === self.parent );

      var tapeBaseBounds = measuringTapeNode.localToParentBounds( measuringTapeNode.getLocalBaseBounds() );
      var toolboxBounds = measuringTapeNode.globalToParentBounds( self.getGlobalBounds() );
      if ( !isUserControlled && toolboxBounds.intersectsBounds( tapeBaseBounds.eroded( 5 ) ) ) {
        measuringTape.isActiveProperty.set( false );
      }
    } );

    // determine the distance (in model coordinates) between the tip and the base position of the measuring tape
    var tipToBasePosition = measuringTape.tipPositionProperty.get().minus( measuringTape.basePositionProperty.get() );

    // Add the listener that will allow the user to click on this and forward the dragging to the actual measuring tape node
    measuringTapeIconNode.addInputListener( SimpleDragHandler.createForwardingListener( function( event ) {

        measuringTape.isActiveProperty.set( true );

        var tapeBasePosition = measuringTapeNode.globalToParentPoint( measuringTapeNode.localToGlobalPoint( measuringTapeNode.getLocalBaseCenter() ) );
        var initialViewPosition = measuringTapeNode.globalToParentPoint( event.pointer.point ).minus( tapeBasePosition );
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

