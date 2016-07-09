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
  var BALL_SIZE = 10;
  var color = 'black';

  /**
   * @param {Particle} particle
   * @param {String|color} color
   * @constructor
   */
  function TrajectoryNode( trajectory ) {

    Rectangle.call( this, -BALL_SIZE / 2, 0, BALL_SIZE, BALL_SIZE, {
      x: trajectory.x,
      y: trajectory.y,
      fill: color
    } );

    var thisNode = this;
    trajectory.xProperty.link( function( x ) {
      thisNode.x = x;
      console.log( 'linked x ', thisNode.x);
    } );

    trajectory.yProperty.link( function( y ) {
      thisNode.y = y;
      console.log( 'linked y ', thisNode.y);
    });
  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Rectangle, TrajectoryNode );
} );