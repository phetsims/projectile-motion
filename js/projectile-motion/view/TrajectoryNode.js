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

  // constants
  var BALL_SIZE = 0.37; // will change, based off pumpkin size in original sim
  var color = 'black';

  /**
   * @param {Particle} particle
   * @param {String|color} color
   * @constructor
   */
  function TrajectoryNode( trajectory, modelViewTransform ) {

    var transformedBallSize = modelViewTransform.modelToViewDeltaX( BALL_SIZE );

    Rectangle.call( this, -transformedBallSize / 2, 0, transformedBallSize, transformedBallSize, {
      x: modelViewTransform.modelToViewX( trajectory.x ),
      y: modelViewTransform.modelToViewY( trajectory.y ),
      fill: color
    } );

    var thisNode = this;
    trajectory.xProperty.link( function( x ) {
      thisNode.x = modelViewTransform.modelToViewX( x );
    } );

    trajectory.yProperty.link( function( y ) {
      thisNode.y = modelViewTransform.modelToViewY( y );
    });
  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Rectangle, TrajectoryNode );
} );