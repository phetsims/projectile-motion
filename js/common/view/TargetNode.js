// Copyright 2016, University of Colorado Boulder

/**
 * Cannon view. Angle can change when user drags the cannon
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  // var Util = require( 'DOT/Util' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var TARGET_LENGTH = ProjectileMotionConstants.TARGET_LENGTH;
  var TARGET_WIDTH = 0.5;


  /**
   * @param {Particle} particle
   * @param {String|color} color
   * @constructor
   */
  function TargetNode( targetXProperty, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode );

    thisNode.targetXProperty = targetXProperty;

    // node drawn 
    thisNode.target = new Rectangle(
      0,
      0,
      modelViewTransform.modelToViewDeltaX( TARGET_LENGTH ),
      modelViewTransform.modelToViewDeltaX( TARGET_WIDTH ), {
        fill: 'rgba(255,0,0,0.4)',
        pickable: true,
        cursor: 'pointer'
      }
    );

    thisNode.target.center = modelViewTransform.modelToViewPosition( new Vector2( targetXProperty.value, 0 ) );

    thisNode.addChild( thisNode.target );

    var startPoint;
    var startX;
    var mousePoint;

    // drag the tip of the cannon to change angle
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

    thisNode.distanceLabel = new Text( thisNode.targetXProperty.value.toFixed( 2 ) + ' m', { font: new PhetFont( 14 ) } );
    thisNode.distanceLabel.centerX = thisNode.target.centerX;
    thisNode.distanceLabel.centerY = thisNode.target.centerY + 10;

    thisNode.addChild( thisNode.distanceLabel );

    targetXProperty.link( function( targetX ) {
      thisNode.target.centerX = modelViewTransform.modelToViewX( targetX );
      thisNode.distanceLabel.text = thisNode.targetXProperty.value.toFixed( 2 ) + ' m';
      thisNode.distanceLabel.centerX = thisNode.target.centerX;
      thisNode.distanceLabel.centerY = thisNode.target.centerY + 20;
    } );

  }

  projectileMotion.register( 'TargetNode', TargetNode );

  return inherit( Node, TargetNode );
} );

