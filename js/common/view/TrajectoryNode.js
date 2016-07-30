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
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Vector2 = require( 'DOT/Vector2' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );

  // constants
  var MAX_COUNT = ProjectileMotionConstants.MAX_NUMBER_OF_PROJECTILES;
  var DOT_DIAMETER = 4;
  var PATH_WIDTH = 2;
  var CURRENT_PATH_COLOR = 'blue';
  var OLD_PATH_COLOR = 'gray';

  /**
   * @param {Projectile} projectile - model for the projectile
   * @constructor
   */
  function TrajectoryNode( projectile, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    var trajectoryShape = new Shape();

    // TODO: make line width smaller or change color to gray if it is no longer the current trajectory
    var trajectoryPath = new Path( trajectoryShape, { lineWidth: PATH_WIDTH, stroke: CURRENT_PATH_COLOR } );
    thisNode.addChild( trajectoryPath );

    var viewLastPoint;

    function handleDataPointAdded( addedPoint ) {
      var viewAddedPoint = modelViewTransform.modelToViewPosition( new Vector2( addedPoint.x, addedPoint.y ) );

      if ( viewLastPoint ) {
        trajectoryShape.moveTo( viewLastPoint.x, viewLastPoint.y );
        trajectoryShape.lineTo( viewAddedPoint.x, viewAddedPoint.y );
      }
      viewLastPoint = viewAddedPoint.copy();

      // TODO: change color of dot if air resistance was on. May have to add something in model.
      // Create and add the view representation for each datapoint.
      // TODO: pull out datapoint radius into constants

      // draw dot if it is time for data point should be shown
      if ( ( addedPoint.time * 1000 ).toFixed( 0 ) % ProjectileMotionConstants.TIME_PER_SHOWN_POINT === 0 ) {
        var addedPointNode = new Circle( DOT_DIAMETER / 2, {
          x: modelViewTransform.modelToViewX( addedPoint.x ),
          y: modelViewTransform.modelToViewY( addedPoint.y ),
          fill: 'black'
        } );
        thisNode.addChild( addedPointNode );
      }

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

    // change color and decrease in opacity which each success next projectile fired
    projectile.projectilesInModelAfterSelfFiredCountProperty.link( function( count ) {
      if ( count > 0 ) {
        var opacity = ( MAX_COUNT - count ) / MAX_COUNT;
        trajectoryPath.stroke = OLD_PATH_COLOR;
        thisNode.children.forEach( function( child ) {
          child.opacity = opacity;
        } );
      }
    } );
  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );

