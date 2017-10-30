// Copyright 2016-2017, University of Colorado Boulder

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
  var Bounds2 = require( 'DOT/Bounds2' );
  var CannonNode = require( 'PROJECTILE_MOTION/common/view/CannonNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var FireButton = require( 'PROJECTILE_MOTION/common/view/FireButton' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var platform = require( 'PHET_CORE/platform' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shape = require( 'KITE/Shape' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TargetNode = require( 'PROJECTILE_MOTION/common/view/TargetNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ToolboxPanel = require( 'PROJECTILE_MOTION/common/view/ToolboxPanel' );
  var TracerNode = require( 'PROJECTILE_MOTION/common/view/TracerNode' );
  var TrajectoryNode = require( 'PROJECTILE_MOTION/common/view/TrajectoryNode' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // images
  var davidImage = require( 'image!PROJECTILE_MOTION/david.png' );

  // strings
  var initialSpeedString = require( 'string!PROJECTILE_MOTION/initialSpeed' );
  var metersPerSecondString = require( 'string!PROJECTILE_MOTION/metersPerSecond' );
  var metersString = require( 'string!PROJECTILE_MOTION/meters' );
  var normalString = require( 'string!PROJECTILE_MOTION/normal' );
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var slowString = require( 'string!PROJECTILE_MOTION/slow' );

  // constants
  var DEFAULT_SCALE = 30;
  var MIN_ZOOM = ProjectileMotionConstants.MIN_ZOOM;
  var MAX_ZOOM = ProjectileMotionConstants.MAX_ZOOM;
  var DEFAULT_ZOOM = ProjectileMotionConstants.DEFAULT_ZOOM;
  var TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
  var PLAY_CONTROLS_INSET = ProjectileMotionConstants.PLAY_CONTROLS_HORIZONTAL_INSET;
  var TEXT_MAX_WIDTH = ProjectileMotionConstants.PLAY_CONTROLS_TEXT_MAX_WIDTH;
  var X_MARGIN = 10;
  var Y_MARGIN = 5;
  var FLATIRONS_RANGE = { min: 1500, max: 1700 };

  /**
   * @param {ProjectileMotionModel} model
   * @param {Panel} topRightPanel - the projectile control panel at the top right
   * @param {Panel} bottomRightPanel - the vectors control panel at the bottom right
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown
   * @param {Object} [options]
   * @constructor
   */
  function ProjectileMotionScreenView( model,
                                       topRightPanel,
                                       bottomRightPanel,
                                       vectorVisibilityProperties,
                                       options ) {
    var self = this;

    ScreenView.call( this, options );

    // If on mobile device, don't draw things beyond boundary. For performance.
    if ( platform.mobileSafari ) {
      this.visibleBoundsProperty.link( function( bounds ) {
        self.clipArea = Shape.bounds( bounds );
      } );
    }

    // model view transform
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      ProjectileMotionConstants.VIEW_ORIGIN,
      DEFAULT_SCALE
    );

    // tracks changes to modelViewTransform
    var transformProperty = new Property( modelViewTransform );

    // target
    var targetNode = new TargetNode( model.score, transformProperty, this );

    // trajectories layer, so all trajectories are in front of control panel but behind measuring tape
    var trajectoriesLayer = new Node();

    function handleTrajectoryAdded( addedTrajectory ) {

      // create the view representation for added trajectory
      var trajectoryNode = new TrajectoryNode(
        vectorVisibilityProperties,
        addedTrajectory,
        transformProperty
      );

      // add the view to scene graph
      trajectoriesLayer.addChild( trajectoryNode );

      // Add the removal listener for if and when this trajectory is removed from the model.
      model.trajectories.addItemRemovedListener( function removalListener( removedTrajectory ) {
        if ( removedTrajectory === addedTrajectory ) {
          trajectoryNode.dispose();
          model.trajectories.removeItemRemovedListener( removalListener );
        }
      } );
    }

    // view listens to whether a trajectory has been added in the model
    model.trajectories.forEach( handleTrajectoryAdded );
    model.trajectories.addItemAddedListener( handleTrajectoryAdded );

    // cannon
    var cannonNode = new CannonNode( model.cannonHeightProperty, model.cannonAngleProperty, model.muzzleFlashStepper, transformProperty, this, options );

    // results in '{0} m/s'
    var valuePattern = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
      value: '{0}', // map to numbered placeholder for NumberControl
      units: metersPerSecondString
    } );

    // initial speed readout, slider, and tweakers
    var initialSpeedControl = new NumberControl(
      initialSpeedString, model.launchVelocityProperty,
      ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE, {
        valuePattern: valuePattern,
        valueAlign: 'center',
        titleFont: TEXT_FONT,
        valueFont: TEXT_FONT,
        constrainValue: function( value ) { return Util.roundSymmetric( value ); },
        trackSize: new Dimension2( 120, 0.5 ), // width is empirically determined
        thumbSize: new Dimension2( 13, 22 ),
        thumbTouchAreaXDilation: 6,
        thumbTouchAreaYDilation: 4,
        arrowButtonScale: 0.56,
        titleMaxWidth: 120, // empirically determined
        valueMaxWidth: 80 // empirically determined
      }
    );

    // panel under the cannon, controls initial speed of projectiles
    var initialSpeedPanel = new Panel(
      initialSpeedControl,
      _.extend( {
        left: this.layoutBounds.left + X_MARGIN,
        bottom: this.layoutBounds.bottom - 10
      }, ProjectileMotionConstants.INITIAL_SPEED_PANEL_OPTIONS )
    );

    // Create a measuring tape (set to invisible initially)
    var measuringTapeNode = new MeasuringTapeNode(
      new Property( { name: metersString, multiplier: 1 } ),
      model.measuringTape.isActiveProperty, {
        modelViewTransform: transformProperty.get(),
        basePositionProperty: model.measuringTape.basePositionProperty,
        tipPositionProperty: model.measuringTape.tipPositionProperty,
        isTipDragBounded: true,
        textColor: 'black',
        textBackgroundColor: 'rgba( 255, 255, 255, 0.6 )', // translucent white background
        significantFigures: 2,
        textFont: new PhetFont( { size: 16, weight: 'bold' } )
      } );

    // {DerivedProperty.<Bounds2>} The measuring tape's drag bounds in model coordinates, constrained
    // so that it remains easily visible and grabbable. Unlike TracerNode, MeasuringTapeNode does
    // not have dynamic drag bounds, so we need to create out own DerivedProperty and associated listener here.
    // See https://github.com/phetsims/projectile-motion/issues/145.
    var measuringTapeDragBoundsProperty = new DerivedProperty( [ transformProperty, this.visibleBoundsProperty ],
      function( transform, visibleBounds ) {
        return transform.viewToModelBounds( visibleBounds.eroded( 20 ) );
      } );
    // unlink unnecessary
    measuringTapeDragBoundsProperty.link( function( bounds ) {
      measuringTapeNode.setDragBounds( bounds );
    } );

    // David
    var davidNode = new Image( davidImage );

    // background, including grass, road, sky, flatirons
    var backgroundNode = new BackgroundNode( this.layoutBounds );

    // listen to transform Property
    transformProperty.link( function( transform ) {
      measuringTapeNode.setModelViewTransform( transform );
      davidNode.maxHeight = Math.abs( transform.modelToViewDeltaY( model.davidHeight ) );
      davidNode.centerX = transform.modelToViewX( model.davidPosition.x );
      davidNode.bottom = transformProperty.get().modelToViewY( model.davidPosition.y );
      backgroundNode.updateFlatironsPosition( transform );
    } );

    // add view for tracer
    var tracerNode = new TracerNode(
      model.tracer,
      transformProperty,
      this
    );

    // zoom Property
    var zoomProperty = new NumberProperty( DEFAULT_ZOOM );

    // zoom control view
    var zoomControl = new Node();

    var zoomOutButton = new ZoomButton( {
      baseColor: '#E7E8E9',
      radius: 8,
      xMargin: 3,
      yMargin: 3,
      disabledBaseColor: '#EDEDED',
      in: false,
      left: 0,
      top: 0,
      touchAreaXDilation: 3,
      touchAreaYDilation: 6
    } );
    zoomControl.addChild( zoomOutButton );

    var zoomInButton = new ZoomButton( {
      baseColor: '#E7E8E9',
      radius: 8,
      xMargin: 3,
      yMargin: 3,
      disabledBaseColor: '#EDEDED',
      in: true,
      left: zoomOutButton.right + X_MARGIN,
      top: zoomOutButton.top,
      touchAreaXDilation: 3,
      touchAreaYDilation: 6
    } );
    zoomControl.addChild( zoomInButton );

    // Watch the zoom Property and update transform Property accordingly
    zoomProperty.link( function( zoomFactor ) {
      transformProperty.set( ModelViewTransform2.createSinglePointScaleInvertedYMapping(
        Vector2.ZERO,
        ProjectileMotionConstants.VIEW_ORIGIN,
        DEFAULT_SCALE * zoomFactor // scale for meters to view units, with zoom taken into consideration
      ) );

      zoomOutButton.setEnabled( zoomFactor > MIN_ZOOM );
      zoomInButton.setEnabled( zoomFactor < MAX_ZOOM );
    } );

    // Zooming out means bars and zoom level gets smaller.
    zoomOutButton.addListener( function() {
      zoomProperty.value *= 0.5;
    } );

    // Zooming in means bars and zoom level gets larger.
    zoomInButton.addListener( function() {
      zoomProperty.value *= 2;
    } );


    // toolbox panel contains measuring tape. lab screen will add a tracer tool
    var toolboxPanel = new ToolboxPanel( model.measuringTape, model.tracer, measuringTapeNode, tracerNode, transformProperty );

    // reset all button, also a closure for zoomProperty and measuringTape
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        vectorVisibilityProperties.reset();
        targetNode.reset();
        zoomProperty.reset();
        cannonNode.reset();
      },
      centerY: initialSpeedPanel.centerY,
    } );

    // eraser button
    var eraserButton = new EraserButton( {
      minWidth: 50,
      iconWidth: 30,
      minHeight: 40,
      listener: function() { model.eraseTrajectories(); },
      centerY: initialSpeedPanel.centerY,
      left: initialSpeedPanel.right + 30
    } );

    // fire button
    var fireButton = new FireButton( {
      minWidth: 50,
      iconWidth: 30,
      minHeight: 40,
      listener: function() {
        model.cannonFired();
        cannonNode.flashMuzzle();
      },
      bottom: eraserButton.bottom,
      left: eraserButton.right + X_MARGIN
    } );

    model.fireEnabledProperty.link( function( enable ) {
      fireButton.setEnabled( enable );
    } );

    // play/pause button
    var playPauseButton = new PlayPauseButton( model.isPlayingProperty, {
      radius: 18,
      centerY: initialSpeedPanel.centerY,
      left: fireButton.right + 40, // empirically determined
      touchAreaDilation: 2
    } );

    // step button
    var stepButton = new StepForwardButton( {
      playingProperty: model.isPlayingProperty,
      listener: function() { model.stepModelElements( ProjectileMotionConstants.TIME_PER_DATA_POINT / 1000 ); },
      radius: 12,
      stroke: 'black',
      fill: '#005566',
      centerY: playPauseButton.centerY,
      left: playPauseButton.right + PLAY_CONTROLS_INSET,
      touchAreaDilation: 4
    } );

    // make the play/pause button bigger when it is paused
    var pauseSizeIncreaseFactor = 1.25;
    model.isPlayingProperty.lazyLink( function( isPlaying ) {
      playPauseButton.scale( isPlaying ? ( 1 / pauseSizeIncreaseFactor ) : pauseSizeIncreaseFactor );
    } );

    // sim speed controls
    var normalText = new Text( normalString, {
      font: new PhetFont( 15 ),
      maxWidth: TEXT_MAX_WIDTH,
      stroke: 'rgb( 0, 173, 78 )',
      lineWidth: 0.3
    } );
    var normalMotionRadioBox = new AquaRadioButton( model.speedProperty, 'normal', normalText, { radius: 8 } );

    var slowText = new Text( slowString, {
      font: new PhetFont( 15 ),
      maxWidth: TEXT_MAX_WIDTH,
      stroke: 'rgb( 0, 173, 78 )',
      lineWidth: 0.3
    } );
    var slowMotionRadioBox = new AquaRadioButton( model.speedProperty, 'slow', slowText, { radius: 8 } );

    var speedControl = new VBox( {
      align: 'left',
      spacing: 4,
      centerY: initialSpeedPanel.centerY,
      left: stepButton.right + 2 * PLAY_CONTROLS_INSET,
      children: [ normalMotionRadioBox, slowMotionRadioBox ]
    } );

    // @private for layout convenience
    this.topRightPanel = topRightPanel;
    this.bottomRightPanel = bottomRightPanel;
    this.toolboxPanel = toolboxPanel;
    this.resetAllButton = resetAllButton;
    this.backgroundNode = backgroundNode;
    this.zoomControl = zoomControl;

    // flatirons
    model.altitudeProperty.link( function( altitude ) {
      backgroundNode.showOrHideFlatirons( altitude >= FLATIRONS_RANGE.min && altitude <= FLATIRONS_RANGE.max );
    } );

    // rendering order
    this.setChildren( [
      backgroundNode,
      targetNode,
      davidNode,
      cannonNode,
      trajectoriesLayer,
      initialSpeedPanel,
      bottomRightPanel,
      topRightPanel,
      toolboxPanel,
      fireButton,
      eraserButton,
      speedControl,
      stepButton,
      playPauseButton,
      zoomControl,
      resetAllButton,
      measuringTapeNode,
      tracerNode
    ] );

    // Links in this constructor last for the life time of the sim, so they don't need to be disposed
    // Panels last for the life time of the sim, so their links don't need to be disposed
  }

  projectileMotion.register( 'ProjectileMotionScreenView', ProjectileMotionScreenView );

  return inherit( ScreenView, ProjectileMotionScreenView, {

    /**
     * Layout nodes part of the screen view
     *
     * @param {number} width
     * @param {number} height
     * @override
     */
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

      // call on backgroundNode's function to lay it out
      this.backgroundNode.layout( offsetX, offsetY, width, height, scale );
      
      // layout controls
      this.topRightPanel.right = width / scale - offsetX - X_MARGIN;
      this.topRightPanel.top = Y_MARGIN - offsetY;
      this.bottomRightPanel.setRightTop( this.topRightPanel.rightBottom.plusXY( 0, Y_MARGIN ) );
      this.toolboxPanel.setRightTop( this.topRightPanel.leftTop.minusXY( X_MARGIN, 0 ) );
      this.resetAllButton.right = this.topRightPanel.right;
      this.zoomControl.top = 2 * Y_MARGIN - offsetY;
      this.zoomControl.left = this.layoutBounds.minX + X_MARGIN;

      // set visible bounds, which are different from layout bounds
      this.visibleBoundsProperty.set( new Bounds2( -offsetX, -offsetY, width / scale - offsetX, height / scale - offsetY ) );

    }

  } );
} );

