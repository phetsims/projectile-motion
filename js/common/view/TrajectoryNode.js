// Copyright 2016-2022, University of Colorado Boulder

/**
 * View for a trajectory.
 * Listens to an observable array of DataPoints in the model to draw dots on the trajectory
 * Creates and contains projectileNodes
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Circle, Node, Path } from '../../../../scenery/js/imports.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import ProjectileNode from './ProjectileNode.js';

const PATH_WIDTH = ProjectileMotionConstants.PATH_WIDTH; // view units
const PATH_MIN_OPACITY = 0;
const PATH_MAX_OPACITY = 1;
const AIR_RESISTANCE_OFF_PATH_COLOR =
  ProjectileMotionConstants.AIR_RESISTANCE_OFF_PATH_COLOR;
const AIR_RESISTANCE_ON_COLOR =
  ProjectileMotionConstants.AIR_RESISTANCE_ON_PATH_COLOR;

const SMALL_DOT_RADIUS = ProjectileMotionConstants.SMALL_DOT_RADIUS; // view units
const LARGE_DOT_RADIUS = ProjectileMotionConstants.LARGE_DOT_RADIUS; // view units
const DOTS_MIN_OPACITY = 0;
const DOTS_MAX_OPACITY = 0.5;
const TIME_PER_MINOR_DOT = ProjectileMotionConstants.TIME_PER_MINOR_DOT; // milliseconds
const TIME_PER_MAJOR_DOT = ProjectileMotionConstants.TIME_PER_MAJOR_DOT; // milliseconds

const DOT_GREEN = 'rgb( 50, 255, 50 )';

class TrajectoryNode extends Node {
  /**
   * @param {ProjectileMotionViewProperties} viewProperties - Properties that determine which vectors are shown,
   * only needed to pass down to ProjectileNode
   * @param {Trajectory} trajectory - model for the trajectory
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {int} maxNumberOfTrajectories
   * @param {boolean} constantTrajectoryOpacity
   * @param {boolean} showPath - draw the trajectory path
   */
  constructor(
    viewProperties,
    trajectory,
    transformProperty,
    maxNumberOfTrajectories = ProjectileMotionConstants.MAX_TRAJECTORY_COUNT,
    constantTrajectoryOpacity = false,
    showPath = true
  ) {
    super( { pickable: false, preventFit: true } );

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
      if ( !showPath ) {
        return; //do not draw the path if showPath is false
      }

      const viewAddedPosition = scratchVector.set( addedPoint.position );
      transformProperty.get().getMatrix().multiplyVector2( viewAddedPosition );
      viewAddedPosition.x =
        Utils.roundSymmetric( viewAddedPosition.x * 10000 ) / 10000;
      viewAddedPosition.y =
        Utils.roundSymmetric( viewAddedPosition.y * 10000 ) / 10000;

      if ( viewLastPosition ) {
        const pathStroke =
          addedPoint.airDensity > 0
          ? AIR_RESISTANCE_ON_COLOR
          : AIR_RESISTANCE_OFF_PATH_COLOR;
        if ( !currentPathShape || currentPathStroke !== pathStroke ) {
          currentPathShape = new Shape().moveTo(
            viewLastPosition.x,
            viewLastPosition.y
          );
          currentPathStroke = pathStroke;
          pathsLayer.addChild(
            new Path( currentPathShape, {
              lineWidth: PATH_WIDTH,
              stroke: pathStroke
            } )
          );
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

    let projectileNode;

    const addProjectileNode = () => {
      projectileNode && projectileNode.dispose();

      projectileNode = new ProjectileNode(
        viewProperties,
        trajectory.projectileObject.dataPointProperty,
        trajectory.projectileObjectType,
        trajectory.diameter,
        trajectory.dragCoefficient,
        transformProperty.get()
      );
      projectileNodesLayer.addChild( projectileNode );
      projectileObjectViewsLayer.addChild( projectileNode.projectileViewLayer );
    };

    addProjectileNode();

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

      assert &&
      assert(
        trajectory.dataPoints.get( 0 ).position.x === 0,
        `Initial point x is not zero but ${
          trajectory.dataPoints.get( 0 ).position.x
        }`
      );

      trajectory.dataPoints.forEach( handleDataPointAdded );
      projectileNodesLayer.removeAllChildren();
      projectileObjectViewsLayer.removeAllChildren();
      addProjectileNode();
    }

    // update if model view transform changes
    transformProperty.lazyLink( updateTransform );

    function updateOpacity( rank ) {
      //if projectile opacity is set as constant (as in 'stats' screen)
      if ( constantTrajectoryOpacity ) {
        pathsLayer.opacity = 0.1; //MOVE TO CONSTANTS
      }
      else {
        const strength =
          ( maxNumberOfTrajectories - rank ) / maxNumberOfTrajectories;
        pathsLayer.opacity =
          Math.max( PATH_MIN_OPACITY, PATH_MIN_OPACITY + strength * ( PATH_MAX_OPACITY - PATH_MIN_OPACITY ) );
        projectileNodesLayer.opacity = pathsLayer.opacity;
        dotsPath.opacity =
          Math.max( DOTS_MIN_OPACITY, DOTS_MIN_OPACITY + strength * ( DOTS_MAX_OPACITY - DOTS_MIN_OPACITY ) );
      }
    }

    // change decrease in opacity with each successive projectiled fired
    trajectory.rankProperty.link( updateOpacity );

    this.disposeTrajectoryNode = () => {
      while ( pathsLayer.children.length ) {
        pathsLayer.children.pop().dispose();
      }
      dotsPath.dispose();
      projectileNode.dispose();
      transformProperty.unlink( updateTransform );
      trajectory.rankProperty.unlink( updateOpacity );
    };
  }

  /**
   * Dispose this trajectory for memory management
   * @public
   * @override
   */
  dispose() {
    this.disposeTrajectoryNode();
    super.dispose();
  }
}

projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

export default TrajectoryNode;
