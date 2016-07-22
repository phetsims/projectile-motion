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
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Vector2 = require( 'DOT/Vector2' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );

  /**
   * Toolbox constructor
   * @param {MeasuringTape} measuringTape
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function ToolboxPanel( measuringTape, modelViewTransform, options ) {

    options = options || {};
    var toolboxPanel = this;

    // Create the icon image for the measuring Tape
    var measuringTapeIconNode = this.createMeasuringTapeIcon(); // {Node}

    // The content panel with the two icons
    var panelContent = new LayoutBox( {
      spacing: 20,
      children: [ measuringTapeIconNode ],
      pickable: true
    } );

    // move measuring tape to icon location
    measuringTape.center =  measuringTapeIconNode.center;

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

    // add an is active property to measuring tape
    // TODO: is it bad to add properties to things that are common code?
    measuringTape.isActiveProperty = new Property( false );

    var measuringTapeMovableDragHandler = {
      down: function( event ) {
        // Ignore non-left-mouse-button
        if ( event.pointer.isMouse && event.domEvent.button !== 0 ) {
          return;
        }

        measuringTape.isActiveProperty.set( true );

        var initialViewPosition = toolboxPanel.globalToParentPoint( event.pointer.point ).minus( measuringTape.getLocalBaseCenter() );
        // var initialViewPosition = toolboxPanel.globalToParentPoint( event.pointer.point ).minus( measuringTapeNode.getLocalBaseCenter() );
        measuringTape.basePosition = modelViewTransform.viewToModelPosition( initialViewPosition );
        measuringTape.tipPosition = measuringTape.basePosition.plus( tipToBasePosition );

        measuringTape.startBaseDrag( event );
        // measuringTapeNode.startBaseDrag( event );
      }
    };

    // Add the listener that will allow the user to click on this and create a model element, then position it in the model.
    measuringTapeIconNode.addInputListener( measuringTapeMovableDragHandler );

    // measuringTape visibility has the opposite visibility of the measuringTape Icon
    measuringTape.isActiveProperty.link( function( active ) {
      measuringTape.visible = active;
      measuringTapeIconNode.visible = !active;
    } );

  }

  projectileMotion.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( Panel, ToolboxPanel, {

    /**
     * Returns an icon of the measuring tape
     * @private
     * @returns {Node}
     */
    createMeasuringTapeIcon: function() {
      // procedure to create an icon Image of a measuringTape
      // first, create an actual measuring tape

      var unspooledMeterTape = 30; // in view coordinates
      var measuringTape = new MeasuringTape( new Property( { name: '', multiplier: 1 } ), new Property( true ), {
        tipPositionProperty: new Property( new Vector2( unspooledMeterTape, 0 ) ),
        scale: 0.8 // make it a bit small
      } );
      measuringTape.setTextVisibility( false ); // let's hide the text label value (the length) for the icon

      // second, create the measuringTape icon
      var measuringTapeIcon = new Node( { children: [ measuringTape ] } );

      // Create the measuringTape icon using toImage
      measuringTape.toImage( function( image ) {
        measuringTapeIcon.children = [ new Image( image, { cursor: 'pointer' } ) ];
      }, measuringTape.width - unspooledMeterTape, measuringTape.height - 5, measuringTape.width, measuringTape.height );

      return measuringTapeIcon;
    }
  } );
} );

