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
  var ControlPanel = require( 'PROJECTILE_MOTION/common/view/ControlPanel' );
  var TrajectoryNode = require( 'PROJECTILE_MOTION/common/view/TrajectoryNode' );
  var CannonNode = require( 'PROJECTILE_MOTION/common/view/CannonNode' );
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

  // constants
  var INSET = 10;
  var MIN_ZOOM = 0.7;
  var MAX_ZOOM = 6;
  var DEFAULT_ZOOM = 1.0;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function ProjectileMotionScreenView( model ) {

    var thisScreenView = this;

    ScreenView.call( thisScreenView );


    // Control panel
    thisScreenView.addChild( new ControlPanel( model, {
      x: thisScreenView.layoutBounds.maxX - 150,
      y: 15
    } ) );


    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 200, 500 ), // empirically determined based off original sim
      25 // scale for meters, empirically determined based off original sim, smaller zoom in, larger zoom out
    );

    this.transformedOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    // add common code tape measure, TODO: its length changes with zoom, but nothing else does
    thisScreenView.measuringTapeNode = new MeasuringTape(
      model.unitsProperty,
      model.measuringTapeProperty, {
        x: model.measuringTapeX,
        y: model.measuringTapeY,
        textColor: 'black',
        modelViewTransform: modelViewTransform
      } );

    thisScreenView.addChild( thisScreenView.measuringTapeNode );

    model.resetListenerProperty.link( function() {
      thisScreenView.measuringTapeNode.reset();
    } );





    // Define the root for the part that can be zoomed.
    // TODO: reset the zoom
    var zoomableNode = new Node();
    thisScreenView.addChild( zoomableNode );


    // trajectories layer, so all trajectories are in front of control panel but behind measuring tape
    thisScreenView.trajectoriesLayer = new Node();

    function handleTrajectoryAdded( addedTrajectory ) {
      // Create and add the view representation for this trajectory
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

    // all trajectories are in front of control panel and behind measuring tape
    zoomableNode.addChild( thisScreenView.trajectoriesLayer );

    // lets view listen to whether a trajectory has been added in the model
    model.trajectories.forEach( handleTrajectoryAdded );
    model.trajectories.addItemAddedListener( handleTrajectoryAdded );

    // add cannon
    thisScreenView.cannonNode = new CannonNode( model, modelViewTransform );
    zoomableNode.addChild( thisScreenView.cannonNode );

    
    var zoomProperty = new Property( DEFAULT_ZOOM );
    // Create a property that will contain the current zoom transformation matrix.
    var zoomMatrixProperty = new Property();

    // Watch the zoom property and zoom in and out correspondingly.
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
      bottom: thisScreenView.layoutBounds.bottom
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

    // help with visual tests
    // var helperRectangle = new Rectangle( 0, -1, 20, 1, { fill: 'rgba(0,0,255,0.25)' } );
    // thisScreenView.addChild( helperRectangle );
    // helperRectangle.setRectBounds( modelViewTransform.modelToViewBounds( helperRectangle.getRectBounds() ) );
  }

  projectileMotion.register( 'ProjectileMotionScreenView', ProjectileMotionScreenView );

  return inherit( ScreenView, ProjectileMotionScreenView );
} );

