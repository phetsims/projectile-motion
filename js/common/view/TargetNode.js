// Copyright 2016, University of Colorado Boulder

/**
 * View for the target.
 * X position can change when user drags the cannon, y remains constant (on the ground)
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );

  // constants
  var TARGET_DIAMETER = ProjectileMotionConstants.TARGET_WIDTH;
  var TARGET_HEIGHT = ProjectileMotionConstants.TARGET_HEIGHT;
  var LABEL_OPTIONS = _.defaults( { fill: 'black' }, ProjectileMotionConstants.LABEL_TEXT_OPTIONS );
  var SCREEN_CHANGE_TIME = 1000; // milliseconds
  var TOTAL_Y_CHANGE = 70;
  var TOTAL_SCALE = 1.5;
  var TEXT_BACKGROUND_OPTIONS = {
    fill: 'white',
    stroke: 'lightGray'
  };
  var TEXT_DISPLAY_MARGIN = 2;

  /**
   * @param {Score} score - model of the target and scoring algorithms
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {ScreenView} screenView
   * @constructor
   */
  function TargetNode( score, transformProperty, screenView ) {
    var self = this;
    Node.call( this );

    var targetXProperty = score.targetXProperty;

    var outerCircle = new Circle( 1, { fill: 'red', stroke: 'black', lineWidth: transformProperty.get().viewToModelDeltaX( 1 ) } );
    var middleCircle = new Circle( 2 / 3, { fill: 'white', stroke: 'black', lineWidth: transformProperty.get().viewToModelDeltaX( 0.5 ) } );
    var innerCircle = new Circle( 1 / 3, { fill: 'red', stroke: 'black', lineWidth: transformProperty.get().viewToModelDeltaX( 0.5 ) } );

    // draw target view
    var target = new Node( {
      pickable: true,
      cursor: 'pointer',
      children: [
        outerCircle,
        middleCircle,
        innerCircle
      ]
    } );

    var viewRadius = transformProperty.get().modelToViewDeltaX( TARGET_DIAMETER ) / 2;
    var targetHeightInView = TARGET_HEIGHT / TARGET_DIAMETER * viewRadius;
    target.setScaleMagnitude( viewRadius, targetHeightInView );

    target.center = transformProperty.get().modelToViewPosition( Vector2.createFromPool( score.targetXProperty.get(), 0 ) );

    this.addChild( target );

    // @private variables used in drag handler
    var startPoint;
    var startX;
    var mousePoint;
    var horizontalDragHandler = new SimpleDragHandler( {
      start: function( event ) {
        startPoint = screenView.globalToLocalPoint( event.pointer.point );
        startX = target.centerX; // view units
      },

      drag: function( event ) {
        mousePoint = screenView.globalToLocalPoint( event.pointer.point );
        // mousePoint = target.globalToParentPoint( event.pointer.point );

        // change in x, view units
        var xChange = mousePoint.x - startPoint.x;

        targetXProperty.set( Util.roundSymmetric( transformProperty.get().viewToModelX( Util.clamp( startX + xChange, screenView.layoutBounds.minX, screenView.layoutBounds.maxX ) ) * 10 ) / 10 );
      },

      allowTouchSnag: true
    } );

    // drag target to change horizontal position
    target.addInputListener( horizontalDragHandler );
    
    // text readout for horizontal distance from fire, which is origin, which is base of cannon
    var distanceLabel = new Text( StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { value: Util.toFixed( targetXProperty.get(), 1 ), units: mString } ), LABEL_OPTIONS );

    var backgroundNode = new Rectangle(
        0, // x
        0, // y
        distanceLabel.width * 1.5, // width, widened
        distanceLabel.height + 2 * TEXT_DISPLAY_MARGIN, // height
        _.defaults( { cornerRadius: 1, pickable: true, cursor: 'pointer' }, TEXT_BACKGROUND_OPTIONS )
      );

    this.addChild( backgroundNode );
    this.addChild( distanceLabel );

    // drag text to change horizontal position
    backgroundNode.addInputListener( horizontalDragHandler );

    // @private {Array.<Node>} keeps track of rewardNodes that animate when projectile has scored
    this.rewardNodes = [];

    // listen to model for whether score indicator should be shown
    score.scoredEmitter.addListener( function() {

      var rewardNode = new Node( { children: [
        new StarNode( { x: -30, y: -20 } ),
        new StarNode( { x: 0, y: -30 } ),
        new StarNode( { x: 30, y: -20 } )
      ] } );
      rewardNode.x = target.centerX;
      rewardNode.y = target.centerY;
      self.addChild( rewardNode );
      self.rewardNodes.push( rewardNode );

      // animate the stars to go up, out, and fade
      new TWEEN.Tween( rewardNode ).to( {
        y: target.centerY - TOTAL_Y_CHANGE,
        opacity: 0
      }, SCREEN_CHANGE_TIME ).onUpdate( function() {
        rewardNode.setScaleMagnitude( ( target.centerY - rewardNode.y ) / TOTAL_Y_CHANGE * (TOTAL_SCALE - 1) + 1 );
      }).onComplete( function() {
        if ( self.hasChild( rewardNode ) ) {
          self.rewardNodes.pop( rewardNode );
          self.removeChild( rewardNode );
        }
      } ).start( phet.joist.elapsedTime );

    } );


    var updateHorizontalPosition = function( targetX ) {
      target.centerX = transformProperty.get().modelToViewX( targetX );
      distanceLabel.text = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { value: Util.toFixed( targetXProperty.get(), 1 ), units: mString } );
      backgroundNode.centerX = target.centerX;
      backgroundNode.top = target.bottom + 2;
      distanceLabel.center = backgroundNode.center;
      self.rewardNodes.forEach( function( rewardNode ) {
        rewardNode.x = target.centerX;
      } );
    };
    
    // listen to horizontal position changes
    targetXProperty.link( updateHorizontalPosition );

    transformProperty.link( function( transform ) {
      var viewRadius = transform.modelToViewDeltaX( TARGET_DIAMETER ) / 2;
      target.setScaleMagnitude( viewRadius, targetHeightInView );
      updateHorizontalPosition( targetXProperty.get() );
    } );

    // The node lasts for the lifetime of the sim, so its links/references don't need to be disposed

  }

  projectileMotion.register( 'TargetNode', TargetNode );

  return inherit( Node, TargetNode, {

    /**
     * Remove animations
     * @public
     * @override
     */
    reset: function() {
      var self = this;
      this.rewardNodes.forEach( function ( rewardNode ) {
          if ( self.hasChild( rewardNode ) ) {
            self.removeChild( rewardNode );
          }
      } );
      this.rewardNodes = [];
    }

  } );
} );

