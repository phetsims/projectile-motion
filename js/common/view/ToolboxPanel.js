// Copyright 2015, University of Colorado Boulder

/**
 * Toolbox from which the user can drag (or otherwise enable) tools.
 * The toolbox includes a measuring tape and a tracer tool.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
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
      yMargin: 10,
      fill: 'white'
    }, options );

    var tracerIconNode = tracerNode.createIcon();
    tracerIconNode.cursor = 'pointer';
    tracerIconNode.scale( 0.4 );

    // Create the icon image for the measuring Tape
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

    // listens to the isUserControlled property of the tracer tool
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

    // When pressed, creates a model element and triggers startDrag() on the corresponding view
    tracerIconNode.addInputListener( {
      down: function( event ) {

        // ignore this if already dragging
        if ( event.pointer.dragging ) { return; }

        // don't try to start drags with a right mouse button or an attached pointer
        if ( !event.canStartPress() ) { return; }

        // Don't try to start drags with a right mouse button or an attached pointer.
        if ( !event.canStartPress() ) { return; }

        tracer.isActiveProperty.set( true );

        var tracerOriginPosition = tracerNode.globalToParentPoint( tracerNode.localToGlobalPoint( tracer.positionProperty.get() ) );

        // coordinates empirically determined to shift tracer to mouse when pulled out of the toolbox
        var initialViewPosition = tracerNode.globalToParentPoint( event.pointer.point ).minus( tracerOriginPosition ).plusXY( -170, 20 );
        tracer.positionProperty.set( transformProperty.get().viewToModelPosition( initialViewPosition ) );

        tracerNode.movableDragHandler.startDrag( event );
      },

      // touch enters this node
      touchenter: function( event ) {
        this.down( event );
      },

      // touch moves over this node
      touchmove: function( event ) {
        this.down( event );
      }
    } );

    // tracer visibility has the opposite visibility of the tracerIcon
    tracer.isActiveProperty.link( function( active ) {
      tracerIconNode.visible = !active;
    } );

    // listens to the isUserControlled property of the measuring tape
    // return the measuring tape to the toolboxPanel if not user Controlled and its position is located within the toolbox panel
    measuringTapeNode.isBaseUserControlledProperty.lazyLink( function( isUserControlled ) {
      assert && assert( measuringTapeNode.parent instanceof ScreenView );
      assert && assert( measuringTapeNode.parent === self.parent );

      var tapeBaseBounds = measuringTapeNode.globalToParentBounds( measuringTapeNode.getGlobalBounds() );
      var toolboxBounds = measuringTapeNode.globalToParentBounds( self.getGlobalBounds() );
      if ( !isUserControlled && toolboxBounds.intersectsBounds( tapeBaseBounds.eroded( 5 ) ) ) {
        measuringTape.isActiveProperty.set( false );
      }
    } );

    // determine the distance (in model coordinates) between the tip and the base position of the measuring tape
    var tipToBasePosition = measuringTape.tipPositionProperty.get().minus( measuringTape.basePositionProperty.get() );

    // Add the listener that will allow the user to click on this and create a model element, then position it in the model.
    measuringTapeIconNode.addInputListener( {
      down: function( event ) {

        // ignore this if already dragging
        if ( event.pointer.dragging ) { return; }

        // don't try to start drags with a right mouse button or an attached pointer
        if ( !event.canStartPress() ) { return; }

        // Don't try to start drags with a right mouse button or an attached pointer.
        if ( !event.canStartPress() ) { return; }

        measuringTape.isActiveProperty.set( true );

        var tapeBasePosition = tracerNode.globalToParentPoint( measuringTapeNode.localToGlobalPoint( measuringTapeNode.getLocalBaseCenter() ) );
        var initialViewPosition = tracerNode.globalToParentPoint( event.pointer.point ).minus( tapeBasePosition );
        measuringTape.basePositionProperty.set( transformProperty.get().viewToModelPosition( initialViewPosition ) );
        measuringTape.tipPositionProperty.set( measuringTape.basePositionProperty.get().plus( tipToBasePosition ) );

        measuringTapeNode.startBaseDrag( event );
      },

      // touch enters this node
      touchenter: function( event ) {
        this.down( event );
      },

      // touch moves over this node
      touchmove: function( event ) {
        this.down( event );
      }
    } );

    // measuringTape visibility has the opposite visibility of the measuringTape Icon
    measuringTape.isActiveProperty.link( function( active ) {
      measuringTapeIconNode.visible = !active;
    } );

    // Links for the toolboxPanel and its tools last for the lifetime of the sim, so they don't need to be disposed

  }

  projectileMotion.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( Panel, ToolboxPanel );
} );

