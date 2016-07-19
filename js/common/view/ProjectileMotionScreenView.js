// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var InitialValuesPanel = require( 'PROJECTILE_MOTION/common/view/InitialValuesPanel' );
  var CustomizePanel = require( 'PROJECTILE_MOTION/common/view/CustomizePanel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ProjectileNode = require( 'PROJECTILE_MOTION/common/view/ProjectileNode' );
  var CannonNode = require( 'PROJECTILE_MOTION/common/view/CannonNode' );
  var TargetNode = require( 'PROJECTILE_MOTION/common/view/TargetNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var ZoomControl = require( 'PROJECTILE_MOTION/common/view/ZoomControl' );
  var Property = require( 'AXON/Property' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var normalString = 'Normal';
  var slowMotionString = 'Slow Motion';

  // constants
  var INSET = 10;
  var MIN_ZOOM = 0.5;
  var MAX_ZOOM = 5;
  var DEFAULT_ZOOM = 1.0;
  var TEXT_MAX_WIDTH = 80;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function ProjectileMotionScreenView( model ) {

    var thisScreenView = this;

    ScreenView.call( thisScreenView );

    // score text, behind all other children
    thisScreenView.score = new Text( 'Score!', {
      font: new PhetFont( 20 ),
      centerX: ( thisScreenView.layoutBounds.minX + thisScreenView.layoutBounds.maxX ) / 2,
      centerY: ( thisScreenView.layoutBounds.minY + thisScreenView.layoutBounds.maxY ) / 2,
      visible: false
    } );

    model.showScoreProperty.link( function( showScore ) {
      if ( showScore ) {
        thisScreenView.score.visible = true;
      } else {
        thisScreenView.score.visible = false;
      }
    } );

    thisScreenView.addChild( thisScreenView.score );

    // Control panels
    var initialValuesPanel = new InitialValuesPanel( model );

    var customizePanel = new CustomizePanel( model );

    thisScreenView.addChild( new VBox( {
      x: thisScreenView.layoutBounds.maxX - 150,
      y: 10,
      align: 'left',
      spacing: 10,
      children: [ initialValuesPanel, customizePanel ]
    } ) );


    var fireListener = function() {
      model.cannonFired();
    };

    var fireButton = new RoundPushButton( {
      x: 40, // empirically determined for now
      y: thisScreenView.layoutBounds.maxY - 40,
      baseColor: '#94b830', //green
      listener: fireListener
    } );

    thisScreenView.addChild( fireButton );

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 100, 450 ), // empirically determined based off original sim
      25 // scale for meters, empirically determined based off original sim, smaller zoom in, larger zoom out
    );

    this.transformedOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );


    // Define the root for the part that can be zoomed.
    // TODO: reset the zoom
    var zoomableNode = new Node();
    thisScreenView.addChild( zoomableNode );

    // add target
    thisScreenView.targetNode = new TargetNode( model.targetXProperty, modelViewTransform );
    zoomableNode.addChild( thisScreenView.targetNode );


    // trajectories layer, so all trajectories are in front of control panel but behind measuring tape
    thisScreenView.trajectoriesLayer = new Node();

    function handleTrajectoryAdded( addedTrajectory ) {
      // Create and add the view representation for this trajectory
      var projectileNode = new ProjectileNode( addedTrajectory, model.velocityVectorComponentsOnProperty, modelViewTransform );

      thisScreenView.trajectoriesLayer.addChild( projectileNode );

      // Add the removal listener for if and when this trajectory is removed from the model.
      model.trajectories.addItemRemovedListener( function removalListener( removedTrajectory ) {
        if ( removedTrajectory === addedTrajectory ) {
          thisScreenView.trajectoriesLayer.removeChild( projectileNode );
          model.trajectories.removeItemRemovedListener( removalListener );
        }
      } );
    }

    // all trajectories are in front of control panel and behind measuring tape
    zoomableNode.addChild( thisScreenView.trajectoriesLayer );

    // lets view listen to whether a trajectory has been added in the model
    model.trajectories.forEach( handleTrajectoryAdded );
    model.trajectories.addItemAddedListener( handleTrajectoryAdded );

    // add cannon
    thisScreenView.cannonNode = new CannonNode( model, modelViewTransform );
    zoomableNode.addChild( thisScreenView.cannonNode );


    // add common code tape measure
    // TODO: its length changes with zoom, but nothing else does
    thisScreenView.measuringTapeNode = new MeasuringTape(
      model.unitsProperty,
      model.measuringTapeProperty, {
        x: model.measuringTapeX,
        y: model.measuringTapeY,
        textColor: 'black',
        modelViewTransform: modelViewTransform
      } );

    zoomableNode.addChild( thisScreenView.measuringTapeNode );


    var zoomProperty = new Property( DEFAULT_ZOOM );
    // Create a property that will contain the current zoom transformation matrix, may use in measuring tape later
    var zoomMatrixProperty = new Property();

    // Watch the zoom property and zoom in and out correspondingly.using 3 dimemsional matrix
    zoomProperty.link( function( zoomFactor ) {

      var scaleMatrix;
      var scaleAroundX = thisScreenView.transformedOrigin.x;
      var scaleAroundY = thisScreenView.transformedOrigin.y;

      scaleMatrix = Matrix3.translation( scaleAroundX, scaleAroundY ).timesMatrix( Matrix3.scaling( zoomFactor, zoomFactor ) ).timesMatrix( Matrix3.translation( -scaleAroundX, -scaleAroundY ) );

      zoomableNode.matrix = scaleMatrix;
      zoomMatrixProperty.value = scaleMatrix;

    } );

    var zoomControl = new ZoomControl( zoomProperty, MIN_ZOOM, MAX_ZOOM );
    thisScreenView.addChild( zoomControl );
    zoomControl.top = 0;
    zoomControl.left = 0;

    // add play/pause and step buttons
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

    // add play pause
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

    // 'Reset All' button, resets the sim to its initial state
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        zoomProperty.reset();
        thisScreenView.measuringTapeNode.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    thisScreenView.addChild( resetAllButton );
  }

  projectileMotion.register( 'ProjectileMotionScreenView', ProjectileMotionScreenView );

  return inherit( ScreenView, ProjectileMotionScreenView );
} );

