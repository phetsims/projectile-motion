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

  /**
   * Toolbox constructor
   * @param {ProjectileMotionMeasuringTape} measuringTape
   * @param {MeasuringTapeNode} measuringTapeNode
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ToolboxPanel( measuringTape, measuringTapeNode, modelViewTransform, options ) {

    options = options || {};
    var toolboxPanel = this;

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

    // determine the distance (in model coordinates) between the tip and the base position of the measuring tape
    var tipToBasePosition = measuringTape.tipPositionProperty.get().minus( measuringTape.basePositionProperty.get() );

    // Add the listener that will allow the user to click on this and create a model element, then position it in the model.
    measuringTapeIconNode.addInputListener( {
      down: function( event ) {
        // Ignore non-left-mouse-button
        if ( event.pointer.isMouse && event.domEvent.button !== 0 ) {
          return;
        }

        measuringTape.isActive = true;

        var initialViewPosition = toolboxPanel.globalToParentPoint( event.pointer.point ).minus( measuringTapeNode.getLocalBaseCenter() );
        measuringTape.basePosition = modelViewTransform.viewToModelPosition( initialViewPosition );
        measuringTape.tipPosition = measuringTape.basePosition.plus( tipToBasePosition );

        // TODO: drag isn't coordinated
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

