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
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * Toolbox constructor
   * @param {ProjectileMotionMeasuringTape} measuringTape
   * @param {Tracer} tracer
   * @param {MeasuringTapeNode} measuringTapeNode
   * @param {TracerNode} tracerNode
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ToolboxPanel( measuringTape, tracer, measuringTapeNode, tracerNode, modelViewTransform, options ) {
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
    var measuringTapeIconNode = MeasuringTape.createIcon();
    measuringTapeIconNode.cursor = 'pointer';
    measuringTapeIconNode.scale( 0.8 );

    // The content panel with the two icons
    var panelContent = new HBox( {
      spacing: 30,
      children: [ tracerIconNode, measuringTapeIconNode ]
    } );

    // add the panelContent
    Panel.call( this, panelContent, options );

    var parentScreenView = null; // needed for coordinate transforms

    // listens to the isUserControlled property of the tracer tool
    // return the tracer to the toolboxPanel if not user Controlled and its position is located within the toolbox panel
    tracerNode.isUserControlledProperty.lazyLink( function( isUserControlled ) {
      // find the parent screen if not already found by moving up the scene graph
      if ( !parentScreenView ) {
        var testNode = self;
        while ( testNode !== null ) {
          if ( testNode instanceof ScreenView ) {
            parentScreenView = testNode;
            break;
          }
          testNode = testNode.parents[ 0 ]; // move up the scene graph by one level
        }
        assert && assert( parentScreenView, 'unable to find parent screen view' );
      }
      // debugger;
      var tracerNodeBounds = parentScreenView.globalToLocalBounds( tracerNode.getGlobalBounds() );
      var toolboxBounds = parentScreenView.globalToLocalBounds( self.getGlobalBounds() );
      if ( !isUserControlled && toolboxBounds.intersectsBounds( tracerNodeBounds.eroded( 5 ) ) ) {
        tracer.isActiveProperty.set( false );
      }
      // TODO: both measuring tape and tracer tool leave the cursor still as pointer even when released
    } );

    // When pressed, creates a model element and triggers startDrag() on the corresponding view
    tracerIconNode.addInputListener( {
      down: function( event ) {
        // find the parent screen if not already found by moving up the scene graph
        if ( !parentScreenView ) {
          var testNode = self;
          while ( testNode !== null ) {
            if ( testNode instanceof ScreenView ) {
              parentScreenView = testNode;
              break;
            }
            testNode = testNode.parents[ 0 ]; // move up the scene graph by one level
          }
          assert && assert( parentScreenView, 'unable to find parent screen view' );
        }

        // Don't try to start drags with a right mouse button or an attached pointer.
        if ( !event.canStartPress() ) { return; }

        tracer.isActiveProperty.set( true );

        var tracerOriginPosition = parentScreenView.globalToLocalPoint( tracerNode.localToGlobalPoint( tracer.positionProperty.get() ) );
        var initialViewPosition = parentScreenView.globalToLocalPoint( event.pointer.point ).minus( tracerOriginPosition );
        tracer.positionProperty.set( modelViewTransform.viewToModelPosition( initialViewPosition ) );

        // TODO: where to have tracer jump to
        tracerNode.movableDragHandler.startDrag( event );
      }
    } );

    // tracer visibility has the opposite visibility of the tracerIcon
    tracer.isActiveProperty.link( function( active ) {
      tracerIconNode.visible = !active;
    } );

    // listens to the isUserControlled property of the measuring tape
    // return the measuring tape to the toolboxPanel if not user Controlled and its position is located within the toolbox panel
    measuringTapeNode.isBaseUserControlledProperty.lazyLink( function( isUserControlled ) {
      // find the parent screen if not already found by moving up the scene graph
      if ( !parentScreenView ) {
        var testNode = self;
        while ( testNode !== null ) {
          if ( testNode instanceof ScreenView ) {
            parentScreenView = testNode;
            break;
          }
          testNode = testNode.parents[ 0 ]; // move up the scene graph by one level
        }
        assert && assert( parentScreenView, 'unable to find parent screen view' );
      }
      // debugger;
      var tapeBaseBounds = parentScreenView.globalToLocalBounds( measuringTapeNode.getGlobalBounds() );
      var toolboxBounds = parentScreenView.globalToLocalBounds( self.getGlobalBounds() );
      if ( !isUserControlled && toolboxBounds.intersectsBounds( tapeBaseBounds.eroded( 5 ) ) ) {
        measuringTape.isActiveProperty.set( false );
      }
    } );

    // determine the distance (in model coordinates) between the tip and the base position of the measuring tape
    var tipToBasePosition = measuringTape.tipPositionProperty.get().minus( measuringTape.basePositionProperty.get() );

    // Add the listener that will allow the user to click on this and create a model element, then position it in the model.
    measuringTapeIconNode.addInputListener( {
      down: function( event ) {
        // find the parent screen if not already found by moving up the scene graph
        if ( !parentScreenView ) {
          var testNode = self;
          while ( testNode !== null ) {
            if ( testNode instanceof ScreenView ) {
              parentScreenView = testNode;
              break;
            }
            testNode = testNode.parents[ 0 ]; // move up the scene graph by one level
          }
          assert && assert( parentScreenView, 'unable to find parent screen view' );
        }

        // Don't try to start drags with a right mouse button or an attached pointer.
        if ( !event.canStartPress() ) { return; }

        measuringTape.isActiveProperty.set( true );
        // debugger;

        assert && assert( parentScreenView, 'parent screen view has not been set' );

        var tapeBasePosition = parentScreenView.globalToLocalPoint( measuringTapeNode.localToGlobalPoint( measuringTapeNode.getLocalBaseCenter() ) );
        var initialViewPosition = parentScreenView.globalToLocalPoint( event.pointer.point ).minus( tapeBasePosition );
        measuringTape.basePositionProperty.set( modelViewTransform.viewToModelPosition( initialViewPosition ) );
        measuringTape.tipPositionProperty.set( measuringTape.basePositionProperty.get().plus( tipToBasePosition ) );

        measuringTapeNode.startBaseDrag( event );
      }
    } );

    // measuringTape visibility has the opposite visibility of the measuringTape Icon
    measuringTape.isActiveProperty.link( function( active ) {
      measuringTapeIconNode.visible = !active;
    } );

  }

  projectileMotion.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( Panel, ToolboxPanel );
} );

