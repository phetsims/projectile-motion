// Copyright 2016-2020, University of Colorado Boulder

/**
 * View for a trajectory.
 * Listens to an observable array of DataPoints in the model to draw dots on the trajectory
 * Creates and contains projectileNodes
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import ProjectileNode from './ProjectileNode.js';

// constants
const MAX_TRAJECTORY_COUNT = ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES;

const PATH_WIDTH = ProjectileMotionConstants.PATH_WIDTH; // view units
const PATH_MIN_OPACITY = 0;
const PATH_MAX_OPACITY = 1;
const AIR_RESISTANCE_OFF_PATH_COLOR = ProjectileMotionConstants.AIR_RESISTANCE_OFF_PATH_COLOR;
const AIR_RESISTANCE_ON_COLOR = ProjectileMotionConstants.AIR_RESISTANCE_ON_PATH_COLOR;

const SMALL_DOT_RADIUS = ProjectileMotionConstants.SMALL_DOT_RADIUS; // view units
const LARGE_DOT_RADIUS = ProjectileMotionConstants.LARGE_DOT_RADIUS; // view units
const DOTS_MIN_OPACITY = 0;
const DOTS_MAX_OPACITY = 0.5;
const TIME_PER_MINOR_DOT = ProjectileMotionConstants.TIME_PER_MINOR_DOT; // milliseconds
const TIME_PER_MAJOR_DOT = ProjectileMotionConstants.TIME_PER_MAJOR_DOT; // milliseconds

const DOT_GREEN = 'rgb( 50, 255, 50 )';

/**
 * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown,
 * only needed to pass down to ProjectileNode
 * @param {Trajectory} trajectory - model for the trajectory
 * @param {Property.<ModelViewTransform2>} transformProperty
 * @constructor
 */
function TrajectoryNode( vectorVisibilityProperties,
                         trajectory,
                         transformProperty ) {
  Node.call( this, { pickable: false, preventFit: true } );

  const scratchVector = new Vector2( 0, 0 );
  const scratchVector2 = new Vector2( 0, 0 );

  let currentPathShape = null;
  let currentPathStroke = null;

  const pathsLayer = new Node();
  const projectileNodesLayer = new Node();
  const projectileObjectViewsLayer = new Node();

  let dotsShape = new Shape();
  const dotsPath = new Path( dotsShape, {
    stroke: 'black'
  } );

  this.addChild( projectileObjectViewsLayer );
  this.addChild( pathsLayer );

  const dotsLayer = new Node();
  dotsLayer.addChild( dotsPath );
  this.addChild( dotsLayer );
  this.addChild( projectileNodesLayer );

  let apexDot = null;

  let viewLastPosition = null;

  // add view nodes based on new dataPoints added
  function handleDataPointAdded( addedPoint ) {
    const viewAddedPosition = scratchVector.set( addedPoint.position );
    transformProperty.get().getMatrix().multiplyVector2( viewAddedPosition );
    viewAddedPosition.x = Utils.roundSymmetric( viewAddedPosition.x * 10000 ) / 10000;
    viewAddedPosition.y = Utils.roundSymmetric( viewAddedPosition.y * 10000 ) / 10000;

    if ( viewLastPosition ) {
      const pathStroke = addedPoint.airDensity > 0 ? AIR_RESISTANCE_ON_COLOR : AIR_RESISTANCE_OFF_PATH_COLOR;
      if ( !currentPathShape || currentPathStroke !== pathStroke ) {
        currentPathShape = new Shape().moveTo( viewLastPosition.x, viewLastPosition.y );
        currentPathStroke = pathStroke;
        pathsLayer.addChild( new Path( currentPathShape, {
          lineWidth: PATH_WIDTH,
          stroke: pathStroke
        } ) );
      }
      currentPathShape.lineTo( viewAddedPosition.x, viewAddedPosition.y );
    }
    viewLastPosition = scratchVector2.set( viewAddedPosition );

    // draw dot if it is time for data point should be shown
    const addedPointTimeInMs = Utils.toFixedNumber( addedPoint.time * 1000, 0 );
    if ( addedPointTimeInMs % TIME_PER_MAJOR_DOT === 0 ) {
      dotsShape
        .moveTo( viewAddedPosition.x + LARGE_DOT_RADIUS, viewAddedPosition.y )
        .circle( viewAddedPosition.x, viewAddedPosition.y, LARGE_DOT_RADIUS );
    }
    else if ( addedPointTimeInMs % TIME_PER_MINOR_DOT === 0 ) {
      dotsShape
        .moveTo( viewAddedPosition.x + SMALL_DOT_RADIUS, viewAddedPosition.y )
        .circle( viewAddedPosition.x, viewAddedPosition.y, SMALL_DOT_RADIUS );
    }

    // draw green dot if apex
    if ( addedPoint.apex ) {
      apexDot = new Circle( SMALL_DOT_RADIUS + 0.3, {
        x: viewAddedPosition.x,
        y: viewAddedPosition.y,
        fill: DOT_GREEN,
        stroke: 'black',
        lineWidth: 0.3
      } );
      dotsLayer.addChild( apexDot );
    }
  }

  // view listens to whether a datapoint has been added in the model
  trajectory.dataPoints.forEach( handleDataPointAdded );
  trajectory.dataPoints.addItemAddedListener( handleDataPointAdded );

  // Update view based on new projectile objects added
  function handleProjectileObjectAdded( addedProjectileObject ) {
    const newProjectileNode = new ProjectileNode(
      vectorVisibilityProperties,
      addedProjectileObject.dataPointProperty,
      trajectory.projectileObjectType,
      trajectory.diameter,
      trajectory.dragCoefficient,
      transformProperty.get()
    );
    projectileNodesLayer.addChild( newProjectileNode );
    projectileObjectViewsLayer.addChild( newProjectileNode.projectileViewLayer );

    // Add the removal listener for if and when this trajectory is removed from the model.
    trajectory.projectileObjects.addItemRemovedListener( function removalListener( removedProjectileObject ) {
      if ( removedProjectileObject === addedProjectileObject ) {
        newProjectileNode.dispose(); // this also removes it as a child from projectileNodesLayer
        trajectory.projectileObjects.removeItemRemovedListener( removalListener );
      }
    } );

  }

  // view adds projectile object if another one is created in the model
  trajectory.projectileObjects.forEach( handleProjectileObjectAdded );
  trajectory.projectileObjects.addItemAddedListener( handleProjectileObjectAdded );

  function updateTransform( transform ) {
    pathsLayer.removeAllChildren();

    currentPathShape = null;
    currentPathStroke = null;

    dotsShape = new Shape();
    dotsPath.shape = dotsShape;
    if ( apexDot ) {
      apexDot.dispose();
    }

    viewLastPosition = null;

    assert && assert( trajectory.dataPoints.get( 0 ).position.x === 0,
      'Initial point x is not zero but ' + trajectory.dataPoints.get( 0 ).position.x
    );

    trajectory.dataPoints.forEach( handleDataPointAdded );
    projectileNodesLayer.removeAllChildren();
    projectileObjectViewsLayer.removeAllChildren();
    trajectory.projectileObjects.forEach( handleProjectileObjectAdded );
  }

  // update if model view transform changes
  transformProperty.lazyLink( updateTransform );

  function updateOpacity( rank ) {
    const strength = ( MAX_TRAJECTORY_COUNT - rank ) / MAX_TRAJECTORY_COUNT;
    pathsLayer.opacity = PATH_MIN_OPACITY + strength * ( PATH_MAX_OPACITY - PATH_MIN_OPACITY );
    projectileNodesLayer.opacity = pathsLayer.opacity;
    dotsPath.opacity = DOTS_MIN_OPACITY + strength * ( DOTS_MAX_OPACITY - DOTS_MIN_OPACITY );
  }

  // change decrease in opacity with each successive projectiled fired
  trajectory.rankProperty.link( updateOpacity );

  this.disposeTrajectoryNode = function() {
    while ( pathsLayer.children.length ) {
      pathsLayer.children.pop().dispose();
    }
    dotsPath.dispose();
    transformProperty.unlink( updateTransform );
    trajectory.rankProperty.unlink( updateOpacity );
  };
}

projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

inherit( Node, TrajectoryNode, {

  /**
   * Dispose this trajectory for memory management
   * @public
   * @override
   */
  dispose: function() {
    this.disposeTrajectoryNode();
    Node.prototype.dispose.call( this );
  }
} );

export default TrajectoryNode;