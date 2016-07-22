// Copyright 2016, University of Colorado Boulder

/**
 * Common view for a screen.
 * 
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var CannonNode = require( 'PROJECTILE_MOTION/common/view/CannonNode' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var FireButton = require( 'PROJECTILE_MOTION/common/view/FireButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InitialValuesPanel = require( 'PROJECTILE_MOTION/common/view/InitialValuesPanel' );
  // var Matrix3 = require( 'DOT/Matrix3' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var TracerNode = require( 'PROJECTILE_MOTION/common/view/TracerNode' );
  var TrajectoryNode = require( 'PROJECTILE_MOTION/common/view/TrajectoryNode' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var TargetNode = require( 'PROJECTILE_MOTION/common/view/TargetNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ToolboxPanel = require( 'PROJECTILE_MOTION/common/view/ToolboxPanel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  // var ZoomControl = require( 'PROJECTILE_MOTION/common/view/ZoomControl' );

  // strings
  var normalString = 'Normal';
  var slowMotionString = 'Slow Motion';

  // constants
  // var MIN_ZOOM = ProjectileMotionConstants.MIN_ZOOM;
  // var MAX_ZOOM = ProjectileMotionConstants.MAX_ZOOM;
  // var DEFAULT_ZOOM = ProjectileMotionConstants.DEFAULT_ZOOM;
  var INSET = ProjectileMotionConstants.PLAY_CONTROLS_HORIZONTAL_INSET;
  var TEXT_MAX_WIDTH = ProjectileMotionConstants.PLAY_CONTROLS_TEXT_MAX_WIDTH;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function ProjectileMotionScreenView( model, options ) {

    options = options || {};
    var thisScreenView = this;
    ScreenView.call( this, options );

    // model view transform
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 100, 450 ), // empirically determined based off original sim
      25 // scale for meters to view units, empirically determined based off original sim
    );
    this.transformedOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    // zoomable node layer
    // var zoomableNode = new Node();

    // target
    var targetNode = new TargetNode( model.scoreModel, modelViewTransform );

    // trajectories layer, so all trajectories are in front of control panel but behind measuring tape
    var trajectoriesLayer = new Node();

    function handleTrajectoryAdded( addedTrajectory ) {
      // create the view representation for added trajectory 
      var trajectoryNode = new TrajectoryNode( addedTrajectory, model.velocityVectorComponentsOnProperty, modelViewTransform );

      trajectoriesLayer.addChild( trajectoryNode );

      // Add the removal listener for if and when this trajectory is removed from the model.
      model.trajectories.addItemRemovedListener( function removalListener( removedTrajectory ) {
        if ( removedTrajectory === addedTrajectory ) {
          trajectoriesLayer.removeChild( trajectoryNode );
          model.trajectories.removeItemRemovedListener( removalListener );
        }
      } );
    }

    // view listens to whether a trajectory has been added in the model
    model.trajectories.forEach( handleTrajectoryAdded );
    model.trajectories.addItemAddedListener( handleTrajectoryAdded );

    // cannon
    var cannonNode = new CannonNode( model.cannonHeightProperty, model.cannonAngleProperty, modelViewTransform );

    // common code measuring tape
    // TODO: its length changes with zoom, but nothing else does
    var measuringTape = new MeasuringTape(
      model.unitsProperty,
      model.measuringTapeVisibleProperty, {
        visible: false,
        isActiveProperty: new Property( false ), // add is active property
        textColor: 'black',
        modelViewTransform: modelViewTransform
      } );

    // add view for tracer
    var tracerNode = new TracerNode(
      model.tracerModel,
      modelViewTransform
    );

    // zoomableNode.mutate( {
    //   children: [
    //     targetNode,
    //     trajectoriesLayer,
    //     cannonNode
    //   ]
    // } );

    // // zoom property
    // var zoomProperty = new Property( DEFAULT_ZOOM );

    // // Watch the zoom property and zoom in and out correspondingly, using 3 dimemsional matrix.
    // // scale matrix algorithm taken from neuron repo
    // zoomProperty.link( function( zoomFactor ) {

    //   var scaleMatrix;
    //   var scaleAroundX = thisScreenView.transformedOrigin.x;
    //   var scaleAroundY = thisScreenView.transformedOrigin.y;

    //   scaleMatrix = Matrix3.translation( scaleAroundX, scaleAroundY ).timesMatrix( Matrix3.scaling( zoomFactor, zoomFactor ) ).timesMatrix( Matrix3.translation( -scaleAroundX, -scaleAroundY ) );

    //   zoomableNode.matrix = scaleMatrix;
    //   // measuringTape.modelViewTransform = new ModelViewTransform2( scaleMatrix );
    //   // targetNode.target.matrix = scaleMatrix;
    //   // trajectoriesLayer.matrix = scaleMatrix;
    //   // cannonNode.matrix = scaleMatrix;
    //   // measuringTape.mutate( { modelViewTransform: modelViewTransform.})
    // } );

    // // zoom control view and position it
    // var zoomControl = new ZoomControl( zoomProperty, MIN_ZOOM, MAX_ZOOM );
    // zoomControl.top = 0;
    // zoomControl.left = 0;

    // fire button
    var fireButton = new FireButton( {
      x: 40, // empirically determined for now
      y: thisScreenView.layoutBounds.maxY - 40,
      listener: function() { model.cannonFired(); }
    } );

    var eraserButton = new EraserButton( {
      left: fireButton.right + 10,
      y: thisScreenView.layoutBounds.maxY - 40,
      listener: function() { model.eraseTrajectories(); }
    } );

    // control panels
    var initialValuesPanel = new InitialValuesPanel( model.cannonHeightProperty, model.cannonAngleProperty, model.launchVelocityProperty );

    // second panel is specified in different screens
    var secondPanel = options.secondPanel;

    // final panel is the toolbox panel. lab screen will add a tracer tool
    var toolboxPanel = new ToolboxPanel( measuringTape, modelViewTransform );

    // vbox contains the control panels
    var panelsBox = new VBox( {
      x: thisScreenView.layoutBounds.maxX - 150,
      y: 10,
      align: 'left',
      spacing: 10,
      children: [ initialValuesPanel, secondPanel, toolboxPanel ]
    } );

    // step button
    var stepButton = new StepForwardButton( {
      playingProperty: model.isPlayingProperty,
      listener: function() { model.stepModelElements( 0.016 ); },
      radius: 12,
      stroke: 'black',
      fill: '#005566',
      centerX: thisScreenView.layoutBounds.centerX + 100,
      bottom: thisScreenView.layoutBounds.bottom - 20
    } );

    // play/pause button
    var playPauseButton = new PlayPauseButton( model.isPlayingProperty, {
      radius: 18,
      y: stepButton.centerY,
      right: stepButton.left - 2 * INSET
    } );

    // make the play/pause button bigger when it is paused
    var pauseSizeIncreaseFactor = 1.25;
    model.isPlayingProperty.lazyLink( function( isPlaying ) {
      playPauseButton.scale( isPlaying ? ( 1 / pauseSizeIncreaseFactor ) : pauseSizeIncreaseFactor );
    } );

    // sim speed controls
    var slowText = new Text( slowMotionString, {
      font: new PhetFont( 14 ),
      maxWidth: TEXT_MAX_WIDTH
    } );
    var slowMotionRadioBox = new AquaRadioButton( model.speedProperty, 'slow', slowText, { radius: 10 } );

    var normalText = new Text( normalString, {
      font: new PhetFont( 14 ),
      maxWidth: TEXT_MAX_WIDTH
    } );
    var normalMotionRadioBox = new AquaRadioButton( model.speedProperty, 'normal', normalText, { radius: 10 } );

    var speedControl = new VBox( {
      align: 'left',
      spacing: 4,
      right: playPauseButton.left - 2 * INSET,
      bottom: playPauseButton.bottom,
      children: [ slowMotionRadioBox, normalMotionRadioBox ]
    } );

    // reset all button, also a closure for zoomProperty and measuringTape
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        // zoomProperty.reset();
        measuringTape.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );

    // rendering order
    thisScreenView.setChildren( [
      // zoomableNode,
      targetNode,
      trajectoriesLayer,
      cannonNode,
      panelsBox,
      measuringTape,
      tracerNode,
      fireButton,
      eraserButton,
      speedControl,
      stepButton,
      playPauseButton,
      // zoomControl,
      resetAllButton
    ] );
  }

  projectileMotion.register( 'ProjectileMotionScreenView', ProjectileMotionScreenView );

  return inherit( ScreenView, ProjectileMotionScreenView );
} );

