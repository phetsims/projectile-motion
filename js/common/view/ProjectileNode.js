// Copyright 2016-2020, University of Colorado Boulder

/**
 * View for a projectile including the flying object and the vectors.
 * Constructed based on many individually passed parameters about the projectile.
 * Listens to the vectorVisibilityProperties for vector visibility Properties.
 * Listens to a DataPoint Property to figure out when to move.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import FreeBodyDiagram from './FreeBodyDiagram.js';
import ProjectileObjectViewFactory from './ProjectileObjectViewFactory.js';

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

class ProjectileNode extends Node {

  /**
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown
   * @param {Property.<DataPoint>} dataPointProperty - data for where the projectile is
   * @param {ProjectileObjectType} objectType
   * @param {number} diameter - how big the object is, in meters
   * @param {number} dragCoefficient - shape of the object
   * @param {ModelViewTransform2} modelViewTransform - meters to scale, inverted y axis, translated origin
   * @param {Object} [options]
   */
  constructor( vectorVisibilityProperties, dataPointProperty, objectType, diameter, dragCoefficient, modelViewTransform, options ) {

    options = merge( {
      preventFit: true
    }, options );
    super( options );

    // @public (TrajectoryNode) - create a layer for the projectile object Node that would contain the flying object,
    // and then the landed object
    this.projectileViewLayer = new Node();

    // @private
    this.disposeProjectileNodeEmitter = new Emitter();

    let landedObjectView = null;
    let projectileObjectView = null;

    // draw projectile object view, which has separate flying and landed views if it has a benchmark.
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( objectType && objectType.viewCreationFunction ) {
      projectileObjectView = objectType.viewCreationFunction( diameter, modelViewTransform, false );
      landedObjectView = objectType.viewCreationFunction( diameter, modelViewTransform, true );
    }
    else {
      projectileObjectView = ProjectileObjectViewFactory.createCustom( transformedBallSize, dragCoefficient );
    }
    // Center the object view, and wrap it in a containing node, so we don't require bounds checks when animating
    projectileObjectView.center = Vector2.ZERO;
    projectileObjectView = new Node( {
      children: [ projectileObjectView ]
    } );
    this.projectileViewLayer.addChild( projectileObjectView );


    // @private {Property.<{viewPosition: {Vector2}, dataPoint: {DataPoint}}>}
    this.viewPointProperty = new DerivedProperty( [ dataPointProperty ], dataPoint => {
      const viewPosition = modelViewTransform.modelToViewPosition( dataPoint.position );
      viewPosition.x = Utils.roundSymmetric( viewPosition.x * 10000 ) / 10000;
      viewPosition.y = Utils.roundSymmetric( viewPosition.y * 10000 ) / 10000;
      return {
        viewPosition: viewPosition,
        dataPoint: dataPoint
      };
    } );

    // Add support for velocity vectors
    this.addComponentsVelocityVectors( vectorVisibilityProperties.componentsVelocityVectorsOnProperty );
    this.addTotalVelocityVector( vectorVisibilityProperties.totalVelocityVectorOnProperty );

    // Add support for acceleration vectors if applicable
    if ( vectorVisibilityProperties.componentsAccelerationVectorsOnProperty ) {
      this.addComponentsAccelerationVectors( vectorVisibilityProperties.componentsAccelerationVectorsOnProperty );
    }
    if ( vectorVisibilityProperties.totalAccelerationVectorOnProperty ) {
      this.addTotalAccelerationVector( vectorVisibilityProperties.totalAccelerationVectorOnProperty );
    }


    // Add support for force vectors via the FreeBodyDiagram if applicable
    let freeBodyDiagram = null;
    const addFreeBodyDiagram = vectorVisibilityProperties.totalForceVectorOnProperty &&
                               vectorVisibilityProperties.componentsForceVectorsOnProperty;
    if ( addFreeBodyDiagram ) {
      freeBodyDiagram = new FreeBodyDiagram( this.viewPointProperty, vectorVisibilityProperties.totalForceVectorOnProperty,
        vectorVisibilityProperties.componentsForceVectorsOnProperty );
      this.addChild( freeBodyDiagram );

      // will be disposed if hits the ground, but cover the case where it is disposed mid-air
      this.disposeProjectileNodeEmitter.addListener( () => !freeBodyDiagram.isDisposed && freeBodyDiagram.dispose() );
    }

    // keep track of if this Projectile has been removed from the main layer yet so we don't do it twice.
    let removed = false;

    // Update the projectile's object view.
    const updateProjectileObjectView = viewPoint => {
      const dataPoint = viewPoint.dataPoint;

      // only rotate the object if it doesn't have an assigned benchmark, or it is an object that rotates
      if ( objectType ? objectType.rotates : true ) {
        let angle;
        if ( dataPoint.velocity.x ) { // if x velocity is not zero
          angle = Math.atan( dataPoint.velocity.y / dataPoint.velocity.x );
        }
        else { // x velocity is zero
          angle = dataPoint.velocity.y > 0 ? Math.PI / 2 : 3 * Math.PI / 2;
        }
        projectileObjectView.setRotation( -angle );
      }

      projectileObjectView.translation = viewPoint.viewPosition;

      if ( dataPoint.reachedGround ) {

        // only remove it once
        if ( !removed ) {
          removed = true;
          if ( addFreeBodyDiagram ) {
            freeBodyDiagram.dispose();
          }

          if ( landedObjectView ) {
            landedObjectView.center = viewPoint.viewPosition;
            if ( objectType && ( objectType.benchmark === 'human' || objectType.benchmark === 'car' ) ) {
              landedObjectView.bottom = landedObjectView.centerY;
            }
            if ( this.projectileViewLayer.hasChild( projectileObjectView ) ) {
              this.projectileViewLayer.removeChild( projectileObjectView );
            }
            this.projectileViewLayer.addChild( landedObjectView );
          }
        }
      }
    };

    this.viewPointProperty.link( updateProjectileObjectView );

    // @private
    this.disposeProjectileNode = () => {
      this.viewPointProperty.dispose();
      this.projectileViewLayer.dispose();
      this.disposeProjectileNodeEmitter.emit();
    };
  }

  /**
   * Add vectors that show the velocity x/y components
   * @private
   * @param {Property.<boolean>} property
   */
  addComponentsVelocityVectors( property ) {

    // add vector view for velocity x component
    const xVelocityArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_VELOCITY_ARROW_OPTIONS );
    this.addChild( xVelocityArrow );

    // add vector view for velocity y component
    const yVelocityArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_VELOCITY_ARROW_OPTIONS );
    this.addChild( yVelocityArrow );


    // Update component-wise velocity vectors.
    const multilink = Property.multilink( [ property, this.viewPointProperty ], ( visible, viewPoint ) => {
      xVelocityArrow.visible = visible;
      yVelocityArrow.visible = visible;

      if ( visible ) {
        const viewPosition = viewPoint.viewPosition;
        const dataPoint = viewPoint.dataPoint;
        xVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y, viewPosition.x + VELOCITY_SCALAR * dataPoint.velocity.x, viewPosition.y );
        yVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y, viewPosition.x, viewPosition.y - VELOCITY_SCALAR * dataPoint.velocity.y );
      }
    } );

    this.disposeProjectileNodeEmitter.addListener( () => {
      multilink.dispose();
      xVelocityArrow.dispose();
      yVelocityArrow.dispose();
    } );
  }

  /**
   *
   * Add vector that show the total velocity
   * @private
   * @param {Property.<boolean>} property
   */
  addTotalVelocityVector( property ) {

    // add vector view for total velocity
    const totalVelocityArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      tailWidth: TOTAL_ARROW_TAIL_WIDTH,
      headWidth: TOTAL_ARROW_HEAD_WIDTH
    } );
    this.addChild( totalVelocityArrow );

    const multilink = Property.multilink( [ property, this.viewPointProperty ], ( visible, viewPoint ) => {
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

    this.disposeProjectileNodeEmitter.addListener( () => {
      multilink.dispose();
      totalVelocityArrow.dispose();
    } );
  }

  /**
   * Add vectors that show the acceleration x/y components
   * @private
   * @param {Property.<boolean>} property
   */
  addComponentsAccelerationVectors( property ) {

    // add vector view for acceleration x component
    const xAccelerationArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_ACCELERATION_ARROW_OPTIONS );
    this.addChild( xAccelerationArrow );

    // add vector view for acceleration y component
    const yAccelerationArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_ACCELERATION_ARROW_OPTIONS );
    this.addChild( yAccelerationArrow );

    const multilink = Property.multilink( [
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

    this.disposeProjectileNodeEmitter.addListener( () => {
      multilink.dispose();
      xAccelerationArrow.dispose();
      yAccelerationArrow.dispose();
    } );
  }

  /**
   *
   * Add vector that shows the total acceleration
   * @private
   * @param {Property.<boolean>} property
   */
  addTotalAccelerationVector( property ) {

    // add vector view for total acceleration
    const totalAccelerationArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      tailWidth: TOTAL_ARROW_TAIL_WIDTH,
      headWidth: TOTAL_ARROW_HEAD_WIDTH
    } );
    this.addChild( totalAccelerationArrow );

    const totalAccelerationVectorMultilink = Property.multilink( [
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

    this.disposeProjectileNodeEmitter.addListener( () => {
      totalAccelerationVectorMultilink.dispose();
      totalAccelerationArrow.dispose();
    } );
  }

  /**
   * Dispose this trajectory for memory management
   * @public
   * @override
   */
  dispose() {
    this.disposeProjectileNode();
    Node.prototype.dispose.call( this );
  }
}

projectileMotion.register( 'ProjectileNode', ProjectileNode );
export default ProjectileNode;