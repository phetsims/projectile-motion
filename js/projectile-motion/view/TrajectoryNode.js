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
  // var Vector2 = require( 'DOT/Vector2' );

  // constants
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

    var transformedBallSize = modelViewTransform.modelToViewDeltaX( trajectory.diameter );

    // node drawn 
    thisNode.projectile = new Rectangle( -transformedBallSize / 2, 0, transformedBallSize, transformedBallSize, {
      x: modelViewTransform.modelToViewX( trajectory.x ),
      y: modelViewTransform.modelToViewY( trajectory.y ),
      fill: COLOR
    } );

    thisNode.addChild( thisNode.projectile );


    thisNode.trajectoryShape = new Shape();
    // thisNode.trajectoryShape.moveToPoint( modelViewTransform.modelToViewPosition( thisNode.projectile.center ) );

    thisNode.trajectoryPath = new Path( thisNode.trajectoryShape, PATH_OPTIONS );

    thisNode.addChild( thisNode.trajectoryPath );

    // watch for if the trajectory changes location
    trajectory.xProperty.lazyLink( function() {
      // if it's going off screen in the model, stop drawing it screen
      // debugger;
      // if (
      //   modelViewTransform.modelToViewX( trajectory.x ) < thisNode.parents[ 0 ].layoutBounds.minX ||
      //   modelViewTransform.modelToViewX( trajectory.x ) > thisNode.parents[ 0 ].layoutBounds.maxX ||
      //   modelViewTransform.modelToViewY( trajectory.y ) < thisNode.parents[ 0 ].layoutBounds.minY ||
      //   modelViewTransform.modelToViewY( trajectory.y ) > thisNode.parents[ 0 ].layoutBounds.maxY
      // ) {
      //   console.log( thisNode.parents[ 0 ].layoutBounds );
      //   return;
      // }
      thisNode.projectile.x = modelViewTransform.modelToViewX( trajectory.x );
      thisNode.projectile.y = modelViewTransform.modelToViewY( trajectory.y );

      // thisNode.trajectoryShape.lineToPoint( thisNode.projectile.center );


    } );

    trajectory.yProperty.lazyLink( function() {
      // if it's going off screen in the model, stop it right before
      // if (
      //   modelViewTransform.modelToViewX( trajectory.x ) < thisNode.parents[ 0 ].layoutBounds.minX ||
      //   modelViewTransform.modelToViewX( trajectory.x ) > thisNode.parents[ 0 ].layoutBounds.maxX ||
      //   modelViewTransform.modelToViewY( trajectory.y ) < thisNode.parents[ 0 ].layoutBounds.minY ||
      //   modelViewTransform.modelToViewY( trajectory.y ) > thisNode.parents[ 0 ].layoutBounds.maxY
      // ) {
      //   // console.log( thisNode.parents[ 0 ].layoutBounds );
      //   return;
      // }
      thisNode.projectile.y = modelViewTransform.modelToViewY( trajectory.y );
      thisNode.projectile.x = modelViewTransform.modelToViewX( trajectory.x );

      // thisNode.trajectoryShape.lineToPoint( thisNode.projectile.center );

    } );

    // trajectory.showPathsProperty.link( function( showPaths ) {
    //   // showPaths tells you if you want to see the path of the projectory
    //   if ( !showPaths ) {
    //     // erase paths
    //     thisNode.trajectoryShape.subpaths = [];
    //   }
    // } );

  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );

