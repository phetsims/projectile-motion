// Copyright 2016, University of Colorado Boulder

/**
 * Trajectory view.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  // var Property = require( 'AXON/Property' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BALL_SIZE = 0.37; // will change, based off pumpkin size in original sim
  var COLOR = 'black';
  var PATH_OPTIONS = { stroke: 'black', lineWidth: 2 }; // width arbitrary

  /**
   * @param {Particle} particle
   * @param {String|color} color
   * @constructor
   */
  function TrajectoryNode( trajectory, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode, { pickable: false } );
    // debugger;

    var transformedBallSize = modelViewTransform.modelToViewDeltaX( BALL_SIZE );

    // draw projectile
    thisNode.projectile = new Rectangle( -transformedBallSize / 2, 0, transformedBallSize, transformedBallSize, {
      x: modelViewTransform.modelToViewX( trajectory.position.x ),
      y: modelViewTransform.modelToViewY( trajectory.position.y ),
      fill: COLOR
    } );

    thisNode.addChild( thisNode.projectile );

    thisNode.trailingShape = new Shape();
    thisNode.trailingShape.moveToPoint( modelViewTransform.modelToViewPosition( Vector2.ZERO ) );

    thisNode.trailingPath = new Path( thisNode.trailingShape, PATH_OPTIONS );

    thisNode.addChild( thisNode.trailingPath );

    trajectory.positionProperty.lazyLink( function( position ) {
      // if it's going off screen in the model, stop drawing it screen
      if ( position.y < thisNode.parents[0].layoutBounds.minX || position.y > thisNode.parents[0].layoutBounds.maxY ) {
        console.log ( 'caught at edge of screen' );
        return;
      }

      thisNode.projectile.x = modelViewTransform.modelToViewX( position.x );
      thisNode.projectile.y = modelViewTransform.modelToViewY( position.y );

      thisNode.trailingShape.lineTo( 
        modelViewTransform.modelToViewX( position.x ), 
        modelViewTransform.modelToViewY( position.y ) 
        );
    } );

    trajectory.showPathsProperty.link( function( showPaths ) {
      // showPaths tells you if you want to see the path of the projectory
      if ( !showPaths ) {
        // erase paths
        thisNode.trailingShape.subpaths = [];
      }
    } );

  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );

