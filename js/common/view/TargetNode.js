// Copyright 2016, University of Colorado Boulder

/**
 * View for the target. X position can change when user drags the cannon, y remains constant (on the ground)
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TARGET_LENGTH = ProjectileMotionConstants.TARGET_LENGTH;
  var TARGET_WIDTH = ProjectileMotionConstants.TARGET_WIDTH;


  /**
   * @param {Score} scoreModel - model of the target and scoring algorithms
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function TargetNode( scoreModel, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode );

    thisNode.targetXProperty = scoreModel.targetXProperty;

    // draw target view
    thisNode.target = new Rectangle(
      0,
      0,
      modelViewTransform.modelToViewDeltaX( TARGET_LENGTH ),
      modelViewTransform.modelToViewDeltaX( TARGET_WIDTH ), {
        fill: 'rgba( 255, 0, 0, 0.4 )',
        pickable: true,
        cursor: 'pointer'
      }
    );

    thisNode.target.center = modelViewTransform.modelToViewPosition( new Vector2( scoreModel.targetXProperty.value, 0 ) );

    thisNode.addChild( thisNode.target );

    // @private variables used in drag handler
    var startPoint;
    var startX;
    var mousePoint;

    // drag target to change horizontal position
    thisNode.target.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = thisNode.target.globalToParentPoint( event.pointer.point );
        startX = thisNode.target.centerX; // view units
      },

      drag: function( event ) {
        mousePoint = thisNode.target.globalToParentPoint( event.pointer.point );

        // change in x, view units
        var xChange = mousePoint.x - startPoint.x;

        thisNode.targetXProperty.value = modelViewTransform.viewToModelX( startX + xChange );
      }

    } ) );

    // text readout for horizontal distance from fire, which is origin, which is base of cannon
    thisNode.distanceLabel = new Text( thisNode.targetXProperty.value.toFixed( 2 ) + ' m', { font: new PhetFont( 14 ) } );
    thisNode.addChild( thisNode.distanceLabel );

    // score indicator, currently text
    thisNode.scoreIndicator = new Text( 'Score!', { font: new PhetFont( 20 ) } );
    thisNode.addChild( thisNode.scoreIndicator );

    // listen to horizontal position changes
    scoreModel.targetXProperty.link( function( targetX ) {
      thisNode.target.centerX = modelViewTransform.modelToViewX( targetX );
      thisNode.distanceLabel.text = thisNode.targetXProperty.value.toFixed( 2 ) + ' m';
      thisNode.distanceLabel.centerX = thisNode.target.centerX;
      thisNode.distanceLabel.centerY = thisNode.target.centerY + 20;
      thisNode.scoreIndicator.centerX = thisNode.target.centerX + 70;
      thisNode.scoreIndicator.centerY = thisNode.target.centerY;
    } );

    // listen to model for whether score indicator should be shown
    scoreModel.scoreVisibleProperty.link( function( visible ) {
      if ( visible ) {
        thisNode.scoreIndicator.visible = true;
      } else {
        thisNode.scoreIndicator.visible = false;
      }
    } );

  }

  projectileMotion.register( 'TargetNode', TargetNode );

  return inherit( Node, TargetNode );
} );

