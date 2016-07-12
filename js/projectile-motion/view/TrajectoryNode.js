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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );

  // constants
  var BALL_SIZE = 0.37; // will change, based off pumpkin size in original sim
  var PATH_WIDTH = 1; // arbitrary
  var COLOR = 'black';

  /**
   * @param {Particle} particle
   * @param {String|color} color
   * @constructor
   */
  function TrajectoryNode( trajectory, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    var transformedBallSize = modelViewTransform.modelToViewDeltaX( BALL_SIZE );

    // node drawn 
    this.projectile = new Rectangle( -transformedBallSize / 2, 0, transformedBallSize, transformedBallSize, {
      x: modelViewTransform.modelToViewX( trajectory.x ),
      y: modelViewTransform.modelToViewY( trajectory.y ),
      fill: COLOR
    } );

    thisNode.addChild( this.projectile );

    // watch for if the trajectory changes location
    Property.multilink( [ trajectory.xProperty, trajectory.yProperty ], function( x, y ) {
      // add dot to path
      // should change this to have a better path
      thisNode.addChild( new Circle( PATH_WIDTH / 2, {
        x: modelViewTransform.modelToViewX( x ),
        y: modelViewTransform.modelToViewY( y ),
        fill: COLOR
      } ) );

      // update projectile
      thisNode.projectile.x = modelViewTransform.modelToViewX( x );
      thisNode.projectile.y = modelViewTransform.modelToViewY( y );
      thisNode.projectile.moveToFront();
    } );

    trajectory.showPathsProperty.link( function( showPaths ) {
      // showPaths tells you if you want to see the path of the projectory
      if ( !showPaths ) {
        // erase paths
        thisNode.setChildren( [ thisNode.projectile ] );
      }
    } );

  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );

