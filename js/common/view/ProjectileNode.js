// Copyright 2016-2018, University of Colorado Boulder

/**
 * View for a projectile including the flying object and the vectors.
 * Constructed based on many individually passed parameters about the projectile.
 * Listens to the vectorVisibilityProperties for vector visibility Properties.
 * Listens to a DataPoint Property to figure out when to move.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

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
  const FORCE_ARROW_OPTIONS = {
    fill: 'black',
    stroke: null,
    tailWidth: 2,
    headWidth: 6
  };

  const VELOCITY_SCALAR = 15; // scales the velocity arrow representations
  const ACCELERATION_SCALAR = 15; // scales the acceleration arrow represenations
  const FORCE_SCALAR = 3;

  const FREE_BODY_RADIUS = 3;
  const FREE_BODY_OFFSET = new Vector2( -40, -40 ); // distance from free body to projectile
  const FORCES_BOX_DILATION = 7;

  const TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.35 )';
  const LABEL_OPTIONS = ProjectileMotionConstants.LABEL_TEXT_OPTIONS;

  const xDragForceText = new RichText( 'F<sub>dx</sub>', LABEL_OPTIONS );
  const yDragForceText = new RichText( 'F<sub>dy</sub>', LABEL_OPTIONS );
  const forceGravityText = new RichText( 'F<sub>g</sub>', LABEL_OPTIONS );
  const totalDragForceText = new RichText( 'F<sub>d</sub>', LABEL_OPTIONS );

  /**
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown
   * @param {Property.<DataPoint>} dataPointProperty - data for where the projectile is
   * @param {ProjectileObjectType} objectType
   * @param {number} diameter - how big the object is, in meters
   * @param {number} dragCoefficient - shape of the object
   * @param {ModelViewTransform2} modelViewTransform - meters to scale, inverted y axis, translated origin
   * @param {Object} [options]
   * @constructor
   */
  function ProjectileNode( vectorVisibilityProperties,
                           dataPointProperty,
                           objectType,
                           diameter,
                           dragCoefficient,
                           modelViewTransform,
                           options ) {

    options = _.extend( {
      preventFit: true
    }, options );
    Node.call( this, options );

    // create a layer for the projectile object node that would contain the flying object, and then the landed object
    const projectileViewLayer = new Node();

    // @public for TrajectoryNode to access
    this.projectileViewLayer = projectileViewLayer;

    // draw projectile object view, which has separate flying and landed views if it has a benchmark.
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( objectType && objectType.viewCreationFunction ) {
      var projectileObjectView = objectType.viewCreationFunction( diameter, modelViewTransform, false );
      var landedObjectView = objectType.viewCreationFunction( diameter, modelViewTransform, true );
    }
    else {
      projectileObjectView = ProjectileObjectViewFactory.createCustom( transformedBallSize, dragCoefficient );
    }
    // Center the object view, and wrap it in a containing node, so we don't require bounds checks when animating
    projectileObjectView.center = Vector2.ZERO;
    projectileObjectView = new Node( {
      children: [ projectileObjectView ]
    } );
    projectileViewLayer.addChild( projectileObjectView );

    // add vector view for acceleration x component
    const xAccelerationArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_ACCELERATION_ARROW_OPTIONS );
    this.addChild( xAccelerationArrow );

    // add vector view for acceleration y component
    const yAccelerationArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_ACCELERATION_ARROW_OPTIONS );
    this.addChild( yAccelerationArrow );

    // add vector view for total acceleration
    const totalAccelerationArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      tailWidth: TOTAL_ARROW_TAIL_WIDTH,
      headWidth: TOTAL_ARROW_HEAD_WIDTH
    } );
    this.addChild( totalAccelerationArrow );

    // add vector view for velocity x component
    const xVelocityArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_VELOCITY_ARROW_OPTIONS );
    this.addChild( xVelocityArrow );

    // add vector view for velocity y component
    const yVelocityArrow = new ArrowNode( 0, 0, 0, 0, COMPONENT_VELOCITY_ARROW_OPTIONS );
    this.addChild( yVelocityArrow );

    // add vector view for total velocity
    const totalVelocityArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      tailWidth: TOTAL_ARROW_TAIL_WIDTH,
      headWidth: TOTAL_ARROW_HEAD_WIDTH
    } );
    this.addChild( totalVelocityArrow );

    // forces view
    const forcesBox = new Rectangle( 0, 0, 10, 50, {
      fill: TRANSPARENT_WHITE,
      lineWidth: 0
    } );
    this.addChild( forcesBox );

    const freeBodyDiagram = new Node();
    this.addChild( freeBodyDiagram );

    const freeBody = new Circle( FREE_BODY_RADIUS, { x: 0, y: 0, fill: 'black' } );

    const freeBodyComponents = new Node();

    const xDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyComponents.addChild( xDragForceArrow );

    const xDragForceLabel = new Node( { children: [ xDragForceText ] } );
    freeBodyComponents.addChild( xDragForceLabel );

    const yDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyComponents.addChild( yDragForceArrow );

    const yDragForceLabel = new Node( { children: [ yDragForceText ] } );
    freeBodyComponents.addChild( yDragForceLabel );

    const forceGravityArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    const forceGravityLabel = new Node( { children: [ forceGravityText ] } );

    const freeBodyTotals = new Node();

    const totalDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyTotals.addChild( totalDragForceArrow );

    const totalDragForceLabel = new Node( { children: [ totalDragForceText ] } );
    freeBodyTotals.addChild( totalDragForceLabel );

    // {Property.<{viewPosition: {Vector2}, dataPoint: {DataPoint}}>}
    const viewPointProperty = new DerivedProperty( [ dataPointProperty ], function( dataPoint ) {
      const viewPosition = modelViewTransform.modelToViewPosition( dataPoint.position );
      viewPosition.x = Util.roundSymmetric( viewPosition.x * 10000 ) / 10000;
      viewPosition.y = Util.roundSymmetric( viewPosition.y * 10000 ) / 10000;
      return {
        viewPosition: viewPosition,
        dataPoint: dataPoint
      };
    } );

    // Update the projectile's object view.
    const updateProjectileObjectView = function( viewPoint ) {
      const dataPoint = viewPoint.dataPoint;

      // only rotate the object if it doesn't have an assigned benchmark, or it is an object that rotates
      if ( objectType ? objectType.rotates : true ) {
        if ( dataPoint.velocity.x ) { // if x velocity is not zero
          var angle = Math.atan( dataPoint.velocity.y / dataPoint.velocity.x );
        }
        else { // x velocity is zero
          angle = dataPoint.velocity.y > 0 ? Math.PI / 2 : 3 * Math.PI / 2;
        }
        projectileObjectView.setRotation( -angle );
      }

      projectileObjectView.translation = viewPoint.viewPosition;
    };

    viewPointProperty.link( updateProjectileObjectView );

    // Update component-wise velocity vectors.
    const updateComponentVelocityVectors = function( visible, viewPoint ) {
      xVelocityArrow.visible = visible;
      yVelocityArrow.visible = visible;

      if ( visible ) {
        const viewPosition = viewPoint.viewPosition;
        const dataPoint = viewPoint.dataPoint;
        xVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y, viewPosition.x + VELOCITY_SCALAR * dataPoint.velocity.x, viewPosition.y );
        yVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y, viewPosition.x, viewPosition.y - VELOCITY_SCALAR * dataPoint.velocity.y );
      }
    };

    const componentVelocityVectorsMultilink = Property.multilink( [ vectorVisibilityProperties.componentsVelocityVectorsOnProperty, viewPointProperty ], updateComponentVelocityVectors );

    // Update total velocity vector.
    const updateTotalVelocityVector = function( visible, viewPoint ) {
      totalVelocityArrow.visible = visible;

      if ( visible ) {
        const viewPosition = viewPoint.viewPosition;
        const dataPoint = viewPoint.dataPoint;
        totalVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y,
          viewPosition.x + VELOCITY_SCALAR * dataPoint.velocity.x,
          viewPosition.y - VELOCITY_SCALAR * dataPoint.velocity.y
        );
      }
    };

    const totalVelocityVectorMultilink = Property.multilink( [ vectorVisibilityProperties.totalVelocityVectorOnProperty, viewPointProperty ], updateTotalVelocityVector );

    // Update component-wise acceleration vectors.
    const updateComponentAccelerationVectors = function( visible, viewPoint ) {
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
    };

    const componentAccelerationVectorsMultilink = Property.multilink( [
      vectorVisibilityProperties.componentsAccelerationVectorsOnProperty,
      viewPointProperty
    ], updateComponentAccelerationVectors );

    // Update total acceleration vector.
    const updateTotalAccelerationVector = function( visible, viewPoint ) {
      totalAccelerationArrow.visible = visible;

      if ( visible ) {
        const viewPosition = viewPoint.viewPosition;
        const dataPoint = viewPoint.dataPoint;

        totalAccelerationArrow.setTailAndTip( viewPosition.x, viewPosition.y,
          viewPosition.x + ACCELERATION_SCALAR * dataPoint.acceleration.x,
          viewPosition.y - ACCELERATION_SCALAR * dataPoint.acceleration.y
        );
      }
    };

    const totalAccelerationVectorMultilink = Property.multilink( [
      vectorVisibilityProperties.totalAccelerationVectorOnProperty,
      viewPointProperty
    ], updateTotalAccelerationVector );

    // Update the free body diagram
    let removed = false;
    const updateFreeBodyDiagram = function( componentsVisible, totalVisible, viewPoint ) {
      const viewPosition = viewPoint.viewPosition;
      const dataPoint = viewPoint.dataPoint;

      // When the projectile lands, remove the force diagram
      if ( dataPoint.reachedGround ) {
        if ( !removed ) {
          removed = true;
          forcesBox.visible = false;
          freeBodyDiagram.visible = false;

          if ( landedObjectView ) {
            landedObjectView.center = viewPosition;
            if ( objectType ? objectType.benchmark === 'human' || objectType.benchmark === 'car' : false ) {
              landedObjectView.bottom = landedObjectView.centerY;
            }
            if ( projectileViewLayer.hasChild( projectileObjectView ) ) {
              projectileViewLayer.removeChild( projectileObjectView );
            }
            projectileViewLayer.addChild( landedObjectView );
          }
        }
        return;
      }

      forcesBox.visible = componentsVisible || totalVisible;
      freeBodyDiagram.visible = componentsVisible || totalVisible;

      if ( componentsVisible || totalVisible ) {
        freeBodyDiagram.children = [ freeBody ].concat( componentsVisible ? [ freeBodyComponents ] : [] )
          .concat( [ forceGravityArrow, forceGravityLabel ] )
          .concat( totalVisible ? [ freeBodyTotals ] : [] );

        freeBody.x = viewPosition.x + FREE_BODY_OFFSET.x;
        freeBody.y = viewPosition.y + FREE_BODY_OFFSET.y;

        if ( componentsVisible ) {
          xDragForceArrow.setTailAndTip( freeBody.x,
            freeBody.y,
            freeBody.x - FORCE_SCALAR * dataPoint.dragForce.x,
            freeBody.y
          );
          xDragForceLabel.right = xDragForceArrow.tipX - 5;
          xDragForceLabel.y = xDragForceArrow.tipY;

          yDragForceArrow.setTailAndTip( freeBody.x,
            freeBody.y,
            freeBody.x,
            freeBody.y + FORCE_SCALAR * dataPoint.dragForce.y
          );
          yDragForceLabel.left = yDragForceArrow.tipX + 5;
          yDragForceLabel.y = yDragForceArrow.tipY;
        }

        forceGravityArrow.setTailAndTip( freeBody.x,
          freeBody.y,
          freeBody.x,
          freeBody.y - FORCE_SCALAR * dataPoint.forceGravity
        );
        forceGravityLabel.left = forceGravityArrow.tipX + 5;
        forceGravityLabel.y = forceGravityArrow.tipY;

        if ( totalVisible ) {
          const xTotalForce = dataPoint.dragForce.x;
          const yTotalForce = dataPoint.dragForce.y;
          totalDragForceArrow.setTailAndTip( freeBody.x,
            freeBody.y,
            freeBody.x - FORCE_SCALAR * xTotalForce,
            freeBody.y + FORCE_SCALAR * yTotalForce
          );
          totalDragForceLabel.right = totalDragForceArrow.tipX - 5;
          totalDragForceLabel.bottom = totalDragForceArrow.tipY - 5;
        }

        forcesBox.setRectBounds( freeBodyDiagram.getChildBounds().dilated( FORCES_BOX_DILATION ) );
      }
    };

    const freeBodyDiagramMultilink = Property.multilink( [
      vectorVisibilityProperties.componentsForceVectorsOnProperty,
      vectorVisibilityProperties.totalForceVectorOnProperty,
      viewPointProperty
    ], updateFreeBodyDiagram );

    viewPointProperty.link( function( point ) {
      const dragForceExists = point.dataPoint.airDensity > 0;
      xDragForceLabel.visible = dragForceExists;
      yDragForceLabel.visible = dragForceExists;
      totalDragForceLabel.visible = dragForceExists;
    } );

    this.disposeProjectileNode = function() {
      componentVelocityVectorsMultilink.dispose();
      totalVelocityVectorMultilink.dispose();
      componentAccelerationVectorsMultilink.dispose();
      totalAccelerationVectorMultilink.dispose();
      freeBodyDiagramMultilink.dispose();
      viewPointProperty.dispose();
      xVelocityArrow.dispose();
      yVelocityArrow.dispose();
      xAccelerationArrow.dispose();
      yAccelerationArrow.dispose();
      xDragForceArrow.dispose();
      yDragForceArrow.dispose();
      totalVelocityArrow.dispose();
      totalAccelerationArrow.dispose();
      totalDragForceArrow.dispose();
      forceGravityArrow.dispose();
      projectileViewLayer.dispose();
      xDragForceLabel.dispose();
      yDragForceLabel.dispose();
      forceGravityLabel.dispose();
      totalDragForceLabel.dispose();
    };
  }

  projectileMotion.register( 'ProjectileNode', ProjectileNode );

  return inherit( Node, ProjectileNode, {

    /**
     * Dispose this trajectory for memory management
     * @public
     * @override
     */
    dispose: function() {
      this.disposeProjectileNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );

