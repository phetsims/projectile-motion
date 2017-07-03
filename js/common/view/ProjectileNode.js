// Copyright 2016, University of Colorado Boulder

/**
 * View for a projectile including the flying object and the vectors.
 * Constructed based on many individually passed parameters about the projectile.
 * Listens to the vectorVisibilityProperties for vector visibility properties.
 * Listens to a DataPoint property to figure out when to move.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  var Property = require( 'AXON/Property' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.LABEL_TEXT_OPTIONS;
  var VELOCITY_ARROW_FILL = 'rgb( 50, 255, 50 )';
  var ACCELERATION_ARROW_FILL = 'rgb( 255, 255, 50 )';
  var ARROW_TAIL_WIDTH = 6;
  var ARROW_HEAD_WIDTH = 12;
  var VELOCITY_SCALAR = 1; // scales the velocity arrow representations
  var ACCELERATION_SCALAR = 0.5; // scales the acceleration arrow represenations

  var FORCE_ARROW_OPTIONS = {
      pickable: false,
      fill: 'black',
      stroke: null,
      tailWidth: 2,
      headWidth: 6
  };
  var FREE_BODY_RADIUS = 5;
  var FORCE_SCALAR = 0.1;
  var FREE_BODY_OFFSET = new Vector2( -40, -40 ); // distance from free body to projectile
  var FORCES_BOX_DILATION = 7;
  var TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.35 )';

  //TODO: release references to these when not needed
  var xDragForceText = new RichText( 'F<sub>dx</sub>', LABEL_OPTIONS );
  var yDragForceText = new RichText( 'F<sub>dy</sub>', LABEL_OPTIONS );
  var forceGravityText = new RichText( 'F<sub>g</sub>', LABEL_OPTIONS );
  var totalDragForceText = new RichText( 'F<sub>d</sub>', LABEL_OPTIONS );

  /**
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - properties that determine which vectors are shown
   * @param {Property.<DataPoint>} dataPointProperty - data for where the projectile is
   * @param {string} objectType - e.g. pumpkin? human? cannonball? REVIEW: Doc looks wrong, ProjectileObjectType? or... undefined?
   * @param {number} diameter - how big the object is, in meters
   * @param {number} dragCoefficient - shape of the object
   * @param {ModelViewTransform2} modelViewTransform - meters to scale, inverted y axis, translated origin
   * @param {Object} [options]
   * @constructor
   */
  function ProjectileNode(
                          vectorVisibilityProperties,
                          dataPointProperty,
                          objectType,
                          diameter,
                          dragCoefficient,
                          modelViewTransform,
                          options
  ) {

    options = _.extend( {
      preventFit: true
    }, options );
    Node.call( this, options );

    var transformedUnit = modelViewTransform.modelToViewDeltaX( 1 );
    var transformedVelocityScalar = transformedUnit * VELOCITY_SCALAR;
    var transformedAccelerationScalar = transformedUnit * ACCELERATION_SCALAR;
    var transformedForceScalar = transformedUnit * FORCE_SCALAR;

    // create a layer for the projectile object node that would contain the flying object, and then the landed object
    var projectileViewLayer = new Node();
    this.addChild( projectileViewLayer );

    // draw projectile object view
    var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    var projectileObjectView = ProjectileObjectViewFactory.createCustom( transformedBallSize / 2, dragCoefficient );
    if ( objectType && objectType.type ) {
      projectileObjectView = ProjectileObjectViewFactory.createObjectView( objectType.type, diameter, modelViewTransform );
      var landedObjectView = ProjectileObjectViewFactory.createLandedObjectView( objectType.type, diameter, modelViewTransform );
    }
    projectileViewLayer.addChild( projectileObjectView );

    // add vector view for velocity x component
    var xVelocityArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      lineDash: [ 5, 5 ],
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    this.addChild( xVelocityArrow );

    // add vector view for velocity y component
    var yVelocityArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      lineDash: [ 5, 5 ],
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    this.addChild( yVelocityArrow );

    // add vector view for total velocity
    var totalVelocityArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    this.addChild( totalVelocityArrow );

    // add vector view for acceleration x component
    var xAccelerationArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      lineDash: [ 5, 5 ],
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    this.addChild( xAccelerationArrow );

    // add vector view for acceleration y component
    var yAccelerationArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      lineDash: [ 5, 5 ],
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    this.addChild( yAccelerationArrow );

    // add vector view for total acceleration
    var totalAccelerationArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    this.addChild( totalAccelerationArrow );

    // forces view
    var forcesBox = new Rectangle( 0, 0, 10, 50, {
      fill: TRANSPARENT_WHITE,
      lineWidth: 0,
    } );
    this.addChild( forcesBox );

    var freeBodyDiagram = new Node();
    this.addChild( freeBodyDiagram );

    var freeBody = new Circle( FREE_BODY_RADIUS, { x: 0, y: 0, fill: 'black' } );

    var freeBodyComponents = new Node();

    var xDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyComponents.addChild( xDragForceArrow );

    var xDragForceLabel = new Node( { children: [ xDragForceText ] } );
    freeBodyComponents.addChild( xDragForceLabel );

    var yDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyComponents.addChild( yDragForceArrow );

    var yDragForceLabel = new Node( { children: [ yDragForceText ] } );
    freeBodyComponents.addChild( yDragForceLabel );

    var forceGravityArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    var forceGravityLabel = new Node( { children: [ forceGravityText ] } );

    var freeBodyTotals = new Node();

    var totalDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyTotals.addChild( totalDragForceArrow );

    var totalDragForceLabel = new Node( { children: [ totalDragForceText ] } );
    freeBodyTotals.addChild( totalDragForceLabel );

    // TODO: Don't leak listeners to the visibility properties.

    // {Property.<{viewPosition: {Vector2}, dataPoint: {DataPoint}}>}
    var viewPointProperty = new DerivedProperty( [ dataPointProperty ], function( dataPoint ) {
      //TODO: Getting a view-coordinate copy of the DataPoint would be ideal, so this extra thing wouldn't be needed.
      return {
        viewPosition: modelViewTransform.modelToViewPosition( dataPoint.position ),
        dataPoint: dataPoint
      };
    } );

    // Update the projectile's object view.
    viewPointProperty.link( function( viewPoint ) {
      var dataPoint = viewPoint.dataPoint;

      // only rotate the object if it doesn't have an assigned type, or it is an object that rotates
      if( objectType ?  objectType.rotates : true  ) {
        var angle = Math.atan( dataPoint.velocity.y / dataPoint.velocity.x ) || 0;
        projectileObjectView.setRotation( -angle );
      }

      projectileObjectView.center = viewPoint.viewPosition;
    } );

    // Update component-wise velocity vectors.
    Property.multilink( [ vectorVisibilityProperties.componentsVelocityVectorsOnProperty, viewPointProperty ], function( visible, viewPoint ) {
      xVelocityArrow.visible = visible;
      yVelocityArrow.visible = visible;

      if ( visible ) {
        var viewPosition = viewPoint.viewPosition;
        var dataPoint = viewPoint.dataPoint;
        xVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y, viewPosition.x + transformedVelocityScalar * dataPoint.velocity.x, viewPosition.y );
        yVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y, viewPosition.x, viewPosition.y - transformedVelocityScalar * dataPoint.velocity.y );
      }
    } );

    // Update total velocity vector.
    Property.multilink( [ vectorVisibilityProperties.totalVelocityVectorOnProperty, viewPointProperty ], function( visible, viewPoint ) {
      totalVelocityArrow.visible = visible;

      if ( visible ) {
        var viewPosition = viewPoint.viewPosition;
        var dataPoint = viewPoint.dataPoint;
        totalVelocityArrow.setTailAndTip( viewPosition.x, viewPosition.y,
                                          viewPosition.x + transformedVelocityScalar * dataPoint.velocity.x,
                                          viewPosition.y - transformedVelocityScalar * dataPoint.velocity.y
        );
      }
    } );

    // Update component-wise acceleration vectors.
    Property.multilink( [ vectorVisibilityProperties.componentsAccelerationVectorsOnProperty, viewPointProperty ], function( visible, viewPoint ) {
      xAccelerationArrow.visible = visible;
      yAccelerationArrow.visible = visible;

      if ( visible ) {
        var viewPosition = viewPoint.viewPosition;
        var dataPoint = viewPoint.dataPoint;

        xAccelerationArrow.setTailAndTip( viewPosition.x, viewPosition.y, viewPosition.x + transformedAccelerationScalar * dataPoint.acceleration.x, viewPosition.y );
        yAccelerationArrow.setTailAndTip( viewPosition.x, viewPosition.y, viewPosition.x, viewPosition.y - transformedAccelerationScalar * dataPoint.acceleration.y );
      }
    } );

    // Update total acceleration vector.
    Property.multilink( [ vectorVisibilityProperties.totalAccelerationVectorOnProperty, viewPointProperty ], function( visible, viewPoint ) {
      totalAccelerationArrow.visible = visible;

      if ( visible ) {
        var viewPosition = viewPoint.viewPosition;
        var dataPoint = viewPoint.dataPoint;

        totalAccelerationArrow.setTailAndTip( viewPosition.x, viewPosition.y,
                                              viewPosition.x + transformedAccelerationScalar * dataPoint.acceleration.x,
                                              viewPosition.y - transformedAccelerationScalar * dataPoint.acceleration.y
        );
      }
    } );

    // Update the free body diagram
    var removed = false;
    Property.multilink( [ vectorVisibilityProperties.componentsForceVectorsOnProperty, vectorVisibilityProperties.totalForceVectorOnProperty, viewPointProperty ], function( componentsVisible, totalVisible, viewPoint ) {
      var viewPosition = viewPoint.viewPosition;
      var dataPoint = viewPoint.dataPoint;

      // When the projectile lands, remove the force diagram
      if ( dataPoint.reachedGround ) {
        // TODO: more robust system for only removing once (remove these listeners!)
        if ( !removed ) {
          removed = true;
          forcesBox.visible = false;
          freeBodyDiagram.visible = false;

          if ( landedObjectView ) {
            landedObjectView.center = viewPosition;
            if ( objectType ? objectType.type === 'human' || objectType.type === 'buick' : false ) {
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
            freeBody.x - transformedForceScalar * dataPoint.dragForce.x,
            freeBody.y
          );
          xDragForceLabel.right = xDragForceArrow.tipX - 5;
          xDragForceLabel.y = xDragForceArrow.tipY;

          yDragForceArrow.setTailAndTip( freeBody.x,
            freeBody.y,
            freeBody.x,
            freeBody.y + transformedForceScalar * dataPoint.dragForce.y
          );
          yDragForceLabel.left = yDragForceArrow.tipX + 5;
          yDragForceLabel.y = yDragForceArrow.tipY;
        }

        forceGravityArrow.setTailAndTip( freeBody.x,
          freeBody.y,
          freeBody.x,
          freeBody.y - transformedForceScalar * dataPoint.forceGravity
        );
        forceGravityLabel.left = forceGravityArrow.tipX + 5;
        forceGravityLabel.y = forceGravityArrow.tipY;

        if ( totalVisible ) {
          // net force is zero if projectile is on ground
          var xTotalForce = dataPoint.position.y === 0 ? 0 : dataPoint.dragForce.x;
          var yTotalForce = dataPoint.position.y === 0 ? 0 : dataPoint.dragForce.y;
          totalDragForceArrow.setTailAndTip( freeBody.x,
            freeBody.y,
            freeBody.x - transformedForceScalar * xTotalForce,
            freeBody.y + transformedForceScalar * yTotalForce
          );
          totalDragForceLabel.right = totalDragForceArrow.tipX - 5;
          totalDragForceLabel.bottom = totalDragForceArrow.tipY - 5;
        }

        forcesBox.setRectBounds( freeBodyDiagram.getChildBounds().dilated( FORCES_BOX_DILATION ) );
      }
    } );
  }

  projectileMotion.register( 'ProjectileNode', ProjectileNode );

  return inherit( Node, ProjectileNode );
} );

