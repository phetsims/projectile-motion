// Copyright 2016-2023, University of Colorado Boulder

/**
 * Cannon view.
 * Angle can change when user drags the cannon tip. Height can change when user drags cannon base.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { Color, DragListener, Image, Line, LinearGradient, Node, NodeOptions, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import cannonBarrelTop_png from '../../../images/cannonBarrelTop_png.js';
import cannonBarrel_png from '../../../mipmaps/cannonBarrel_png.js';
import cannonBaseBottom_png from '../../../mipmaps/cannonBaseBottom_png.js';
import cannonBaseTop_png from '../../../mipmaps/cannonBaseTop_png.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import Property from '../../../../axon/js/Property.js';
import Emitter from '../../../../axon/js/Emitter.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';

// image

const mString = ProjectileMotionStrings.m;
const pattern0Value1UnitsString = ProjectileMotionStrings.pattern0Value1Units;
const pattern0Value1UnitsWithSpaceString = ProjectileMotionStrings.pattern0Value1UnitsWithSpace;

// constants
const CANNON_LENGTH = 4; // empirically determined in model coords
const ELLIPSE_WIDTH = 420; // empirically determined in view coordinates
const ELLIPSE_HEIGHT = 40; // empirically determined in view coordinates
const CYLINDER_DISTANCE_FROM_ORIGIN = 1.3; // empirically determined in model coords as it needs to update each time the mvt changes
const HEIGHT_LEADER_LINE_X = -1.5; // empirically determined in view coords
const CROSSHAIR_LENGTH = 120; // empirically determined in view coords
const ANGLE_RANGE = ProjectileMotionConstants.CANNON_ANGLE_RANGE;
const HEIGHT_RANGE = ProjectileMotionConstants.CANNON_HEIGHT_RANGE;
const LABEL_OPTIONS = ProjectileMotionConstants.LABEL_TEXT_OPTIONS;
const BRIGHT_GRAY_COLOR = new Color( 230, 230, 230, 1 );
const DARK_GRAY_COLOR = new Color( 103, 103, 103, 1 );
const TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.6 )';
const ANGLE_RANGE_MINS = [ 5, -5, -20, -40 ]; // angle range minimums, corresponding to height through their index
const CUEING_ARROW_OPTIONS = {
  fill: 'rgb( 100, 200, 255 )',
  stroke: 'black',
  lineWidth: 1,
  tailWidth: 8,
  headWidth: 14,
  headHeight: 6
};

const MUZZLE_FLASH_SCALE_INITIAL = 0.4;
const MUZZLE_FLASH_SCALE_FINAL = 1.5;
const MUZZLE_FLASH_OPACITY_INITIAL = 1;
const MUZZLE_FLASH_OPACITY_FINAL = 0;
const MUZZLE_FLASH_DURATION = 0.4; //seconds

const DEGREES = MathSymbols.DEGREES;

const opacityLinearFunction = new LinearFunction( 0, 1, MUZZLE_FLASH_OPACITY_INITIAL, MUZZLE_FLASH_OPACITY_FINAL );
const scaleLinearFunction = new LinearFunction( 0, 1, MUZZLE_FLASH_SCALE_INITIAL, MUZZLE_FLASH_SCALE_FINAL );

type SelfOptions = {
  renderer: string | null;
  preciseCannonDelta: boolean;
  tandem?: Tandem;
};

export type CannonNodeOptions = SelfOptions & NodeOptions;

class CannonNode extends Node {
  private isIntroScreen: boolean;
  private heightCueingArrows: Node;
  private muzzleFlashPlaying: boolean;
  private muzzleFlashStage: number;

  public constructor( heightProperty: Property<number>, angleProperty: Property<number>, muzzleFlashStepper: Emitter<number[]>,
                      transformProperty: Property<ModelViewTransform2>, screenView: ScreenView, providedOptions?: CannonNodeOptions ) {

    const options = optionize<CannonNodeOptions, SelfOptions, NodeOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    // where the projectile is fired from
    const viewOrigin = transformProperty.value.modelToViewPosition( new Vector2( 0, 0 ) );

    // the cannon, muzzle flash, and pedestal are not visible underground
    const clipContainer = new Node(); // no transform, just for clip area

    const cylinderNode = new Node( {
      y: viewOrigin.y
    } );
    clipContainer.addChild( cylinderNode );

    // shape used for ground circle and top of pedestal
    const ellipseShape = Shape.ellipse( 0, 0, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2, 0 );

    // ground circle, which shows the "inside" of the circular hole that the cannon is sitting in
    const groundFill = new LinearGradient( -ELLIPSE_WIDTH / 2, 0, ELLIPSE_WIDTH / 2, 0 )
      .addColorStop( 0.0, 'gray' )
      .addColorStop( 0.3, 'white' )
      .addColorStop( 1, 'gray' );
    const groundCircle = new Path( ellipseShape, {
      y: viewOrigin.y,
      fill: groundFill,
      stroke: BRIGHT_GRAY_COLOR
    } );

    // side of the cylinder
    const sideFill = new LinearGradient( -ELLIPSE_WIDTH / 2, 0, ELLIPSE_WIDTH / 2, 0 )
      .addColorStop( 0.0, DARK_GRAY_COLOR )
      .addColorStop( 0.3, BRIGHT_GRAY_COLOR )
      .addColorStop( 1, DARK_GRAY_COLOR );
    const cylinderSide = new Path( null, { fill: sideFill, stroke: BRIGHT_GRAY_COLOR } );
    cylinderNode.addChild( cylinderSide );

    // top of the cylinder
    const cylinderTop = new Path( ellipseShape, { fill: DARK_GRAY_COLOR, stroke: BRIGHT_GRAY_COLOR } );
    cylinderNode.addChild( cylinderTop );

    // cannon
    const cannonBarrel = new Node( {
      x: viewOrigin.x,
      y: viewOrigin.y
    } );
    clipContainer.addChild( cannonBarrel );

    // A copy of the top part of the cannon barrel to 1) grab and change angle and 2) layout the cannonBarrel
    const cannonBarrelTop = new Image( cannonBarrelTop_png, { centerY: 0, opacity: 0 } );
    const cannonBarrelBase = new Image( cannonBarrel_png, { centerY: 0, right: cannonBarrelTop.right } );

    cannonBarrel.addChild( cannonBarrelBase );
    cannonBarrel.addChild( cannonBarrelTop );

    const cannonBase = new Node( {
      x: viewOrigin.x,
      y: viewOrigin.y
    } );
    clipContainer.addChild( cannonBase );

    const cannonBaseBottom = new Image( cannonBaseBottom_png, { top: 0, centerX: 0 } );
    cannonBase.addChild( cannonBaseBottom );
    const cannonBaseTop = new Image( cannonBaseTop_png, { bottom: 0, centerX: 0 } );
    cannonBase.addChild( cannonBaseTop );

    const viewHeightLeaderLineX = transformProperty.value.modelToViewX( HEIGHT_LEADER_LINE_X );

    // add dashed line for indicating the height
    const heightLeaderLine = new Line(
      viewHeightLeaderLineX,
      viewOrigin.y,
      viewHeightLeaderLineX,
      transformProperty.value.modelToViewY( heightProperty.get() ), {
        stroke: 'black',
        lineDash: [ 5, 5 ]
      }
    );

    // added arrows for indicating height
    const heightLeaderArrows = new ArrowNode(
      viewHeightLeaderLineX,
      viewOrigin.y,
      viewHeightLeaderLineX,
      transformProperty.value.modelToViewY( heightProperty.get() ), {
        headHeight: 5,
        headWidth: 5,
        tailWidth: 0,
        lineWidth: 0,
        doubleHead: true
      }
    );

    // draw the line caps for the height leader line

    const heightLeaderLineTopCap = new Line( -6, 0, 6, 0, {
      stroke: 'black',
      lineWidth: 2
    } );

    const heightLeaderLineBottomCap = new Line( -6, 0, 6, 0, {
      stroke: 'black',
      lineWidth: 2
    } );
    heightLeaderLineBottomCap.x = heightLeaderArrows.tipX;
    heightLeaderLineBottomCap.y = viewOrigin.y;

    // height readout
    const heightLabelBackground = new Rectangle( 0, 0, 0, 0, { fill: TRANSPARENT_WHITE } );
    const heightLabelOptions = merge( {
      pickable: true,
      maxWidth: 40 // empirically determined
    }, LABEL_OPTIONS );
    const heightLabelText = new Text( StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
      value: Utils.toFixedNumber( heightProperty.get(), 2 ),
      units: mString,
      tandem: options.tandem.createTandem( 'heightLabelText' )
    } ), heightLabelOptions );
    heightLabelText.setMouseArea( heightLabelText.bounds.dilatedXY( 8, 10 ) );
    heightLabelText.setTouchArea( heightLabelText.bounds.dilatedXY( 10, 12 ) );
    heightLabelText.centerX = heightLeaderArrows.tipX;

    // cueing arrow for dragging height
    const heightCueingTopArrow = new ArrowNode( 0, -12, 0, -27, CUEING_ARROW_OPTIONS );
    const heightCueingBottomArrow = new ArrowNode( 0, 17, 0, 32, CUEING_ARROW_OPTIONS );
    const heightCueingArrows = new Node( { children: [ heightCueingTopArrow, heightCueingBottomArrow ] } );
    heightCueingArrows.centerX = heightLeaderArrows.tipX;

    this.isIntroScreen = ( heightProperty.initialValue !== 0 );
    this.heightCueingArrows = heightCueingArrows;

    // cueing arrow only visible on intro screen
    heightCueingArrows.visible = this.isIntroScreen;

    // angle indicator
    const angleIndicator = new Node();
    angleIndicator.x = viewOrigin.x; // centered at the origin, independent of the cylinder position

    // crosshair view
    const crosshairShape = new Shape()
      .moveTo( -CROSSHAIR_LENGTH / 4, 0 )
      .lineTo( CROSSHAIR_LENGTH, 0 )
      .moveTo( 0, -CROSSHAIR_LENGTH )
      .lineTo( 0, CROSSHAIR_LENGTH );

    const crosshair = new Path( crosshairShape, { stroke: 'gray' } );
    angleIndicator.addChild( crosshair );

    const darkerCrosshairShape = new Shape()
      .moveTo( -CROSSHAIR_LENGTH / 15, 0 )
      .lineTo( CROSSHAIR_LENGTH / 15, 0 )
      .moveTo( 0, -CROSSHAIR_LENGTH / 15 )
      .lineTo( 0, CROSSHAIR_LENGTH / 15 );

    const darkerCrosshair = new Path( darkerCrosshairShape, { stroke: 'black', lineWidth: 3 } );
    angleIndicator.addChild( darkerCrosshair );

    // view for the angle arc
    const angleArc = new Path( null, { stroke: 'gray' } );
    angleIndicator.addChild( angleArc );

    // angle readout
    const angleLabelBackground = new Rectangle( 0, 0, 0, 0, { fill: TRANSPARENT_WHITE } );
    angleIndicator.addChild( angleLabelBackground );
    const angleLabel = new Text( StringUtils.fillIn( pattern0Value1UnitsString, {
      value: Utils.toFixedNumber( angleProperty.get(), 2 ),
      units: DEGREES
    } ), LABEL_OPTIONS );
    angleLabel.bottom = -5;
    angleLabel.left = CROSSHAIR_LENGTH * 2 / 3 + 10;
    angleIndicator.addChild( angleLabel );

    // muzzle flash

    // the flames are the shape of tear drops
    const tearDropShapeStrength = 3;
    const flameShape = new Shape();
    const radius = 100; // in view coordinates
    flameShape.moveTo( -radius, 0 );
    let t;
    for ( t = Math.PI / 24; t < 2 * Math.PI; t += Math.PI / 24 ) {
      const x = Math.cos( t ) * radius;
      const y = Math.sin( t ) * Math.pow( Math.sin( 0.5 * t ), tearDropShapeStrength ) * radius;
      flameShape.lineTo( x, y );
    }
    flameShape.lineTo( -radius, 0 );

    // create paths based on shape
    const outerFlame = new Path( flameShape, { fill: 'rgb( 255, 255, 0 )', stroke: null } );
    const innerFlame = new Path( flameShape, { fill: 'rgb( 255, 200, 0 )', stroke: null } );
    innerFlame.setScaleMagnitude( 0.7 );
    outerFlame.left = 0;
    innerFlame.left = 0;
    const muzzleFlash = new Node( {
      opacity: 0,
      x: cannonBarrelTop.right,
      y: 0,
      children: [ outerFlame, innerFlame ]
    } );
    cannonBarrel.addChild( muzzleFlash );

    this.muzzleFlashPlaying = false;
    this.muzzleFlashStage = 0; // 0 means animation starting, 1 means animation ended.

    // Listen to the muzzleFlashStepper to step the muzzle flash animation
    muzzleFlashStepper.addListener( ( dt: number ): void => {
      if ( this.muzzleFlashPlaying ) {
        if ( this.muzzleFlashStage < 1 ) {
          const animationPercentComplete = muzzleFlashDurationCompleteToAnimationPercentComplete( this.muzzleFlashStage );
          muzzleFlash.opacity = opacityLinearFunction.evaluate( animationPercentComplete );
          muzzleFlash.setScaleMagnitude( scaleLinearFunction.evaluate( animationPercentComplete ) );
          this.muzzleFlashStage += ( dt / MUZZLE_FLASH_DURATION );
        }
        else {
          muzzleFlash.opacity = MUZZLE_FLASH_OPACITY_FINAL;
          muzzleFlash.setScaleMagnitude( MUZZLE_FLASH_SCALE_FINAL );
          this.muzzleFlashPlaying = false;
        }
      }
    } );

    // rendering order
    this.setChildren( [
      groundCircle,
      clipContainer,
      heightLeaderLine,
      heightLeaderArrows,
      heightLeaderLineTopCap,
      heightLeaderLineBottomCap,
      heightLabelBackground,
      heightLabelText,
      heightCueingArrows,
      angleIndicator
    ] );

    // Observe changes in model angle and update the cannon view
    angleProperty.link( angle => {
      cannonBarrel.setRotation( -angle * Math.PI / 180 );
      const arcShape = angle > 0
                       ? Shape.arc( 0, 0, CROSSHAIR_LENGTH * 2 / 3, 0, -angle * Math.PI / 180, true )
                       : Shape.arc( 0, 0, CROSSHAIR_LENGTH * 2 / 3, 0, -angle * Math.PI / 180 );
      angleArc.setShape( arcShape );
      angleLabel.string = StringUtils.fillIn( pattern0Value1UnitsString, {
        value: Utils.toFixedNumber( angleProperty.get(), 2 ),
        units: DEGREES
      } );
      angleLabelBackground.setRectWidth( angleLabel.width + 2 );
      angleLabelBackground.setRectHeight( angleLabel.height );
      angleLabelBackground.center = angleLabel.center;
    } );

    // starts at 1, but is updated by modelViewTransform.
    let scaleMagnitude = 1;

    // Function to transform everything to the right height
    const updateHeight = ( height: number ) => {
      const viewHeightPoint = Vector2.pool.create( 0, transformProperty.value.modelToViewY( height ) );
      const heightInClipCoordinates = this.globalToLocalPoint( screenView.localToGlobalPoint( viewHeightPoint ) ).y;

      cannonBarrel.y = heightInClipCoordinates;
      cannonBase.y = heightInClipCoordinates;

      // The cannonBase and cylinder are siblings, so transform into the same coordinate frame.
      cylinderTop.y = cylinderNode.parentToLocalPoint( viewHeightPoint.setY( cannonBase.bottom ) ).y - ELLIPSE_HEIGHT / 4;
      viewHeightPoint.freeToPool();

      const sideShape = new Shape();
      sideShape.moveTo( -ELLIPSE_WIDTH / 2, 0 )
        .lineTo( -ELLIPSE_WIDTH / 2, cylinderTop.y )
        .ellipticalArc( 0, cylinderTop.y, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2, 0, Math.PI, 0, true )
        .lineTo( ELLIPSE_WIDTH / 2, 0 )
        .ellipticalArc( 0, 0, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2, 0, 0, Math.PI, false )
        .close();
      cylinderSide.setShape( sideShape );

      const clipArea = new Shape();
      clipArea.moveTo( -ELLIPSE_WIDTH / 2, 0 )
        .lineTo( -ELLIPSE_WIDTH / 2, -ELLIPSE_WIDTH * 50 ) // high enough to include how high the cannon could be
        .lineTo( ELLIPSE_WIDTH * 2, -ELLIPSE_WIDTH * 50 ) // high enough to include how high the cannon could be
        .lineTo( ELLIPSE_WIDTH * 2, 0 )
        .lineTo( ELLIPSE_WIDTH / 2, 0 )
        .ellipticalArc( 0, 0, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2, 0, 0, Math.PI, false )
        .close();

      // this shape is made in the context of the cylinder, so transform it to match the cylinder's transform.
      // This doesn't need to happen ever again because the clipContainer is the parent to all Nodes that are updated on
      // layout change.
      clipContainer.setClipArea( clipArea.transformed( cylinderNode.matrix ) );

      heightLeaderArrows.setTailAndTip(
        heightLeaderArrows.tailX,
        heightLeaderArrows.tailY,
        heightLeaderArrows.tipX,
        transformProperty.value.modelToViewY( height )
      );
      heightLeaderLine.setLine( heightLeaderArrows.tailX, heightLeaderArrows.tailY, heightLeaderArrows.tipX, heightLeaderArrows.tipY );
      heightLeaderLineTopCap.x = heightLeaderArrows.tipX;
      heightLeaderLineTopCap.y = heightLeaderArrows.tipY;
      heightLabelText.string = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        value: Utils.toFixedNumber( height, 2 ),
        units: mString
      } );
      heightLabelText.centerX = heightLeaderArrows.tipX;
      heightLabelText.y = heightLeaderArrows.tipY - 5;
      heightLabelBackground.setRectWidth( heightLabelText.width + 2 );
      heightLabelBackground.setRectHeight( heightLabelText.height );
      heightLabelBackground.center = heightLabelText.center;
      heightCueingArrows.y = heightLabelText.centerY;

      angleIndicator.y = transformProperty.value.modelToViewY( height );
    };

    // Observe changes in model height and update the cannon view
    heightProperty.link( height => {
      updateHeight( height );
      if ( height < 4 && angleProperty.get() < ANGLE_RANGE_MINS[ height ] ) {
        angleProperty.set( ANGLE_RANGE_MINS[ height ] );
      }
    } );

    // Update the layout of cannon Nodes based on the current transform.
    const updateCannonLayout = () => {

      // Scale everything to be based on the cannon barrel.
      scaleMagnitude = transformProperty.value.modelToViewDeltaX( CANNON_LENGTH ) / cannonBarrelTop.width;
      cylinderNode.setScaleMagnitude( scaleMagnitude );
      groundCircle.setScaleMagnitude( scaleMagnitude );
      cannonBarrel.setScaleMagnitude( scaleMagnitude );
      cannonBase.setScaleMagnitude( scaleMagnitude );

      // Transform the cylindrical Nodes over, because they are offset from the orgin.
      const newX = transformProperty.value.modelToViewX( CYLINDER_DISTANCE_FROM_ORIGIN );
      cylinderNode.x = newX;
      groundCircle.x = newX;
    };

    // Observe changes in modelviewtransform and update the view
    transformProperty.link( () => {
      updateCannonLayout();
      updateHeight( heightProperty.get() );
    } );

    // Links in CannonNode last for the lifetime of the sim, so they don't need to be disposed

    // variables used for drag listeners
    let startPoint: Vector2;
    let startAngle: number;
    let startPointAngle: number;
    let mousePoint: Vector2;
    let startHeight: number;

    // drag the tip of the cannon to change angle
    cannonBarrelTop.addInputListener( new DragListener( {
      start: event => {
        startPoint = this.globalToLocalPoint( event.pointer.point );
        startAngle = angleProperty.get(); // degrees

        // find vector angles between mouse drag start and current points, to the base of the cannon
        startPointAngle = Vector2.pool.create(
          startPoint.x - cannonBase.x,
          startPoint.y - transformProperty.get().modelToViewY( heightProperty.get() )
        ).angle;
      },
      drag: event => {
        mousePoint = this.globalToLocalPoint( event.pointer.point );

        const mousePointAngle = Vector2.pool.create(
          mousePoint.x - cannonBase.x,
          mousePoint.y - transformProperty.get().modelToViewY( heightProperty.get() )
        ).angle;
        const angleChange = startPointAngle - mousePointAngle; // radians
        const angleChangeInDegrees = angleChange * 180 / Math.PI; // degrees

        const unboundedNewAngle = startAngle + angleChangeInDegrees;

        const angleRange = heightProperty.get() < 4 ? new Range( ANGLE_RANGE_MINS[ heightProperty.get() ], 90 ) : ANGLE_RANGE;

        // mouse dragged angle is within angle range
        if ( angleRange.contains( unboundedNewAngle ) ) {
          const delta = providedOptions?.preciseCannonDelta ? 1 : 5;
          angleProperty.set( Utils.roundSymmetric( unboundedNewAngle / delta ) * delta );
        }

        // the current, unchanged, angle is closer to max than min
        else if ( angleRange.max + angleRange.min < 2 * angleProperty.get() ) {
          angleProperty.set( angleRange.max );
        }

        // the current, unchanged, angle is closer or same distance to min than max
        else {
          angleProperty.set( angleRange.min );
        }

      },
      useInputListenerCursor: true,
      allowTouchSnag: true,
      tandem: options.tandem.createTandem( 'barrelTopDragListener' ),
      phetioEnabledPropertyInstrumented: true
    } ) );

    // drag listener for controlling the height
    const heightDragListener = new DragListener( {
      start: event => {
        startPoint = this.globalToLocalPoint( event.pointer.point );
        startHeight = transformProperty.value.modelToViewY( heightProperty.get() ); // view units
      },

      drag: event => {
        mousePoint = this.globalToLocalPoint( event.pointer.point );
        const heightChange = mousePoint.y - startPoint.y;

        const unboundedNewHeight = transformProperty.get().viewToModelY( startHeight + heightChange );

        // mouse dragged height is within height range
        if ( HEIGHT_RANGE.contains( unboundedNewHeight ) ) {
          heightProperty.set( Utils.roundSymmetric( unboundedNewHeight ) );
        }
        // the current, unchanged, height is closer to max than min
        else if ( HEIGHT_RANGE.max + HEIGHT_RANGE.min < 2 * heightProperty.get() ) {
          heightProperty.set( HEIGHT_RANGE.max );
        }
        // the current, unchanged, height is closer or same distance to min than max
        else {
          heightProperty.set( HEIGHT_RANGE.min );
        }
      },

      end: () => {
        heightCueingArrows.visible = false;
      },
      useInputListenerCursor: true,
      allowTouchSnag: true,
      tandem: options.tandem.createTandem( 'heightDragListener' ),
      phetioEnabledPropertyInstrumented: true
    } );

    // multiple parts of the cannon can be dragged to change height
    cannonBase.addInputListener( heightDragListener );
    cylinderSide.addInputListener( heightDragListener );
    cylinderTop.addInputListener( heightDragListener );
    cannonBarrelBase.addInputListener( heightDragListener );
    heightLabelText.addInputListener( heightDragListener );
    heightCueingArrows.addInputListener( heightDragListener );

    heightDragListener.enabledProperty.linkAttribute( heightCueingArrows, 'visible' );
  }

  public reset(): void {
    this.muzzleFlashStage = 1;
    this.heightCueingArrows.visible = this.isIntroScreen;
  }

  public flashMuzzle(): void {
    this.muzzleFlashPlaying = true;
    this.muzzleFlashStage = 0;
  }
}

const muzzleFlashDurationCompleteToAnimationPercentComplete = ( timePercentComplete: number ): number => {
  return -Math.pow( 2, -10 * timePercentComplete ) + 1; //easing out function
};

projectileMotion.register( 'CannonNode', CannonNode );

export default CannonNode;
