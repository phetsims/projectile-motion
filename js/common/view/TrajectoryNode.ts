// Copyright 2016-2023, University of Colorado Boulder

/**
 * View for a trajectory.
 * Listens to an observable array of DataPoints in the model to draw dots on the trajectory
 * Creates and contains projectileNodes
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Node, Path } from '../../../../scenery/js/imports.js';
import projectileMotion from '../../projectileMotion.js';
import Trajectory from '../model/Trajectory.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import ProjectileMotionViewProperties from './ProjectileMotionViewProperties.js';
import ProjectileNode from './ProjectileNode.js';
import DataPoint from '../model/DataPoint.js';

const PATH_WIDTH = ProjectileMotionConstants.PATH_WIDTH; // view units
const PATH_MIN_OPACITY = 0.1;
const PATH_MAX_OPACITY = 1;
const AIR_RESISTANCE_OFF_PATH_COLOR = ProjectileMotionConstants.AIR_RESISTANCE_OFF_PATH_COLOR;
const AIR_RESISTANCE_ON_COLOR = ProjectileMotionConstants.AIR_RESISTANCE_ON_PATH_COLOR;

const SMALL_DOT_RADIUS = ProjectileMotionConstants.SMALL_DOT_RADIUS; // view units
const LARGE_DOT_RADIUS = ProjectileMotionConstants.LARGE_DOT_RADIUS; // view units
const DOTS_MIN_OPACITY = 0.1;
const DOTS_MAX_OPACITY = 0.5;
const TIME_PER_MINOR_DOT = ProjectileMotionConstants.TIME_PER_MINOR_DOT; // in ms
const TIME_PER_MAJOR_DOT = ProjectileMotionConstants.TIME_PER_MAJOR_DOT; // in ms

const DOT_GREEN = 'rgb( 50, 255, 50 )';

class TrajectoryNode extends Node {
  private disposeTrajectoryNode: () => void;

  public constructor( viewProperties: ProjectileMotionViewProperties, trajectory: Trajectory, transformProperty: Property<ModelViewTransform2>,
                      maxNumberOfTrajectories: number, showPath: boolean, constantTrajectoryOpacity: boolean ) {
    super( { pickable: false, preventFit: true } );

    // A single Vector2 instance used for each new model DataPoint to save on memory.
    const addedPointViewPosition = new Vector2( 0, 0 );

    // null until after first point is added (nulled out on transform change too).
    let lastViewPosition: Vector2 | null = null;
    let projectileNode: ProjectileNode | null;

    const addProjectileNode = () => {
      projectileNode && projectileNode.dispose();

      projectileNode = new ProjectileNode( viewProperties, trajectory.projectileDataPointProperty, trajectory.projectileObjectType,
        trajectory.diameter, trajectory.dragCoefficient, transformProperty.value );
      this.addChild( projectileNode );
    };

    addProjectileNode();

    let currentPathShape: Shape | null = null;
    let currentPathStroke: string | null = null;

    // Each new Path (created based on change in stroke) will be added as a child to this container.
    const pathsLayer = new Node();

    // Holds all visible data points that can be read with the tool (except the apex point)
    let dotsShape = new Shape();
    const dotsPath = new Path( dotsShape, { stroke: 'black' } );

    this.addChild( pathsLayer );
    this.addChild( dotsPath );

    let apexDot: Circle | null = null;

    // add view nodes based on new dataPoints added
    const handleDataPointAdded = ( addedPoint: DataPoint ): void => {
      if ( !showPath ) {
        return; // do not draw the path if showPath is false
      }

      // To be set by the transform
      addedPointViewPosition.set( addedPoint.position );
      transformProperty.get().getMatrix().multiplyVector2( addedPointViewPosition );
      addedPointViewPosition.x = Utils.roundSymmetric( addedPointViewPosition.x * 10000 ) / 10000;
      addedPointViewPosition.y = Utils.roundSymmetric( addedPointViewPosition.y * 10000 ) / 10000;

      if ( lastViewPosition ) {
        const pathStroke = addedPoint.airDensity > 0 ? AIR_RESISTANCE_ON_COLOR : AIR_RESISTANCE_OFF_PATH_COLOR;

        // Need to create a new Shape/Path because the stroke is different
        if ( !currentPathShape || currentPathStroke !== pathStroke ) {
          currentPathShape = new Shape().moveTo( lastViewPosition.x, lastViewPosition.y );
          currentPathStroke = pathStroke;
          pathsLayer.addChild( new Path( currentPathShape, {
            lineWidth: PATH_WIDTH,
            stroke: pathStroke
          } ) );
        }
        currentPathShape.lineTo( addedPointViewPosition.x, addedPointViewPosition.y );
      }
      else {
        lastViewPosition = new Vector2( 0, 0 );
      }
      lastViewPosition.set( addedPointViewPosition );

      // draw dot if it is time for data point should be shown (in ms)
      const addedPointTime = Utils.toFixedNumber( addedPoint.time * 1000, 0 );
      if ( addedPointTime % TIME_PER_MAJOR_DOT === 0 ) {
        dotsShape.moveTo( addedPointViewPosition.x + LARGE_DOT_RADIUS, addedPointViewPosition.y )
          .circle( addedPointViewPosition.x, addedPointViewPosition.y, LARGE_DOT_RADIUS );
      }
      else if ( addedPointTime % TIME_PER_MINOR_DOT === 0 ) {
        dotsShape.moveTo( addedPointViewPosition.x + SMALL_DOT_RADIUS, addedPointViewPosition.y )
          .circle( addedPointViewPosition.x, addedPointViewPosition.y, SMALL_DOT_RADIUS );
      }

      // draw green dot if apex
      if ( addedPoint.apex ) {
        apexDot = new Circle( SMALL_DOT_RADIUS + 0.3, {
          x: addedPointViewPosition.x,
          y: addedPointViewPosition.y,
          fill: DOT_GREEN,
          stroke: 'black',
          lineWidth: 0.3
        } );
        this.addChild( apexDot );
      }
    };

    // view listens to whether a datapoint has been added in the model
    trajectory.dataPoints.forEach( handleDataPointAdded );
    trajectory.dataPoints.addItemAddedListener( handleDataPointAdded );

    const updateTransform = (): void => {
      pathsLayer.removeAllChildren();

      currentPathShape = null;
      currentPathStroke = null;

      dotsShape = new Shape();
      dotsPath.shape = dotsShape;
      if ( apexDot ) {
        apexDot.dispose();
      }

      lastViewPosition = null;

      assert && assert( trajectory.dataPoints.get( 0 ).position.x === 0, `Initial point x is not zero but ${
        trajectory.dataPoints.get( 0 ).position.x}` );

      trajectory.dataPoints.forEach( handleDataPointAdded );
      addProjectileNode();
      updateOpacity( trajectory.rankProperty.value );
    };

    // update if model view transform changes
    transformProperty.lazyLink( updateTransform );

    const updateOpacity = ( rank: number ): void => {
      //if projectile opacity is set as constant (as in 'stats' screen)
      if ( constantTrajectoryOpacity ) {
        pathsLayer.opacity = PATH_MAX_OPACITY;
      }
      else {
        const strength = ( maxNumberOfTrajectories - rank ) / maxNumberOfTrajectories;
        pathsLayer.opacity = Math.max( PATH_MIN_OPACITY, PATH_MIN_OPACITY + strength * ( PATH_MAX_OPACITY - PATH_MIN_OPACITY ) );
        if ( projectileNode ) {
          projectileNode.opacity = pathsLayer.opacity;
        }
        if ( apexDot ) {
          apexDot.opacity = pathsLayer.opacity;
        }
        dotsPath.opacity = Math.max( DOTS_MIN_OPACITY, DOTS_MIN_OPACITY + strength * ( DOTS_MAX_OPACITY - DOTS_MIN_OPACITY ) );
      }
    };

    // change decrease in opacity with each successive projectiled fired
    trajectory.rankProperty.link( updateOpacity );

    this.disposeTrajectoryNode = () => {
      while ( pathsLayer.children.length ) {
        const childToDispose: Node | undefined = pathsLayer.children.pop();
        childToDispose?.dispose();
      }
      dotsPath.dispose();
      projectileNode && projectileNode.dispose();
      apexDot && apexDot.dispose();
      transformProperty.unlink( updateTransform );
      trajectory.rankProperty.unlink( updateOpacity );
    };
  }

  public override dispose(): void {
    this.disposeTrajectoryNode();
    super.dispose();
  }
}

projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

export default TrajectoryNode;
