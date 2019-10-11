// Copyright 2016-2019, University of Colorado Boulder

/**
 * Common view for a screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const BackgroundNode = require( 'PROJECTILE_MOTION/common/view/BackgroundNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const CannonNode = require( 'PROJECTILE_MOTION/common/view/CannonNode' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  const FireButton = require( 'PROJECTILE_MOTION/common/view/FireButton' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const platform = require( 'PHET_CORE/platform' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const Property = require( 'AXON/Property' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Shape = require( 'KITE/Shape' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const TargetNode = require( 'PROJECTILE_MOTION/common/view/TargetNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ToolboxPanel = require( 'PROJECTILE_MOTION/common/view/ToolboxPanel' );
  const TracerNode = require( 'PROJECTILE_MOTION/common/view/TracerNode' );
  const TrajectoryNode = require( 'PROJECTILE_MOTION/common/view/TrajectoryNode' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );
  const ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // images
  const davidImage = require( 'image!PROJECTILE_MOTION/david.png' );

  // strings
  const initialSpeedString = require( 'string!PROJECTILE_MOTION/initialSpeed' );
  const metersPerSecondString = require( 'string!PROJECTILE_MOTION/metersPerSecond' );
  const metersString = require( 'string!PROJECTILE_MOTION/meters' );
  const normalString = require( 'string!PROJECTILE_MOTION/normal' );
  const pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  const Range = require( 'DOT/Range' );
  const slowString = require( 'string!PROJECTILE_MOTION/slow' );

  // constants
  const DEFAULT_SCALE = 30;
  const MIN_ZOOM = ProjectileMotionConstants.MIN_ZOOM;
  const MAX_ZOOM = ProjectileMotionConstants.MAX_ZOOM;
  const DEFAULT_ZOOM = ProjectileMotionConstants.DEFAULT_ZOOM;
  const TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
  const PLAY_CONTROLS_INSET = ProjectileMotionConstants.PLAY_CONTROLS_HORIZONTAL_INSET;
  const TEXT_MAX_WIDTH = ProjectileMotionConstants.PLAY_CONTROLS_TEXT_MAX_WIDTH;
  const X_MARGIN = 10;
  const Y_MARGIN = 5;
  const FLATIRONS_RANGE = new Range( 1500, 1700 );

  /**
   * @param {ProjectileMotionModel} model
   * @param {Panel} topRightPanel - the projectile control panel at the top right
   * @param {Panel} bottomRightPanel - the vectors control panel at the bottom right
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function ProjectileMotionScreenView( model,
                                       topRightPanel,
                                       bottomRightPanel,
                                       vectorVisibilityProperties,
                                       tandem,
                                       options ) {
    const self = this;

    ScreenView.call( this, options );

    // If on mobile device, don't draw things beyond boundary. For performance.
    if ( platform.mobileSafari ) {
      this.visibleBoundsProperty.link( function( bounds ) {
        self.clipArea = Shape.bounds( bounds );
      } );
    }

    // model view transform
    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      ProjectileMotionConstants.VIEW_ORIGIN,
      DEFAULT_SCALE
    );

    // tracks changes to modelViewTransform
    const transformProperty = new Property( modelViewTransform );

    // target
    const targetNode = new TargetNode( model.score, transformProperty, this, tandem.createTandem( 'targetNode' ) );

    // trajectories layer, so all trajectories are in front of control panel but behind measuring tape
    const trajectoriesLayer = new Node();

    function handleTrajectoryAdded( addedTrajectory ) {

      // create the view representation for added trajectory
      const trajectoryNode = new TrajectoryNode(
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
    const cannonNode = new CannonNode( model.cannonHeightProperty, model.cannonAngleProperty, model.muzzleFlashStepper,
      transformProperty, this, tandem.createTandem( 'cannonNode' ), _.omit( options, 'tandem' ) ); // TODO: don't pass all options in

    // results in '{{value}} m/s'
    const valuePattern = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
      units: metersPerSecondString
    } );

    // initial speed readout, slider, and tweakers
    const initialSpeedControl = new NumberControl(
      initialSpeedString, model.launchVelocityProperty,
      ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE, {
        titleNodeOptions: {
          font: TEXT_FONT,
          maxWidth: 120 // empirically determined
        },
        numberDisplayOptions: {
          valuePattern: valuePattern,
          align: 'right',
          font: TEXT_FONT,
          maxWidth: 80 // empirically determined
        },
        sliderOptions: {
          constrainValue: function( value ) { return Util.roundSymmetric( value ); },
          trackSize: new Dimension2( 120, 0.5 ), // width is empirically determined
          thumbSize: new Dimension2( 13, 22 )
        },
        arrowButtonOptions: {
          scale: 0.56,
          touchAreaXDilation: 20,
          touchAreaYDilation: 20
        },
        tandem: tandem.createTandem( 'initialSpeedControl' )
      },
    );

    // panel under the cannon, controls initial speed of projectiles
    const initialSpeedPanel = new Panel(
      initialSpeedControl,
      _.extend( {
        left: this.layoutBounds.left + X_MARGIN,
        bottom: this.layoutBounds.bottom - 10
      }, ProjectileMotionConstants.INITIAL_SPEED_PANEL_OPTIONS )
    );

    // Create a measuring tape (set to invisible initially)
    const measuringTapeNode = new MeasuringTapeNode(
      new Property( { name: metersString, multiplier: 1 } ),
      model.measuringTape.isActiveProperty, {
        modelViewTransform: transformProperty.get(),
        basePositionProperty: model.measuringTape.basePositionProperty,
        tipPositionProperty: model.measuringTape.tipPositionProperty,
        textColor: 'black',
        textBackgroundColor: 'rgba( 255, 255, 255, 0.6 )', // translucent white background
        significantFigures: 2,
        textFont: new PhetFont( { size: 16, weight: 'bold' } ),
        tandem: tandem.createTandem( 'measuringTapeNode' )
      } );

    // {DerivedProperty.<Bounds2>} The measuring tape's drag bounds in model coordinates, constrained
    // so that it remains easily visible and grabbable. Unlike TracerNode, MeasuringTapeNode does
    // not have dynamic drag bounds, so we need to create out own DerivedProperty and associated listener here.
    // See https://github.com/phetsims/projectile-motion/issues/145.
    const measuringTapeDragBoundsProperty = new DerivedProperty( [ transformProperty, this.visibleBoundsProperty ],
      function( transform, visibleBounds ) {
        return transform.viewToModelBounds( visibleBounds.eroded( 20 ) );
      } );
    // unlink unnecessary
    measuringTapeDragBoundsProperty.link( function( bounds ) {
      measuringTapeNode.setDragBounds( bounds );
    } );

    // David
    const davidNode = new Image( davidImage );

    // background, including grass, road, sky, flatirons
    const backgroundNode = new BackgroundNode( this.layoutBounds );

    // listen to transform Property
    transformProperty.link( function( transform ) {
      measuringTapeNode.setModelViewTransform( transform );
      davidNode.maxHeight = Math.abs( transform.modelToViewDeltaY( model.davidHeight ) );
      davidNode.centerX = transform.modelToViewX( model.davidPosition.x );
      davidNode.bottom = transformProperty.get().modelToViewY( model.davidPosition.y );
      backgroundNode.updateFlatironsPosition( transform );
    } );

    // add view for tracer
    const tracerNode = new TracerNode( model.tracer, transformProperty, this, {
      tandem: tandem.createTandem( 'tracerNode' )
    } );

    // zoom Property
    const zoomProperty = new NumberProperty( DEFAULT_ZOOM );

    // zoom control view
    const zoomControl = new Node();

    const zoomOutButton = new ZoomButton( {
      baseColor: '#E7E8E9',
      radius: 8,
      xMargin: 3,
      yMargin: 3,
      disabledBaseColor: '#EDEDED',
      in: false,
      left: 0,
      top: 0,
      touchAreaXDilation: 3,
      touchAreaYDilation: 6,
      tandem: tandem.createTandem( 'zoomOutButton' )
    } );
    zoomControl.addChild( zoomOutButton );

    const zoomInButton = new ZoomButton( {
      baseColor: '#E7E8E9',
      radius: 8,
      xMargin: 3,
      yMargin: 3,
      disabledBaseColor: '#EDEDED',
      in: true,
      left: zoomOutButton.right + X_MARGIN,
      top: zoomOutButton.top,
      touchAreaXDilation: 3,
      touchAreaYDilation: 6,
      tandem: tandem.createTandem( 'zoomInButton' )
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
    const toolboxPanel = new ToolboxPanel( model.measuringTape, model.tracer, measuringTapeNode, tracerNode, transformProperty );

    // reset all button, also a closure for zoomProperty and measuringTape
    const resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        vectorVisibilityProperties.reset();
        targetNode.reset();
        zoomProperty.reset();
        cannonNode.reset();
      },
      centerY: initialSpeedPanel.centerY,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // eraser button
    const eraserButton = new EraserButton( {
      minWidth: 50,
      iconWidth: 30,
      minHeight: 40,
      listener: function() { model.eraseTrajectories(); },
      centerY: initialSpeedPanel.centerY,
      left: initialSpeedPanel.right + 30,
      tandem: tandem.createTandem( 'eraserButton' )
    } );

    // fire button
    const fireButton = new FireButton( {
      minWidth: 50,
      iconWidth: 30,
      minHeight: 40,
      listener: function() {
        model.cannonFired();
        cannonNode.flashMuzzle();
      },
      bottom: eraserButton.bottom,
      left: eraserButton.right + X_MARGIN,
      tandem: tandem.createTandem( 'fireButton' )
    } );

    model.fireEnabledProperty.link( function( enable ) {
      fireButton.setEnabled( enable );
    } );

    // play/pause button
    const playPauseButton = new PlayPauseButton( model.isPlayingProperty, {
      radius: 18,
      centerY: initialSpeedPanel.centerY,
      left: fireButton.right + 40, // empirically determined
      touchAreaDilation: 2,
      tandem: tandem.createTandem( 'playPauseButton' )
    } );

    // step button
    const stepButton = new StepForwardButton( {
      isPlayingProperty: model.isPlayingProperty,
      listener: function() { model.stepModelElements( ProjectileMotionConstants.TIME_PER_DATA_POINT / 1000 ); },
      radius: 12,
      stroke: 'black',
      fill: '#005566',
      centerY: playPauseButton.centerY,
      left: playPauseButton.right + PLAY_CONTROLS_INSET,
      touchAreaDilation: 4,
      tandem: tandem.createTandem( 'stepButton' )
    } );

    // make the play/pause button bigger when it is paused
    const pauseSizeIncreaseFactor = 1.25;
    model.isPlayingProperty.lazyLink( function( isPlaying ) {
      playPauseButton.scale( isPlaying ? ( 1 / pauseSizeIncreaseFactor ) : pauseSizeIncreaseFactor );
    } );

    // sim speed controls
    const normalText = new Text( normalString, {
      font: new PhetFont( 15 ),
      maxWidth: TEXT_MAX_WIDTH,
      stroke: 'rgb( 0, 173, 78 )',
      lineWidth: 0.3
    } );
    const normalMotionRadioButton = new AquaRadioButton( model.speedProperty, 'normal', normalText, {
      radius: 8,
      tandem: tandem.createTandem( 'normalMotionRadioButton' )
    } );

    const slowText = new Text( slowString, {
      font: new PhetFont( 15 ),
      maxWidth: TEXT_MAX_WIDTH,
      stroke: 'rgb( 0, 173, 78 )',
      lineWidth: 0.3
    } );
    const slowMotionRadioButton = new AquaRadioButton( model.speedProperty, 'slow', slowText, {
      radius: 8,
      tandem: tandem.createTandem( 'slowMotionRadioButton' )
    } );

    // TODO: should use VerticalAquaRadioButtonGroup unless there is a good reason not to
    const speedControl = new VBox( {
      align: 'left',
      spacing: 4,
      centerY: initialSpeedPanel.centerY,
      left: stepButton.right + 2 * PLAY_CONTROLS_INSET,
      children: [ normalMotionRadioButton, slowMotionRadioButton ]
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

      const scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      let offsetX = 0;
      let offsetY = 0;

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

