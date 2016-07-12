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
  var Property = require( 'AXON/Property' );
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

    // node drawn 
    thisNode.projectile = new Rectangle( -transformedBallSize / 2, 0, transformedBallSize, transformedBallSize, {
      x: modelViewTransform.modelToViewX( trajectory.x ),
      y: modelViewTransform.modelToViewY( trajectory.y ),
      fill: COLOR
    } );

    thisNode.addChild( thisNode.projectile );


    thisNode.trajectoryShape = new Shape();
    thisNode.trajectoryShape.moveToPoint( modelViewTransform.modelToViewPosition( Vector2.ZERO ) );

    thisNode.trajectoryPath = new Path( thisNode.trajectoryShape, PATH_OPTIONS );

    thisNode.addChild( thisNode.trajectoryPath );


    // watch for if the trajectory changes location
    Property.multilink( [ trajectory.xProperty, trajectory.yProperty ], function( x, y ) {

      // draw line to trajectory path
      thisNode.trajectoryShape.lineTo( modelViewTransform.modelToViewX( x ), modelViewTransform.modelToViewY( y ) );
        // update projectile
      thisNode.projectile.x = modelViewTransform.modelToViewX( x );
      thisNode.projectile.y = modelViewTransform.modelToViewY( y );
      thisNode.projectile.moveToFront();
    } );

    trajectory.showPathsProperty.link( function( showPaths ) {
      // showPaths tells you if you want to see the path of the projectory
      if ( !showPaths ) {
        // erase paths
        thisNode.trajectoryShape.subpaths = [];
      }
    } );

  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );

