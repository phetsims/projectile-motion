// Copyright 2016-2023, University of Colorado Boulder

/**
 * View for the target.
 * X position can change when user drags the cannon, y remains constant (on the ground)
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import { Circle, DragListener, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import Target from '../model/Target.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';

const mString = ProjectileMotionStrings.m;
const pattern0Value1UnitsWithSpaceString = ProjectileMotionStrings.pattern0Value1UnitsWithSpace;

// constants
const TARGET_DIAMETER = ProjectileMotionConstants.TARGET_WIDTH;
const TARGET_HEIGHT = ProjectileMotionConstants.TARGET_HEIGHT;
const REWARD_NODE_INITIAL_Y_OFFSET = -10; // in screen coords
const REWARD_NODE_Y_MOVEMENT = 70; // in screen coords
const REWARD_NODE_GROWTH_AMOUNT = 0.5; // scale factor, larger = more growth

type SelfOptions = EmptySelfOptions;

type TargetNodeOptions = SelfOptions & NodeOptions;

class TargetNode extends Node {

  // for coordinate transforms as well as adding the stars as children
  private readonly screenView: ScreenView;

  // local var to improve readability
  private readonly positionProperty: NumberProperty;
  private readonly transformProperty: Property<ModelViewTransform2>;

  // keeps track of rewardNodes that animate when projectile has scored
  private rewardNodes: Node[];

  public constructor( target: Target, transformProperty: Property<ModelViewTransform2>, screenView: ScreenView, providedOptions?: TargetNodeOptions ) {

    const options = optionize<TargetNodeOptions, SelfOptions, NodeOptions>()( {
      phetioInputEnabledPropertyInstrumented: true,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    this.screenView = screenView;
    this.positionProperty = target.positionProperty;
    this.transformProperty = transformProperty;

    // red and white circles of the target
    const outerCircle = new Circle( 1, {
      fill: 'red',
      stroke: 'black',
      lineWidth: this.transformProperty.get().viewToModelDeltaX( 1 )
    } );
    const middleCircle = new Circle( 2 / 3, {
      fill: 'white',
      stroke: 'black',
      lineWidth: this.transformProperty.get().viewToModelDeltaX( 0.5 )
    } );
    const innerCircle = new Circle( 1 / 3, {
      fill: 'red',
      stroke: 'black',
      lineWidth: this.transformProperty.get().viewToModelDeltaX( 0.5 )
    } );

    // target view
    const targetView = new Node( {
      pickable: true,
      cursor: 'pointer',
      children: [ outerCircle, middleCircle, innerCircle ]
    } );

    // scaling the target to the right size
    const viewRadius = this.transformProperty.get().modelToViewDeltaX( TARGET_DIAMETER ) / 2;
    const targetHeightInView = TARGET_HEIGHT / TARGET_DIAMETER * viewRadius;
    targetView.setScaleMagnitude( viewRadius, targetHeightInView );

    // center on model's positionProperty
    targetView.center = this.transformProperty.get().modelToViewPosition( Vector2.pool.create( this.positionProperty.get(), 0 ) );

    // add target to scene graph
    this.addChild( targetView );

    // variables used in drag handler
    let startPoint: Vector2;
    let startX: number;
    let mousePoint;
    const horizontalDragHandler = new DragListener( {
      start: event => {
        startPoint = screenView.globalToLocalPoint( event.pointer.point );
        startX = targetView.centerX; // view units
      },

      drag: event => {
        mousePoint = screenView.globalToLocalPoint( event.pointer.point );

        // change in x, view units
        const xChange = mousePoint.x - startPoint.x;

        const newTargetX = Utils.roundSymmetric( this.transformProperty.get().viewToModelX( startX + xChange ) * 10 ) / 10;
        this.positionProperty.set( Utils.clamp( newTargetX, this.positionProperty.range.min, this.positionProperty.range.max ) );
      },

      allowTouchSnag: true,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );

    // drag target to change horizontal position
    targetView.addInputListener( horizontalDragHandler );

    // update the range based on the current transform
    this.updateTargetXRange( this.transformProperty.get() );

    // text readout for horizontal distance from fire, which is origin, which is base of cannon
    const distancePattern = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: mString } );
    const distanceLabel = new NumberDisplay(
      this.positionProperty,
      this.positionProperty.range,
      combineOptions<NumberDisplayOptions>( {}, ProjectileMotionConstants.NUMBER_DISPLAY_OPTIONS, {
        textOptions: {
          fill: 'black'
        },
        valuePattern: distancePattern,
        xMargin: 10.5,
        yMargin: 2,
        decimalPlaces: 1,
        cursor: 'pointer',
        tandem: options.tandem.createTandem( 'numberDisplay' ),
        phetioDocumentation: 'The number display in model coordinates of how far the cannon is from the target'
      } )
    );

    this.addChild( distanceLabel );

    // drag text to change horizontal position
    distanceLabel.addInputListener( horizontalDragHandler );

    this.rewardNodes = [];

    // listen to model for whether target indicator should be shown
    target.scoredEmitter.addListener( numberOfStars => {

      let rewardNode: Node;
      if ( numberOfStars === 1 ) {
        rewardNode = new Node( {
          children: [
            new StarNode( { x: 0, y: -30 } )
          ]
        } );
      }
      else if ( numberOfStars === 2 ) {
        rewardNode = new Node( {
          children: [
            new StarNode( { x: -20, y: -20 } ),
            new StarNode( { x: 20, y: -20 } )
          ]
        } );
      }
      else {
        assert && assert( numberOfStars === 3, '3 stars expected here' );
        rewardNode = new Node( {
          children: [
            new StarNode( { x: -30, y: -20 } ),
            new StarNode( { x: 0, y: -30 } ),
            new StarNode( { x: 30, y: -20 } )
          ]
        } );
      }
      const rewardNodeStartPosition = new Vector2( targetView.centerX, targetView.centerY + REWARD_NODE_INITIAL_Y_OFFSET );
      rewardNode.center = rewardNodeStartPosition;
      screenView.addChild( rewardNode );
      this.rewardNodes.push( rewardNode );

      // animate the reward node (one to three stars) to move up, expand, and fade out
      const rewardNodeAnimation = new Animation( {
        duration: 1,
        easing: Easing.QUADRATIC_OUT,
        setValue: ( newYPos: number ) => {
          rewardNode.centerY = newYPos;
          const animationProportionCompleted = Math.abs( newYPos - rewardNodeStartPosition.y ) / REWARD_NODE_Y_MOVEMENT;
          rewardNode.opacity = 1 - animationProportionCompleted;
          rewardNode.setScaleMagnitude( 1 + ( animationProportionCompleted * REWARD_NODE_GROWTH_AMOUNT ) );
        },
        from: rewardNodeStartPosition.y,
        to: rewardNodeStartPosition.y - REWARD_NODE_Y_MOVEMENT
      } );

      // remove the reward node when the animation finishes
      rewardNodeAnimation.finishEmitter.addListener( () => {
        this.rewardNodes.splice( this.rewardNodes.indexOf( rewardNode ), 1 );
        rewardNode.dispose();
      } );

      // kick off the animation
      rewardNodeAnimation.start();
    } );

    // Observe changes in the model horizontal position and update the view correspondingly
    const updateHorizontalPosition = ( targetX: number ) => {
      targetView.centerX = this.transformProperty.get().modelToViewX( targetX );
      distanceLabel.centerX = targetView.centerX;
      distanceLabel.top = targetView.bottom + 2;
      this.rewardNodes.forEach( rewardNode => {
        rewardNode.x = targetView.centerX;
      } );
    };

    this.positionProperty.link( updateHorizontalPosition );

    // Observe changes in the modelViewTransform and update the view
    this.transformProperty.link( transform => {
      this.updateTargetXRange( transform );
      const viewRadius = transform.modelToViewDeltaX( TARGET_DIAMETER ) / 2;
      targetView.setScaleMagnitude( viewRadius, targetHeightInView );
      updateHorizontalPosition( this.positionProperty.get() );
    } );

    // The node lasts for the lifetime of the sim, so its links/references don't need to be disposed

  }

  private updateTargetXRange( transform: ModelViewTransform2 ): void {

    const newRange = new Range(
      transform.viewToModelX( this.screenView.layoutBounds.minX ),
      transform.viewToModelX( this.screenView.layoutBounds.maxX )
    );
    this.positionProperty.setValueAndRange( Utils.clamp( this.positionProperty.value, newRange.min, newRange.max ), newRange );
  }

  /**
   * Remove animations
   */
  public reset(): void {
    this.rewardNodes.forEach( rewardNode => {
      if ( this.screenView.hasChild( rewardNode ) ) {
        this.screenView.removeChild( rewardNode );
      }
    } );
    this.rewardNodes = [];

    // reset the range of the target
    this.updateTargetXRange( this.transformProperty.value );
  }
}

projectileMotion.register( 'TargetNode', TargetNode );

export default TargetNode;