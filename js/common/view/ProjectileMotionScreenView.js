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
  var FireButton = require( 'PROJECTILE_MOTION/common/view/FireButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InitialValuesPanel = require( 'PROJECTILE_MOTION/common/view/InitialValuesPanel' );
  var Matrix3 = require( 'DOT/Matrix3' );
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
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var ZoomControl = require( 'PROJECTILE_MOTION/common/view/ZoomControl' );

  // strings
  var normalString = 'Normal';
  var slowMotionString = 'Slow Motion';

  // constants
  var MIN_ZOOM = ProjectileMotionConstants.MIN_ZOOM;
  var MAX_ZOOM = ProjectileMotionConstants.MAX_ZOOM;
  var DEFAULT_ZOOM = ProjectileMotionConstants.DEFAULT_ZOOM;
  var INSET = ProjectileMotionConstants.PLAY_CONTROLS_HORIZONTAL_INSET;
  var TEXT_MAX_WIDTH = ProjectileMotionConstants.PLAY_CONTROLS_TEXT_MAX_WIDTH;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function ProjectileMotionScreenView( model, options ) {

    options = options || {};
    var thisScreenView = this;

    ScreenView.call( thisScreenView, options );

    // control panels
    var initialValuesPanel = new InitialValuesPanel( model.cannonHeightProperty, model.cannonAngleProperty, model.launchVelocityProperty );

    // second panel is specified in different screens
    var secondPanel = options.secondPanel;

    // vbox contains the control panels
    thisScreenView.addChild( new VBox( {
      x: thisScreenView.layoutBounds.maxX - 150,
      y: 10,
      align: 'left',
      spacing: 10,
      children: [ initialValuesPanel, secondPanel ]
    } ) );

    // fire button
    var fireButton = new FireButton( {
      x: 40, // empirically determined for now
      y: thisScreenView.layoutBounds.maxY - 40,
      listener: model.cannonFired
    } );
    thisScreenView.addChild( fireButton );

    // model view transform
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 100, 450 ), // empirically determined based off original sim
      25 // scale for meters to view units, empirically determined based off original sim
    );
    this.transformedOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    // zoomable node layer
    var zoomableNode = new Node();
    thisScreenView.addChild( zoomableNode );

    // add target
    thisScreenView.targetNode = new TargetNode( model.scoreModel, modelViewTransform );
    zoomableNode.addChild( thisScreenView.targetNode );

    // trajectories layer, so all trajectories are in front of control panel but behind measuring tape
    thisScreenView.trajectoriesLayer = new Node();
    zoomableNode.addChild( thisScreenView.trajectoriesLayer );

    function handleTrajectoryAdded( addedTrajectory ) {
      // create the view representation for added trajectory 
      var trajectoryNode = new TrajectoryNode( addedTrajectory, model.velocityVectorComponentsOnProperty, modelViewTransform );

      thisScreenView.trajectoriesLayer.addChild( trajectoryNode );

      // Add the removal listener for if and when this trajectory is removed from the model.
      model.trajectories.addItemRemovedListener( function removalListener( removedTrajectory ) {
        if ( removedTrajectory === addedTrajectory ) {
          thisScreenView.trajectoriesLayer.removeChild( trajectoryNode );
          model.trajectories.removeItemRemovedListener( removalListener );
        }
      } );
    }

    // view listens to whether a trajectory has been added in the model
    model.trajectories.forEach( handleTrajectoryAdded );
    model.trajectories.addItemAddedListener( handleTrajectoryAdded );

    // add cannon
    thisScreenView.cannonNode = new CannonNode( model.cannonHeightProperty, model.cannonAngleProperty, modelViewTransform );
    zoomableNode.addChild( thisScreenView.cannonNode );

    // add common code measuring tape
    // TODO: its length changes with zoom, but nothing else does
    thisScreenView.measuringTapeNode = new MeasuringTape(
      model.unitsProperty,
      model.measuringTapeVisibleProperty, {
        basePositionProperty: model.measuringTapeBaseProperty,
        tipPositionProperty: model.measuringTapeTipProperty,
        textColor: 'black',
        modelViewTransform: modelViewTransform
      } );
    zoomableNode.addChild( thisScreenView.measuringTapeNode );

    // add view for tracer
    thisScreenView.tracerNode = new TracerNode(
      model.tracerModel,
      modelViewTransform
    );
    zoomableNode.addChild( thisScreenView.tracerNode );

    // zoom property
    var zoomProperty = new Property( DEFAULT_ZOOM );

    // Watch the zoom property and zoom in and out correspondingly, using 3 dimemsional matrix.
    // scale matrix algorithm taken from neuron repo
    zoomProperty.link( function( zoomFactor ) {

      var scaleMatrix;
      var scaleAroundX = thisScreenView.transformedOrigin.x;
      var scaleAroundY = thisScreenView.transformedOrigin.y;

      scaleMatrix = Matrix3.translation( scaleAroundX, scaleAroundY ).timesMatrix( Matrix3.scaling( zoomFactor, zoomFactor ) ).timesMatrix( Matrix3.translation( -scaleAroundX, -scaleAroundY ) );

      zoomableNode.matrix = scaleMatrix;
    } );

    var zoomControl = new ZoomControl( zoomProperty, MIN_ZOOM, MAX_ZOOM );
    thisScreenView.addChild( zoomControl );

    // position zoom control
    zoomControl.top = 0;
    zoomControl.left = 0;

    // add step button
    var stepButton = new StepForwardButton( {
      playingProperty: model.isPlayingProperty,
      listener: function() { model.stepInternal( 0.016 ); },
      radius: 12,
      stroke: 'black',
      fill: '#005566',
      centerX: thisScreenView.layoutBounds.centerX + 100,
      bottom: thisScreenView.layoutBounds.bottom - 20
    } );
    thisScreenView.addChild( stepButton );

    // add play/pause button
    var playPauseButton = new PlayPauseButton( model.isPlayingProperty, {
      radius: 18,
      y: stepButton.centerY,
      right: stepButton.left - 2 * INSET
    } );
    thisScreenView.addChild( playPauseButton );

    // make the play/pause button bigger when it is paused
    var pauseSizeIncreaseFactor = 1.25;
    model.isPlayingProperty.lazyLink( function( isPlaying ) {
      playPauseButton.scale( isPlaying ? ( 1 / pauseSizeIncreaseFactor ) : pauseSizeIncreaseFactor );
    } );

    // add sim speed controls

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
      children: [ slowMotionRadioBox, normalMotionRadioBox ]
    } );

    thisScreenView.addChild( speedControl.mutate( { right: playPauseButton.left - 2 * INSET, bottom: playPauseButton.bottom } ) );

    // add reset all button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        zoomProperty.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    thisScreenView.addChild( resetAllButton );

  }

  projectileMotion.register( 'ProjectileMotionScreenView', ProjectileMotionScreenView );

  return inherit( ScreenView, ProjectileMotionScreenView );
} );

