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

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var metersString = require( 'string!PROJECTILE_MOTION/meters' );

  // constants
  var TARGET_DIAMETER = ProjectileMotionConstants.TARGET_WIDTH;
  var TARGET_HEIGHT = ProjectileMotionConstants.TARGET_HEIGHT;
  var LABEL_OPTIONS = _.defaults( { fill: 'white' }, ProjectileMotionConstants.LABEL_TEXT_OPTIONS );
  var SCREEN_CHANGE_TIME = 1000; // milliseconds
  var TOTAL_Y_CHANGE = 70;
  var TOTAL_SCALE = 1.5;

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

    target.center = transformProperty.get().modelToViewPosition( new Vector2( score.targetXProperty.get(), 0 ) );

    this.addChild( target );

    // @private variables used in drag handler
    var startPoint;
    var startX;
    var mousePoint;

    // drag target to change horizontal position
    target.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = target.globalToParentPoint( event.pointer.point );
        startX = target.centerX; // view units
      },

      drag: function( event ) {
        mousePoint = screenView.globalToLocalPoint( event.pointer.point );
        // mousePoint = target.globalToParentPoint( event.pointer.point );

        // change in x, view units
        var xChange = mousePoint.x - startPoint.x;

        targetXProperty.set( transformProperty.get().viewToModelX( Util.clamp( startX + xChange, screenView.layoutBounds.minX, screenView.layoutBounds.maxX ) ) );
      }
    } ) );

    // text readout for horizontal distance from fire, which is origin, which is base of cannon
    var distanceLabel = new Text( StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( targetXProperty.get(), 2 ), metersString ), LABEL_OPTIONS );
    this.addChild( distanceLabel );

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
      distanceLabel.text = StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( targetXProperty.get(), 2 ), metersString );
      distanceLabel.centerX = target.centerX;
      distanceLabel.top = target.bottom + 2;
      self.rewardNodes.forEach( function( rewardNode ) {
        rewardNode.x = target.centerX;
      } );
    };

    // listen to horizontal position changes
    score.targetXProperty.link( updateHorizontalPosition );

    transformProperty.link( function() {
      var viewRadius = transformProperty.get().modelToViewDeltaX( TARGET_DIAMETER ) / 2;
      target.setScaleMagnitude( viewRadius, targetHeightInView );
      updateHorizontalPosition( targetXProperty.get() );
    } );

  }

  projectileMotion.register( 'TargetNode', TargetNode );

  return inherit( Node, TargetNode, {

    // @public remove all reward animations
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

