// Copyright 2016-2023, University of Colorado Boulder

/**
 * View for a projectile including the flying object and the vectors.
 * Constructed based on many individually passed parameters about the projectile.
 * Listens to the viewProperties for vector visibility Properties.
 * Listens to a DataPoint Property to figure out when to move.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import FreeBodyDiagram from './FreeBodyDiagram.js';
import ProjectileObjectViewFactory from './ProjectileObjectViewFactory.js';
import ProjectileMotionViewProperties from './ProjectileMotionViewProperties.js';
import DataPoint from '../model/DataPoint.js';
import ProjectileObjectType from '../model/ProjectileObjectType.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// constants
const VELOCITY_ARROW_FILL = ProjectileMotionConstants.VELOCITY_ARROW_FILL;
const ACCELERATION_ARROW_FILL = ProjectileMotionConstants.ACCELERATION_ARROW_FILL;
const TOTAL_ARROW_TAIL_WIDTH = 6;
const TOTAL_ARROW_HEAD_WIDTH = 12;
const COMPONENT_VELOCITY_ARROW_OPTIONS = {
  fill: VELOCITY_ARROW_FILL,
  stroke: 'black',
  lineWidth: 0.2,
  tailWidth: 2,
  headWidth: 6
};
const COMPONENT_ACCELERATION_ARROW_OPTIONS = {
  fill: ACCELERATION_ARROW_FILL,
  stroke: 'black',
  lineWidth: 0.2,
  tailWidth: 2,
  headWidth: 6
};

const VELOCITY_SCALAR = 15; // scales the velocity arrow representations
const ACCELERATION_SCALAR = 15; // scales the acceleration arrow represenations

export type ViewPoint = {
  viewPosition: Vector2;
  dataPoint: DataPoint;
};

type SelfOptions = {
  preventFit?: boolean;
};
type ProjectileNodeOptions = SelfOptions & NodeOptions;

class ProjectileNode extends Node {
  private disposeProjectileNode: () => void;
  public readonly viewPointProperty: TReadOnlyProperty<ViewPoint>;

  /**
   *  @param viewProperties - Properties that determine which vectors are shown
   *  @param dataPointProperty - data for where the projectile is
   *  @param diameter - how big the object is, in meters
   *  @param dragCoefficient - shape of the object
   *  @param modelViewTransform - meters to scale, inverted y-axis, translated origin
   */
  public constructor( viewProperties: ProjectileMotionViewProperties, dataPointProperty: Property<DataPoint>,
                      objectType: ProjectileObjectType, diameter: number, dragCoefficient: number,
                      modelViewTransform: ModelViewTransform2, providedOptions?: ProjectileNodeOptions ) {

    const options = optionize<ProjectileNodeOptions, SelfOptions, NodeOptions>()( {
      preventFit: true
    }, providedOptions );

    super( options );

    let unlandedObjectView: Node | null = null;
    let landedObjectView: Node | null = null;

    // draw projectile object view, which has separate flying and landed views if it has a benchmark.
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( objectType && objectType.viewCreationFunction ) {
      unlandedObjectView = objectType.viewCreationFunction( diameter, modelViewTransform, false );
      landedObjectView = objectType.viewCreationFunction( diameter, modelViewTransform, true );
    }
    else {
      unlandedObjectView = ProjectileObjectViewFactory.createCustom( transformedBallSize, dragCoefficient );
    }
    // Center the object view, and wrap it in a containing node, so we don't require bounds checks when animating
    unlandedObjectView.center = Vector2.ZERO;
    unlandedObjectView = new Node( {
      children: [ unlandedObjectView ]
    } );
    this.addChild( unlandedObjectView );

    this.viewPointProperty = new DerivedProperty( [ dataPointProperty ], dataPoint => {
      assert && assert( !dataPoint.apex, 'Projectile current data point should never be the apex' );
      const viewPosition = modelViewTransform.modelToViewPosition( dataPoint.position );
      viewPosition.x = Utils.roundSymmetric( viewPosition.x * 10000 ) / 10000;
      viewPosition.y = Utils.roundSymmetric( viewPosition.y * 10000 ) / 10000;
      const retVal: ViewPoint = {
        viewPosition: viewPosition,
        dataPoint: dataPoint
      };
      return retVal;
    } );

    // Add support for velocity vectors
    this.addComponentsVelocityVectors( viewProperties.componentsVelocityVectorsOnProperty );
    this.addTotalVelocityVector( viewProperties.totalVelocityVectorOnProperty );

    // Add support for acceleration vectors if applicable
    if ( viewProperties.componentsAccelerationVectorsOnProperty ) {
      this.addComponentsAccelerationVectors( viewProperties.componentsAccelerationVectorsOnProperty );
    }
    if ( viewProperties.totalAccelerationVectorOnProperty ) {
      this.addTotalAccelerationVector( viewProperties.totalAccelerationVectorOnProperty );
    }


    // Add support for force vectors via the FreeBodyDiagram if applicable
    let freeBodyDiagram: FreeBodyDiagram | null = null;

    if ( !!viewProperties.totalForceVectorOnProperty && !!viewProperties.componentsForceVectorsOnProperty ) {
      freeBodyDiagram = new FreeBodyDiagram( this.viewPointProperty, viewProperties.totalForceVectorOnProperty,
        viewProperties.componentsForceVectorsOnProperty );
      freeBodyDiagram && this.addChild( freeBodyDiagram );

      // will be disposed if hits the ground, but cover the case where it is disposed midair
      this.disposeEmitter.addListener( () => !freeBodyDiagram?.isDisposed && freeBodyDiagram?.dispose() );
    }

    // keep track of if this Projectile has been removed from the main layer yet so we don't do it twice.
    let removed = false;

    // Update the projectile's object view.
    const updateProjectileObjectView = ( viewPoint: ViewPoint ): void => {
      const dataPoint = viewPoint.dataPoint;

      // only rotate the object if it doesn't have an assigned benchmark, or it is an object that rotates
      if ( objectType ? objectType.rotates : true ) {
        let angle;
        if ( dataPoint.velocity.x !== 0 ) {
          angle = Math.atan( dataPoint.velocity.y / dataPoint.velocity.x );
        }
        else { // x velocity is zero
          angle = dataPoint.velocity.y > 0 ? Math.PI / 2 : 3 * Math.PI / 2;
        }
        unlandedObjectView?.setRotation( -angle );
      }

      unlandedObjectView?.setTranslation( viewPoint.viewPosition );

      if ( dataPoint.reachedGround ) {

        // only remove it once
        if ( !removed ) {
          removed = true;
          freeBodyDiagram && freeBodyDiagram.dispose();

          if ( landedObjectView ) {
            landedObjectView.center = viewPoint.viewPosition;
            if ( objectType && ( objectType.benchmark === 'human' || objectType.benchmark === 'car' ) ) {
              landedObjectView.bottom = landedObjectView.centerY;
            }
            if ( unlandedObjectView && this.hasChild( unlandedObjectView ) ) {
              this.removeChild( unlandedObjectView );
            }
            this.addChild( landedObjectView );
          }
        }
      }
    };

    this.viewPointProperty.link( updateProjectileObjectView );

    this.disposeProjectileNode = () => {
      this.viewPointProperty.dispose();
    };
  }

  private addComponentsVelocityVectors( property: Property<boolean> ): void {

    // add vector view for velocity x component
    const xVelocityArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_VELOCITY_ARROW_OPTIONS );
    this.addChild( xVelocityArrow );

    // add vector view for velocity y component
    const yVelocityArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_VELOCITY_ARROW_OPTIONS );
    this.addChild( yVelocityArrow );


    // Update component-wise velocity vectors.
    const multilink = Multilink.multilink( [ property, this.viewPointProperty ], ( visible, viewPoint ) => {
      xVelocityArrow.visible = visible;
      yVelocityArrow.visible = visible;

      if ( visible ) {
        const viewPosition = viewPoint.viewPosition;
        const dataPoint = viewPoint.dataPoint;
        xVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y, viewPosition.x + VELOCITY_SCALAR * dataPoint.velocity.x, viewPosition.y );
        yVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y, viewPosition.x, viewPosition.y - VELOCITY_SCALAR * dataPoint.velocity.y );
      }
    } );

    this.disposeEmitter.addListener( () => {
      multilink.dispose();
      xVelocityArrow.dispose();
      yVelocityArrow.dispose();
    } );
  }

  private addTotalVelocityVector( property: Property<boolean> ): void {

    // add vector view for total velocity
    const totalVelocityArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      tailWidth: TOTAL_ARROW_TAIL_WIDTH,
      headWidth: TOTAL_ARROW_HEAD_WIDTH
    } );
    this.addChild( totalVelocityArrow );

    const multilink = Multilink.multilink( [ property, this.viewPointProperty ], ( visible, viewPoint ) => {
      totalVelocityArrow.visible = visible;

      if ( visible ) {
        const viewPosition = viewPoint.viewPosition;
        const dataPoint = viewPoint.dataPoint;
        totalVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y,
          viewPosition.x + VELOCITY_SCALAR * dataPoint.velocity.x,
          viewPosition.y - VELOCITY_SCALAR * dataPoint.velocity.y
        );
      }
    } );

    this.disposeEmitter.addListener( () => {
      multilink.dispose();
      totalVelocityArrow.dispose();
    } );
  }

  private addComponentsAccelerationVectors( property: Property<boolean> ): void {

    // add vector view for acceleration x component
    const xAccelerationArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_ACCELERATION_ARROW_OPTIONS );
    this.addChild( xAccelerationArrow );

    // add vector view for acceleration y component
    const yAccelerationArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_ACCELERATION_ARROW_OPTIONS );
    this.addChild( yAccelerationArrow );

    const multilink = Multilink.multilink( [
      property,
      this.viewPointProperty
    ], ( visible, viewPoint ) => {
      xAccelerationArrow.visible = visible;
      yAccelerationArrow.visible = visible;

      if ( visible ) {
        const viewPosition = viewPoint.viewPosition;
        const dataPoint = viewPoint.dataPoint;

        xAccelerationArrow.setTailAndTip(
          viewPosition.x,
          viewPosition.y,
          viewPosition.x + ACCELERATION_SCALAR * dataPoint.acceleration.x,
          viewPosition.y
        );
        yAccelerationArrow.setTailAndTip(
          viewPosition.x,
          viewPosition.y,
          viewPosition.x,
          viewPosition.y - ACCELERATION_SCALAR * dataPoint.acceleration.y
        );
      }
    } );

    this.disposeEmitter.addListener( () => {
      multilink.dispose();
      xAccelerationArrow.dispose();
      yAccelerationArrow.dispose();
    } );
  }

  // Add vector that shows the total acceleration
  private addTotalAccelerationVector( property: Property<boolean> ): void {

    // add vector view for total acceleration
    const totalAccelerationArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      tailWidth: TOTAL_ARROW_TAIL_WIDTH,
      headWidth: TOTAL_ARROW_HEAD_WIDTH
    } );
    this.addChild( totalAccelerationArrow );

    const totalAccelerationVectorMultilink = Multilink.multilink( [
      property,
      this.viewPointProperty
    ], ( visible, viewPoint ) => {
      totalAccelerationArrow.visible = visible;

      if ( visible ) {
        const viewPosition = viewPoint.viewPosition;
        const dataPoint = viewPoint.dataPoint;

        totalAccelerationArrow.setTailAndTip( viewPosition.x, viewPosition.y,
          viewPosition.x + ACCELERATION_SCALAR * dataPoint.acceleration.x,
          viewPosition.y - ACCELERATION_SCALAR * dataPoint.acceleration.y
        );
      }
    } );

    this.disposeEmitter.addListener( () => {
      totalAccelerationVectorMultilink.dispose();
      totalAccelerationArrow.dispose();
    } );
  }

  public override dispose(): void {
    this.disposeProjectileNode();
    Node.prototype.dispose.call( this );
  }
}

projectileMotion.register( 'ProjectileNode', ProjectileNode );
export default ProjectileNode;