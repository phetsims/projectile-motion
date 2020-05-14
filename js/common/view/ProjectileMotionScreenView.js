// Copyright 2016-2020, University of Colorado Boulder

/**
 * Common view for a screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import platform from '../../../../phet-core/js/platform.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ZoomButton from '../../../../scenery-phet/js/buttons/ZoomButton.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel from '../../../../sun/js/Panel.js';
import davidImage from '../../../images/david_png.js';
import projectileMotion from '../../projectileMotion.js';
import projectileMotionStrings from '../../projectileMotionStrings.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import BackgroundNode from './BackgroundNode.js';
import CannonNode from './CannonNode.js';
import DataProbeNode from './DataProbeNode.js';
import FireButton from './FireButton.js';
import TargetNode from './TargetNode.js';
import ToolboxPanel from './ToolboxPanel.js';
import TrajectoryNode from './TrajectoryNode.js';

const initialSpeedString = projectileMotionStrings.initialSpeed;
const metersPerSecondString = projectileMotionStrings.metersPerSecond;
const metersString = projectileMotionStrings.meters;
const pattern0Value1UnitsWithSpaceString = projectileMotionStrings.pattern0Value1UnitsWithSpace;

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
  const targetNode = new TargetNode( model.score, transformProperty, this, {
    tandem: tandem.createTandem( 'targetNode' ),
    phetioDocumentation: 'The target to aim for when firing a projectile'
  } );

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
    model.trajectoryGroup.elementDisposedEmitter.addListener( function removalListener( removedTrajectory ) {
      if ( removedTrajectory === addedTrajectory ) {
        trajectoryNode.dispose();
        model.trajectoryGroup.elementDisposedEmitter.removeListener( removalListener );
      }
    } );
  }

  // view listens to whether a trajectory has been added in the model
  model.trajectoryGroup.forEach( handleTrajectoryAdded );
  model.trajectoryGroup.elementCreatedEmitter.addListener( handleTrajectoryAdded );

  // cannon
  const cannonNode = new CannonNode( model.cannonHeightProperty, model.cannonAngleProperty, model.muzzleFlashStepper,
    transformProperty, this, tandem.createTandem( 'cannonNode' ), _.omit( options, 'tandem' ) ); // TODO: don't pass all options in

  // results in '{{value}} m/s'
  const valuePattern = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
    units: metersPerSecondString
  } );

  const initialSpeedPanelTandem = tandem.createTandem( 'initialSpeedPanel' );

  // initial speed readout, slider, and tweakers
  const initialSpeedNumberControl = new NumberControl(
    initialSpeedString, model.initialSpeedProperty,
    ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE, {
      titleNodeOptions: {
        font: TEXT_FONT,
        maxWidth: 120 // empirically determined
      },
      numberDisplayOptions: {
        valuePattern: valuePattern,
        align: 'right',
        textOptions: {
          font: TEXT_FONT
        },
        maxWidth: 80 // empirically determined
      },
      sliderOptions: {
        constrainValue: function( value ) { return Utils.roundSymmetric( value ); },
        trackSize: new Dimension2( 120, 0.5 ), // width is empirically determined
        thumbSize: new Dimension2( 13, 22 )
      },
      arrowButtonOptions: {
        scale: 0.56,
        touchAreaXDilation: 20,
        touchAreaYDilation: 20
      },
      tandem: initialSpeedPanelTandem.createTandem( 'numberControl' ),
      phetioDocumentation: 'the control for the initial speed as a projectile leaves the cannon'
    }
  );

  // panel under the cannon, controls initial speed of projectiles
  const initialSpeedPanel = new Panel(
    initialSpeedNumberControl,
    merge( {
      left: this.layoutBounds.left + X_MARGIN,
      bottom: this.layoutBounds.bottom - 10,
      tandem: initialSpeedPanelTandem
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
      tandem: tandem.createTandem( 'measuringTapeNode' ),
      phetioDocumentation: 'the Node for the measuring tape'
    } );

  // {DerivedProperty.<Bounds2>} The measuring tape's drag bounds in model coordinates, constrained
  // so that it remains easily visible and grabbable. Unlike DataProbeNode, MeasuringTapeNode does
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
  const davidNode = new Image( davidImage, { tandem: tandem.createTandem( 'davidNode' ) } );

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

  // add view for dataProbe
  const dataProbeNode = new DataProbeNode( model.dataProbe, transformProperty, this, {
    tandem: tandem.createTandem( 'dataProbeNode' ),
    phetioDocumentation: 'the Node for the dataProbe tool'
  } );

  // zoom Property
  const zoomProperty = new NumberProperty( DEFAULT_ZOOM, {
    tandem: tandem.createTandem( 'zoomProperty' ),
    range: new Range( MIN_ZOOM, MAX_ZOOM ),
    phetioDocumentation: 'Used to adjust to visual zoom for this screen',
    phetioStudioControl: false // see https://github.com/phetsims/projectile-motion/issues/219
  } );

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
    tandem: tandem.createTandem( 'zoomOutButton' ),
    phetioDocumentation: 'the button to zoom out on the cannon'
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
    tandem: tandem.createTandem( 'zoomInButton' ),
    phetioDocumentation: 'the button to zoom in on the cannon'
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


  // toolbox panel contains measuring tape. lab screen will add a dataProbe tool
  const toolboxPanel = new ToolboxPanel( model.measuringTape, model.dataProbe, measuringTapeNode, dataProbeNode, transformProperty, {
    tandem: tandem.createTandem( 'toolboxPanel' ),
    phetioDocumentation: 'the panel that holds the tools when not in the play area'
  } );

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
    tandem: tandem.createTandem( 'resetAllButton' ),
    phetioDocumentation: 'button to reset the entire screen'
  } );

  // eraser button
  const eraserButton = new EraserButton( {
    minWidth: 50,
    iconWidth: 30,
    minHeight: 40,
    listener: function() { model.eraseTrajectories(); },
    centerY: initialSpeedPanel.centerY,
    left: initialSpeedPanel.right + 30,
    tandem: tandem.createTandem( 'eraserButton' ),
    phetioDocumentation: 'button to erase all of the trajectories'
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
    tandem: tandem.createTandem( 'fireButton' ),
    phetioDocumentation: 'button to launch a projectile'
  } );

  model.fireEnabledProperty.link( function( enable ) {
    fireButton.setEnabled( enable );
  } );

  const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
    timeSpeedProperty: model.timeSpeedProperty,
    playPauseStepButtonOptions: {
      playPauseButtonOptions: {
        radius: 18,
        scaleFactorWhenPaused: 1.25,
        touchAreaDilation: 2
      },
      stepForwardButtonOptions: {
        listener: function() { model.stepModelElements( ProjectileMotionConstants.TIME_PER_DATA_POINT / 1000 ); },
        radius: 12,
        stroke: 'black',
        fill: '#005566',
        touchAreaDilation: 4
      }
    },
    speedRadioButtonGroupOptions: {
      labelOptions: {
        font: new PhetFont( 15 ),
        maxWidth: TEXT_MAX_WIDTH,
        stroke: 'rgb( 0, 173, 78 )',
        lineWidth: 0.3
      },
      radioButtonOptions: {
        radius: 8
      }
    },
    buttonGroupXSpacing: 2 * PLAY_CONTROLS_INSET,

    centerY: initialSpeedPanel.centerY,
    left: fireButton.right + 40, // empirically determined
    tandem: tandem.createTandem( 'timeControlNode' )
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
    timeControlNode,
    zoomControl,
    resetAllButton,
    measuringTapeNode,
    dataProbeNode
  ] );

  // Links in this constructor last for the life time of the sim, so they don't need to be disposed
  // Panels last for the life time of the sim, so their links don't need to be disposed
}

projectileMotion.register( 'ProjectileMotionScreenView', ProjectileMotionScreenView );

inherit( ScreenView, ProjectileMotionScreenView, {

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

export default ProjectileMotionScreenView;