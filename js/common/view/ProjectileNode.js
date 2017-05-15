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
      tailWidth: 2,
      headWidth: 6
  };
  var FREE_BODY_RADIUS = 5;
  var FORCE_SCALAR = 0.005;
  var FREE_BODY_OFFSET = new Vector2( -40, -40 ); // distance from free body to projectile
  var FORCES_BOX_DILATION = 7;
  var TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.35 )';

  /**
   * @param {Property.<DataPoint>} dataPointProperty - data for where the projectile is
   * @param {string} objectType - pumpkin? human? canonball?
   * @param {number} diameter - how big the object is
   * @param {number} dragCoefficient - shape of the object
   * @param {Property.<boolean>} - componentsVelocityVectorsOnProperty
   * @param {ModelViewTransform2} modelViewTransform - meters to scale, inverted y axis, translated origin
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

    var self = this;
    options = options || {};
    Node.call( self, options );

    this.transformedUnit = modelViewTransform.modelToViewDeltaX( 1 );
    this.transformedVelocityScalar = this.transformedUnit * VELOCITY_SCALAR;
    this.transformedAccelerationScalar = this.transformedUnit * ACCELERATION_SCALAR;
    this.transformedForceScalar = this.transformedUnit * FORCE_SCALAR;

    // add view for projectile
    if ( objectType ) {
      this.projectileObjectView = ProjectileObjectViewFactory.createObjectView( objectType, modelViewTransform );
    } else {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      this.projectileObjectView = ProjectileObjectViewFactory.createCustom( transformedBallSize / 2, dragCoefficient );
    }
    this.addChild( this.projectileObjectView );

    // add vector view for velocity x component
    var xVelocityArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    this.addChild( xVelocityArrow );

    // add vector view for velocity y component
    var yVelocityArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
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
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    this.addChild( xAccelerationArrow );

    // add vector view for acceleration y component
    var yAccelerationArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    this.addChild( yAccelerationArrow );

    // forces view
    var forcesBox = new Rectangle( 0, 0, 10, 50, {
      fill: TRANSPARENT_WHITE,
      lineWidth: 0,
    } );
    this.addChild( forcesBox );

    var freeBodyDiagram = new Node();
    this.addChild( freeBodyDiagram );

    var freeBody = new Circle( FREE_BODY_RADIUS, { x: 0, y: 0, fill: 'black' } );
    freeBodyDiagram.addChild( freeBody );

    var xDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyDiagram.addChild( xDragForceArrow );

    var xDragForceLabel = new RichText( 'F<sub>dx</sub>', LABEL_OPTIONS );
    freeBodyDiagram.addChild( xDragForceLabel );

    var yDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyDiagram.addChild( yDragForceArrow );

    var yDragForceLabel = new RichText( 'F<sub>dy</sub>', LABEL_OPTIONS );
    freeBodyDiagram.addChild( yDragForceLabel );

    var forceGravityArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyDiagram.addChild( forceGravityArrow );

    var forceGravityLabel = new RichText( 'F<sub>g</sub>', LABEL_OPTIONS );
    freeBodyDiagram.addChild( forceGravityLabel );

    var totalDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyDiagram.addChild( totalDragForceArrow );

    var totalDragForceLabel = new RichText( 'F<sub>d</sub>', LABEL_OPTIONS );
    freeBodyDiagram.addChild( totalDragForceLabel );

    // listen to whether components velocity vectors should be on
    vectorVisibilityProperties.componentsVelocityVectorsOnProperty.link( function( componentsVelocityVectorsOn ) {
      xVelocityArrow.visible = componentsVelocityVectorsOn;
      yVelocityArrow.visible = componentsVelocityVectorsOn;
    } );

    // listen to whether total velocity vector should be on
    vectorVisibilityProperties.totalVelocityVectorOnProperty.link( function( totalVelocityVectorOn ) {
      totalVelocityArrow.visible = totalVelocityVectorOn;
    } );

    // listen to whether components acceleration vectors should be on
    vectorVisibilityProperties.componentsAccelerationVectorsOnProperty.link( function( componentsAccelerationVectorsOn ) {
      xAccelerationArrow.visible = componentsAccelerationVectorsOn;
      yAccelerationArrow.visible = componentsAccelerationVectorsOn;
    } );

    var dataPoint = dataPointProperty.get();

    // listen to which force vectors should be on
    Property.multilink( [ vectorVisibilityProperties.componentsForceVectorsOnProperty, vectorVisibilityProperties.totalForceVectorOnProperty ], function() {
      forcesBox.visible = ( vectorVisibilityProperties.componentsForceVectorsOnProperty.get() || vectorVisibilityProperties.totalForceVectorOnProperty.get() ) && !dataPoint.reachedGround;
      freeBodyDiagram.visible = ( vectorVisibilityProperties.componentsForceVectorsOnProperty.get() || vectorVisibilityProperties.totalForceVectorOnProperty.get() ) && !dataPoint.reachedGround;
      xDragForceArrow.visible = vectorVisibilityProperties.componentsForceVectorsOnProperty.get();
      xDragForceLabel.visible = vectorVisibilityProperties.componentsForceVectorsOnProperty.get();
      yDragForceArrow.visible = vectorVisibilityProperties.componentsForceVectorsOnProperty.get();
      yDragForceLabel.visible = vectorVisibilityProperties.componentsForceVectorsOnProperty.get();
      totalDragForceArrow.visible = vectorVisibilityProperties.totalForceVectorOnProperty.get();
      totalDragForceLabel.visible = vectorVisibilityProperties.totalForceVectorOnProperty.get();
    } );

    // update if data point changes
    dataPointProperty.link( function( dataPoint ) {
      self.projectileObjectView.x = modelViewTransform.modelToViewX( dataPoint.x );
      self.projectileObjectView.y = modelViewTransform.modelToViewY( dataPoint.y );

      var angle = Math.atan( dataPoint.yVelocity / dataPoint.xVelocity ) || 0;
      self.projectileObjectView.setRotation( -angle );

      var x = modelViewTransform.modelToViewX( dataPoint.x );
      var y = modelViewTransform.modelToViewY( dataPoint.y );
      xVelocityArrow.setTailAndTip( x,
        y,
        x + self.transformedVelocityScalar * dataPoint.xVelocity,
        y
      );
      yVelocityArrow.setTailAndTip( x,
        y,
        x,
        y - self.transformedVelocityScalar * dataPoint.yVelocity
      );
      totalVelocityArrow.setTailAndTip( x,
        y,
        x + self.transformedVelocityScalar * dataPoint.xVelocity,
        y - self.transformedVelocityScalar * dataPoint.yVelocity
      );
      xAccelerationArrow.setTailAndTip( x,
        y,
        x + self.transformedAccelerationScalar * dataPoint.xAcceleration,
        y
      );
      yAccelerationArrow.setTailAndTip( x,
        y,
        x,
        y - self.transformedAccelerationScalar * dataPoint.yAcceleration
      );

      // When the projectile lands, remove the force diagram
      if ( dataPoint.reachedGround ) {
        forcesBox.visible = false;
        freeBodyDiagram.visible = false;
        return;
      }

      freeBody.x = x + FREE_BODY_OFFSET.x;
      freeBody.y = y + FREE_BODY_OFFSET.y;

      // TODO: is multiplying by 100 for the drag force arrows okay? Cause you can't see it otherwise
      // If so, should we multiply the acceleration x component by 100 as well?

      xDragForceArrow.setTailAndTip( freeBody.x,
        freeBody.y,
        freeBody.x - 100 * self.transformedForceScalar * dataPoint.xDragForce,
        freeBody.y
      );
      xDragForceLabel.right = xDragForceArrow.tipX - 5;
      xDragForceLabel.y = xDragForceArrow.tipY;

      yDragForceArrow.setTailAndTip( freeBody.x,
        freeBody.y,
        freeBody.x,
        freeBody.y + 100 * self.transformedForceScalar * dataPoint.yDragForce
      );
      yDragForceLabel.left = yDragForceArrow.tipX + 5;
      yDragForceLabel.y = yDragForceArrow.tipY;

      forceGravityArrow.setTailAndTip( freeBody.x,
        freeBody.y,
        freeBody.x,
        freeBody.y - self.transformedForceScalar * dataPoint.forceGravity
      );
      forceGravityLabel.left = forceGravityArrow.tipX + 5;
      forceGravityLabel.y = forceGravityArrow.tipY;

      // net force is zero if projectile is on ground
      var xTotalForce = dataPoint.y === 0 ? 0 : dataPoint.xDragForce;
      var yTotalForce = dataPoint.y === 0 ? 0 : dataPoint.yDragForce;
      totalDragForceArrow.setTailAndTip( freeBody.x,
        freeBody.y,
        freeBody.x - 100 * self.transformedForceScalar * xTotalForce,
        freeBody.y + 100 * self.transformedForceScalar * yTotalForce
      );
      totalDragForceLabel.right = totalDragForceArrow.tipX - 5;
      totalDragForceLabel.bottom = totalDragForceArrow.tipY - 5;

      forcesBox.setRectBounds( freeBodyDiagram.getChildBounds().dilated( FORCES_BOX_DILATION ) );
    } );

  }

  projectileMotion.register( 'ProjectileNode', ProjectileNode );

  return inherit( Node, ProjectileNode );
} );

