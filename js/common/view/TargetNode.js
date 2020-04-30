// Copyright 2016-2020, University of Colorado Boulder

/**
 * View for the target.
 * X position can change when user drags the cannon, y remains constant (on the ground)
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import projectileMotionStrings from '../../projectileMotionStrings.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';

const mString = projectileMotionStrings.m;
const pattern0Value1UnitsWithSpaceString = projectileMotionStrings.pattern0Value1UnitsWithSpace;

// constants
const TARGET_DIAMETER = ProjectileMotionConstants.TARGET_WIDTH;
const TARGET_HEIGHT = ProjectileMotionConstants.TARGET_HEIGHT;
const REWARD_NODE_INITIAL_Y_OFFSET = -10; // in screen coords
const REWARD_NODE_Y_MOVEMENT = 70; // in screen coords
const REWARD_NODE_GROWTH_AMOUNT = 0.5; // scale factor, larger = more growth

/**
 * @param {Score} score - model of the target and scoring algorithms
 * @param {Property.<ModelViewTransform2>} transformProperty
 * @param {ScreenView} screenView
 * @param {Object} [options]
 * @constructor
 */
function TargetNode( score, transformProperty, screenView, options ) {
  const self = this;

  options = merge( {
    tandem: Tandem.REQUIRED
  }, options );

  Node.call( this, options );

  // @private for coordinate transforms as well as adding the stars as children
  this.screenView = screenView;

  // @private - local var to improve readability
  this.targetXProperty = score.targetXProperty;

  // red and white circles of the target
  const outerCircle = new Circle( 1, {
    fill: 'red',
    stroke: 'black',
    lineWidth: transformProperty.get().viewToModelDeltaX( 1 )
  } );
  const middleCircle = new Circle( 2 / 3, {
    fill: 'white',
    stroke: 'black',
    lineWidth: transformProperty.get().viewToModelDeltaX( 0.5 )
  } );
  const innerCircle = new Circle( 1 / 3, {
    fill: 'red',
    stroke: 'black',
    lineWidth: transformProperty.get().viewToModelDeltaX( 0.5 )
  } );

  // target view
  const target = new Node( {
    pickable: true,
    cursor: 'pointer',
    children: [
      outerCircle,
      middleCircle,
      innerCircle
    ]
  } );

  // scaling the target to the right size
  const viewRadius = transformProperty.get().modelToViewDeltaX( TARGET_DIAMETER ) / 2;
  const targetHeightInView = TARGET_HEIGHT / TARGET_DIAMETER * viewRadius;
  target.setScaleMagnitude( viewRadius, targetHeightInView );

  // center on model's targetXProperty
  target.center = transformProperty.get().modelToViewPosition( Vector2.createFromPool( this.targetXProperty.get(), 0 ) );

  // add target to scene graph
  this.addChild( target );

  // @private variables used in drag handler
  let startPoint;
  let startX;
  let mousePoint;
  const horizontalDragHandler = new DragListener( {
    start: event => {
      startPoint = screenView.globalToLocalPoint( event.pointer.point );
      startX = target.centerX; // view units
    },

    drag: event => {
      mousePoint = screenView.globalToLocalPoint( event.pointer.point );

      // change in x, view units
      const xChange = mousePoint.x - startPoint.x;

      const newTargetX = Utils.roundSymmetric( transformProperty.get().viewToModelX( startX + xChange ) * 10 ) / 10;
      this.targetXProperty.set( Utils.clamp( newTargetX, this.targetXProperty.range.min, this.targetXProperty.range.max ) );
    },

    allowTouchSnag: true,
    tandem: options.tandem.createTandem( 'dragListener' ),
    phetioDocumentation: 'The listener to drag the score, this can only drag in a horizontal angle'
  } );

  // drag target to change horizontal position
  target.addInputListener( horizontalDragHandler );

  // update the range based on the current transform
  this.updateTargetXRange( transformProperty.get() );

  // text readout for horizontal distance from fire, which is origin, which is base of cannon
  const distancePattern = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: mString } );
  const distanceLabel = new NumberDisplay(
    this.targetXProperty,
    this.targetXProperty.range,
    merge( {}, ProjectileMotionConstants.NUMBER_DISPLAY_OPTIONS, {
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

  // @private {Array.<Node>} keeps track of rewardNodes that animate when projectile has scored
  this.rewardNodes = [];

  // listen to model for whether score indicator should be shown
  score.scoredEmitter.addListener( function( numberOfStars ) {

    if ( numberOfStars === 1 ) {
      var rewardNode = new Node( {
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
    const rewardNodeStartPosition = new Vector2( target.centerX, target.centerY + REWARD_NODE_INITIAL_Y_OFFSET );
    rewardNode.center = rewardNodeStartPosition;
    screenView.addChild( rewardNode );
    self.rewardNodes.push( rewardNode );

    // animate the reward node (one to three stars) to move up, expand, and fade out
    const rewardNodeAnimation = new Animation( {
      duration: 1,
      easing: Easing.QUADRATIC_OUT,
      setValue: function( newYPos ) {
        rewardNode.centerY = newYPos;
        const animationProportionCompleted = Math.abs( newYPos - rewardNodeStartPosition.y ) / REWARD_NODE_Y_MOVEMENT;
        rewardNode.opacity = 1 - animationProportionCompleted;
        rewardNode.setScaleMagnitude( 1 + ( animationProportionCompleted * REWARD_NODE_GROWTH_AMOUNT ) );
      },
      from: rewardNodeStartPosition.y,
      to: rewardNodeStartPosition.y - REWARD_NODE_Y_MOVEMENT
    } );

    // remove the reward node when the animation finishes
    rewardNodeAnimation.finishEmitter.addListener( function() {
      self.rewardNodes.splice( self.rewardNodes.indexOf( rewardNode ), 1 );
      rewardNode.dispose();
    } );

    // kick off the animation
    rewardNodeAnimation.start();
  } );

  // Observe changes in the model horizontal position and update the view correspondingly
  const updateHorizontalPosition = function( targetX ) {
    target.centerX = transformProperty.get().modelToViewX( targetX );
    distanceLabel.centerX = target.centerX;
    distanceLabel.top = target.bottom + 2;
    self.rewardNodes.forEach( function( rewardNode ) {
      rewardNode.x = target.centerX;
    } );
  };

  this.targetXProperty.link( updateHorizontalPosition );

  // Observe changes in the modelViewTransform and update the view
  transformProperty.link( transform => {
    this.updateTargetXRange( transform );
    const viewRadius = transform.modelToViewDeltaX( TARGET_DIAMETER ) / 2;
    target.setScaleMagnitude( viewRadius, targetHeightInView );
    updateHorizontalPosition( this.targetXProperty.get() );
  } );

  // The node lasts for the lifetime of the sim, so its links/references don't need to be disposed

}

projectileMotion.register( 'TargetNode', TargetNode );

inherit( Node, TargetNode, {

  /**
   * @private
   * @param {ModelViewTransform2} transform
   */
  updateTargetXRange: function( transform ) {

    const newRange = new Range(
      transform.viewToModelX( this.screenView.layoutBounds.minX ),
      transform.viewToModelX( this.screenView.layoutBounds.maxX )
    );
    this.targetXProperty.setValueAndRange( Utils.clamp( this.targetXProperty.value, newRange.min, newRange.max ), newRange );
  },

  /**
   * Remove animations
   * @public
   * @override
   */
  reset: function() {
    const self = this;
    this.rewardNodes.forEach( function( rewardNode ) {
      if ( self.screenView.hasChild( rewardNode ) ) {
        self.screenView.removeChild( rewardNode );
      }
    } );
    this.rewardNodes = [];
  }

} );

export default TargetNode;