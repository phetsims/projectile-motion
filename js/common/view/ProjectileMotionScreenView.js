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
  var BackgroundNode = require( 'PROJECTILE_MOTION/common/view/BackgroundNode' );
  var CannonNode = require( 'PROJECTILE_MOTION/common/view/CannonNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var FireButton = require( 'PROJECTILE_MOTION/common/view/FireButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeasuringTapeNode = require( 'PROJECTILE_MOTION/common/view/MeasuringTapeNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TargetNode = require( 'PROJECTILE_MOTION/common/view/TargetNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ToolboxPanel = require( 'PROJECTILE_MOTION/common/view/ToolboxPanel' );
  var TracerNode = require( 'PROJECTILE_MOTION/common/view/TracerNode' );
  var TrajectoryNode = require( 'PROJECTILE_MOTION/common/view/TrajectoryNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  // strings
  var initialSpeedString = require( 'string!PROJECTILE_MOTION/initialSpeed' );
  var normalString = require( 'string!PROJECTILE_MOTION/normal' );
  var slowString = require( 'string!PROJECTILE_MOTION/slow' );
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var metersPerSecondString = require( 'string!PROJECTILE_MOTION/metersPerSecond' );


  // constants
  // var MIN_ZOOM = ProjectileMotionConstants.MIN_ZOOM;
  // var MAX_ZOOM = ProjectileMotionConstants.MAX_ZOOM;
  // var DEFAULT_ZOOM = ProjectileMotionConstants.DEFAULT_ZOOM;
  var TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
  var INSET = ProjectileMotionConstants.PLAY_CONTROLS_HORIZONTAL_INSET;
  var TEXT_MAX_WIDTH = ProjectileMotionConstants.PLAY_CONTROLS_TEXT_MAX_WIDTH;
  var X_MARGIN = 10;
  var Y_MARGIN = 5;

  /**
   * @param {ProjectileMotionModel} model
   * @param {Panel} topRightPanel - the projectile control panel at the top right
   * @param {Panel} bottomRightPanel - the vectors control panel at the bottom right
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - properties that determine which vectors are shown
   * @constructor
   */
  function ProjectileMotionScreenView(
                                      model,
                                      topRightPanel,
                                      bottomRightPanel,
                                      vectorVisibilityProperties,
                                      options
  ) {

    options = options || {};
    var self = this;

    ScreenView.call( this, options );

    // TODO: Spacing for panels around edges of visible bounds
    //   ScreenView.visibleBoundsProperty, using this.visibleBoundsProperty.link
    //   See cck and expression exchange

    // TODO: Constrain dragging to visible bounds

    // model view transform
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      ProjectileMotionConstants.VIEW_ORIGIN, // empirically determined based off original sim
      25 // scale for meters to view units, empirically determined based off original sim
    );
    this.transformedOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    this.backgroundNode = new BackgroundNode( this.layoutBounds );

    // zoomable node layer
    // var zoomableNode = new Node();

    // target
    var targetNode = new TargetNode( model.score, modelViewTransform );

    // trajectories layer, so all trajectories are in front of control panel but behind measuring tape
    var trajectoriesLayer = new Node();

    function handleTrajectoryAdded( addedTrajectory ) {
      // create the view representation for added trajectory 
      var trajectoryNode = new TrajectoryNode(
        vectorVisibilityProperties,
        addedTrajectory,
        // model.totalVelocityVectorOnProperty,
        // model.componentsVelocityVectorsOnProperty,
        // model.componentsAccelerationVectorsOnProperty,
        modelViewTransform
      );

      trajectoriesLayer.addChild( trajectoryNode );

      // Add the removal listener for if and when this trajectory is removed from the model.
      model.trajectories.addItemRemovedListener( function removalListener( removedProjectile ) {
        if ( removedProjectile === addedTrajectory ) {
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

    // initial speed readout, slider, and tweakers
    // TODO: pass in range because it is different for each screen
    var initialSpeedControl = new NumberControl(
      initialSpeedString, model.launchVelocityProperty,
      ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE, {
        valuePattern: StringUtils.format( pattern0Value1UnitsWithSpaceString, '{0}', metersPerSecondString ),
        valueBackgroundStroke: 'gray',
        valueAlign: 'center',
        titleFont: TEXT_FONT,
        valueFont: TEXT_FONT,
        constrainValue: function( value ) { return Util.roundSymmetric( value ); },
        majorTickLength: 5,
        majorTicks: [ { value: ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE.min }, { value: ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE.max } ],
        trackSize: new Dimension2( 120, 0.5 ), // width is empirically determined
        thumbSize: new Dimension2( 16, 28 ),
        thumbTouchAreaXDilation: 6,
        thumbTouchAreaYDilation: 4
      }
    );

    var initialSpeedPanel = new Panel(
      initialSpeedControl,
      _.extend( { leftTop: cannonNode.leftBottom }, ProjectileMotionConstants.INITIAL_SPEED_PANEL_OPTIONS )
    );

    // Create a measuring tape (set to invisible initially)
    var measuringTapeNode = new MeasuringTapeNode( model.measuringTape, modelViewTransform );

    // add view for tracer
    var tracerNode = new TracerNode(
      model.tracer,
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

    // toolbox panel contains measuring tape. lab screen will add a tracer tool
    var toolboxPanel = new ToolboxPanel( model.measuringTape, model.tracer, measuringTapeNode, tracerNode, modelViewTransform );

    // step button
    var stepButton = new StepForwardButton( {
      playingProperty: model.isPlayingProperty,
      listener: function() { model.stepModelElements( 0.016 ); },
      radius: 12,
      stroke: 'black',
      fill: '#005566',
      centerX: self.layoutBounds.centerX + 100
    } );

    // play/pause button
    var playPauseButton = new PlayPauseButton( model.isPlayingProperty, {
      radius: 18,
      bottom: this.layoutBounds.bottom - Y_MARGIN,
      right: stepButton.left - 2 * INSET
    } );

    stepButton.centerY = playPauseButton.centerY;

    // make the play/pause button bigger when it is paused
    var pauseSizeIncreaseFactor = 1.25;
    model.isPlayingProperty.lazyLink( function( isPlaying ) {
      playPauseButton.scale( isPlaying ? ( 1 / pauseSizeIncreaseFactor ) : pauseSizeIncreaseFactor );
    } );

    // sim speed controls
    var normalText = new Text( normalString, {
      font: new PhetFont( 14 ),
      maxWidth: TEXT_MAX_WIDTH
    } );
    var normalMotionRadioBox = new AquaRadioButton( model.speedProperty, 'normal', normalText, { radius: 10 } );

    var slowText = new Text( slowString, {
      font: new PhetFont( 14 ),
      maxWidth: TEXT_MAX_WIDTH
    } );
    var slowMotionRadioBox = new AquaRadioButton( model.speedProperty, 'slow', slowText, { radius: 10 } );

    var speedControl = new VBox( {
      align: 'left',
      spacing: 4,
      right: playPauseButton.left - 2 * INSET,
      bottom: playPauseButton.bottom,
      children: [ normalMotionRadioBox, slowMotionRadioBox ]
    } );

    // fire button
    var fireButton = new FireButton( {
      minWidth: 50,
      iconWidth: 30,
      minHeight: 40,
      listener: function() { model.cannonFired(); },
      bottom: ProjectileMotionConstants.VIEW_ORIGIN.y - 30
    } );

    // eraser button
    var eraserButton = new EraserButton( {
      minWidth: 50,
      iconWidth: 30,
      minHeight: 40,
      listener: function() { model.eraseProjectiles(); },
      bottom: fireButton.bottom
    } );

    // reset all button, also a closure for zoomProperty and measuringTape
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        vectorVisibilityProperties.reset();
        // zoomProperty.reset();
      },
      bottom: this.layoutBounds.maxY - Y_MARGIN
    } );

    // properties
    this.topRightPanel = topRightPanel;
    this.bottomRightPanel = bottomRightPanel;
    this.toolboxPanel = toolboxPanel;
    this.resetAllButton = resetAllButton;
    this.fireButton = fireButton;
    this.eraserButton = eraserButton;

    // rendering order
    self.setChildren( [
      this.backgroundNode,
      // zoomableNode,
      targetNode,
      trajectoriesLayer,
      initialSpeedPanel,
      cannonNode,
      topRightPanel,
      bottomRightPanel,
      toolboxPanel,
      measuringTapeNode,
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

  return inherit( ScreenView, ProjectileMotionScreenView, {
    layout: function( width, height ) {
      this.resetTransform();

      var scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      var offsetX = 0;
      var offsetY = 0;

      // Move to bottom vertically
      if ( scale === width / this.layoutBounds.width ) {
        offsetY = ( height / scale - this.layoutBounds.height );
      }

      // center horizontally
      else if ( scale === height / this.layoutBounds.height ) {
        offsetX = ( width - this.layoutBounds.width * scale ) / 2 / scale;
      }
      this.translate( offsetX, offsetY );

      this.backgroundNode.layout( offsetX, offsetY, width, height, scale );

      this.topRightPanel.right = width / scale - offsetX - X_MARGIN;
      this.topRightPanel.top = Y_MARGIN - offsetY;
      this.bottomRightPanel.setRightTop( this.topRightPanel.rightBottom.plusXY( 0, Y_MARGIN) );
      this.toolboxPanel.setRightTop( this.topRightPanel.leftTop.minusXY( X_MARGIN, 0 ) );
      this.eraserButton.left = this.topRightPanel.centerX + X_MARGIN;
      this.fireButton.right = this.topRightPanel.centerX - X_MARGIN;
      this.resetAllButton.right = this.topRightPanel.right;
    }

  } );
} );

