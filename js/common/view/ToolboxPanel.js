// Copyright 2015, University of Colorado Boulder

/**
 * Toolbox from which the user can drag (or otherwise enable) tools.
 * The toolbox includes a measuring tape and an electric potential sensor
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  // var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  // var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  // var Vector2 = require( 'DOT/Vector2' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  // var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * Toolbox constructor
   * @param {ProjectileMotionMeasuringTape} measuringTape
   * @param {MeasuringTapeNode} measuringTapeNode
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ToolboxPanel( measuringTape, measuringTapeNode, modelViewTransform, options ) {

    options = options || {};
    var self = this;

    // Create the icon image for the measuring Tape
    var measuringTapeIconNode = MeasuringTape.createMeasuringTapeIcon(); // {Node}

    // The content panel with the two icons
    var panelContent = new LayoutBox( {
      spacing: 20,
      children: [ measuringTapeIconNode ],
      pickable: true
    } );

    // Options for the panel
    options = _.extend( {
      lineWidth: ProjectileMotionConstants.PANEL_LINE_WIDTH,
      xMargin: 12,
      yMargin: 10,
      fill: ProjectileMotionConstants.PANEL_FILL_COLOR,
      stroke: ProjectileMotionConstants.PANEL_STROKE
    }, options );

    // add the panelContent
    Panel.call( this, panelContent, options );

    var parentScreenView = null; // needed for coordinate transforms
    // TODO: drop isn't working
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
      // console.log( 'tape ', tapeBaseBounds );
      // console.log( 'toolbox ', toolboxBounds );
      // console.log( 'screen view ', parentScreenView.bounds ); 
      if ( !isUserControlled && toolboxBounds.intersectsBounds( tapeBaseBounds.eroded( 5 ) ) ) {
        measuringTape.isActive = false;
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
        // Ignore non-left-mouse-button
        if ( event.pointer.isMouse && event.domEvent.button !== 0 ) {
          return;
        }

        measuringTape.isActive = true;
        // debugger;

        assert && assert( parentScreenView, 'parent screen view has not been set' );

        var tapeBasePosition = parentScreenView.globalToLocalPoint( measuringTapeNode.localToGlobalPoint( measuringTapeNode.getLocalBaseCenter() ) );
        var initialViewPosition = parentScreenView.globalToLocalPoint( event.pointer.point ).minus( tapeBasePosition );
        // console.log( 'initial view ', initialViewPosition );
        measuringTape.basePosition = modelViewTransform.viewToModelPosition( initialViewPosition );
        measuringTape.tipPosition = measuringTape.basePosition.plus( tipToBasePosition );

        // console.log( modelViewTransform.modelToViewPosition( measuringTape.basePosition ), initialViewPosition );

        // TODO: drag isn't coordinated
        measuringTapeNode.startBaseDrag( event );
      }
    } );

    // TODO: fuzzMouse can move measuringTape and expand toolbox bounds
    // measuringTape visibility has the opposite visibility of the measuringTape Icon
    measuringTape.isActiveProperty.link( function( active ) {
      measuringTapeIconNode.visible = !active;
    } );

  }

  projectileMotion.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( Panel, ToolboxPanel );
} );

