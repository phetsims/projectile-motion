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

  /**
   * @param {ObservableArray.<DataPoint>} dataPoints - array of data points on the trajectory
   * @constructor
   */
  function TrajectoryNode( dataPoints, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    var trajectoryShape = new Shape();

    // TODO: make line width smaller or change color to gray if it is no longer the current trajectory
    var trajectoryPath = new Path( trajectoryShape, { lineWidth: 2, stroke: 'blue' } );
    thisNode.addChild( trajectoryPath );

    var viewLastPoint;

    function handleDataPointAdded( addedPoint ) {
      var viewAddedPoint = modelViewTransform.modelToViewPosition( new Vector2( addedPoint.x, addedPoint.y ) );

      if ( viewLastPoint ) {
        trajectoryPath.shape.moveTo( viewLastPoint.x, viewLastPoint.y );
        trajectoryPath.shape.lineTo( viewAddedPoint.x, viewAddedPoint.y );
      }
      viewLastPoint = viewAddedPoint.copy();

      // TODO: change color of dot if air resistance was on. May have to add something in model.
      // Create and add the view representation for each datapoint.
      // TODO: pull out datapoint radius into constants
      var addedPointNode = new Circle( 2, {
        x: modelViewTransform.modelToViewX( addedPoint.x ),
        y: modelViewTransform.modelToViewY( addedPoint.y ),
        fill: 'black'
      } );
      thisNode.addChild( addedPointNode );

      // Add the removal listener for if and when this datapoint is removed from the model.
      dataPoints.addItemRemovedListener( function removalListener( removedTrajectory ) {
        if ( removedTrajectory === addedPoint ) {
          thisNode.removeChild( addedPointNode );
          dataPoints.removeItemRemovedListener( removalListener );
        }
      } );
    }

    // view listens to whether a datapoint has been added in the model
    dataPoints.forEach( handleDataPointAdded );
    dataPoints.addItemAddedListener( handleDataPointAdded );
  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );

