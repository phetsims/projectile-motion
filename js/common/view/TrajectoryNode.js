// Copyright 2016, University of Colorado Boulder

/**
 * View for a trajectory.
 * Listens to an observable array in the model to draw dots on the trajectory.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  /**
   * @param {Projectile} projectile - model for the projectile
   * @constructor
   */
  function TrajectoryNode( projectile, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    function handleDataPointAdded( addedPoint ) {
      // Create and add the view representation for this projectile.
      var addedPointNode = new Circle( 1, {
        x: modelViewTransform.modelToViewX( addedPoint.x ),
        y: modelViewTransform.modelToViewY( addedPoint.y ),
        fill: 'black'
      } );
      thisNode.addChild( addedPointNode );

      // Add the removal listener for if and when this datapoint is removed from the model.
      projectile.dataPoints.addItemRemovedListener( function removalListener( removedTrajectory ) {
        if ( removedTrajectory === addedPoint ) {
          thisNode.removeChild( addedPointNode );
          projectile.dataPoints.removeItemRemovedListener( removalListener );
        }
      } );
    }

    // view listens to whether a datapoint has been added in the model
    projectile.dataPoints.forEach( handleDataPointAdded );
    projectile.dataPoints.addItemAddedListener( handleDataPointAdded );
  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );

