// Copyright 2016, University of Colorado Boulder

/**
 * View for the projectile.
 * Constructed based on many individually passed parameters
 * Listens to a datapoint and whether velocity vectors should be turned on.
 *
 * @author Andrea Lin
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
  var ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
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
                          model,
                          dataPointProperty,
                          objectType,
                          diameter,
                          dragCoefficient,
                          modelViewTransform,
                          // totalVelocityVectorOnProperty,
                          // componentsVelocityVectorsOnProperty,
                          // componentsAccelerationVectorsOnProperty,
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

    var yDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyDiagram.addChild( yDragForceArrow );

    var forceGravityArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyDiagram.addChild( forceGravityArrow );

    var totalForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyDiagram.addChild( totalForceArrow );

    // listen to whether components velocity vectors should be on
    model.componentsVelocityVectorsOnProperty.link( function( componentsVelocityVectorsOn ) {
      xVelocityArrow.visible = componentsVelocityVectorsOn;
      yVelocityArrow.visible = componentsVelocityVectorsOn;
    } );

    // listen to whether total velocity vector should be on
    model.totalVelocityVectorOnProperty.link( function( totalVelocityVectorOn ) {
      totalVelocityArrow.visible = totalVelocityVectorOn;
    } );

    // listen to whether components acceleration vectors should be on
    model.componentsAccelerationVectorsOnProperty.link( function( componentsAccelerationVectorsOn ) {
      xAccelerationArrow.visible = componentsAccelerationVectorsOn;
      yAccelerationArrow.visible = componentsAccelerationVectorsOn;
    } );

    Property.multilink( [ model.velocityVectorsOnProperty, model.forceVectorsOnProperty, model.totalOrComponentsProperty ],  function() {
      totalVelocityArrow.visible = model.velocityVectorsOn && model.totalOrComponents === 'total';
      xVelocityArrow.visible = model.velocityVectorsOn && model.totalOrComponents === 'components';
      yVelocityArrow.visible = model.velocityVectorsOn && model.totalOrComponents === 'components';
      forcesBox.visible = model.forceVectorsOn;
      freeBodyDiagram.visible = model.forceVectorsOn;
      totalForceArrow.visible = model.forceVectorsOn && model.totalOrComponents === 'total';
      xDragForceArrow.visible = model.forceVectorsOn && model.totalOrComponents === 'components';
      yDragForceArrow.visible = model.forceVectorsOn && model.totalOrComponents === 'components';
      forceGravityArrow.visible = model.forceVectorsOn && model.totalOrComponents === 'components';
    } );

    // listen to whether everything should be on
    // TODO: delete later
    // allVectorsOnProperty.link( function( allVectorsOn ) {
    //   xVelocityArrow.visible = allVectorsOn;
    //   yVelocityArrow.visible = allVectorsOn;
    //   totalVelocityArrow.visible = allVectorsOn;
    //   xAccelerationArrow.visible = allVectorsOn;
    //   yAccelerationArrow.visible = allVectorsOn;
    //   freeBodyDiagram.visible = allVectorsOn;
    //   forcesBox.visible = allVectorsOn;
    // } );

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
      freeBody.x = x + FREE_BODY_OFFSET.x;
      freeBody.y = y + FREE_BODY_OFFSET.y;
      xDragForceArrow.setTailAndTip( freeBody.x,
        freeBody.y,
        freeBody.x + self.transformedForceScalar * dataPoint.xDragForce,
        freeBody.y
      );
      yDragForceArrow.setTailAndTip( freeBody.x,
        freeBody.y,
        freeBody.x,
        freeBody.y - self.transformedForceScalar * dataPoint.yDragForce
      );
      forceGravityArrow.setTailAndTip( freeBody.x,
        freeBody.y,
        freeBody.x,
        freeBody.y - self.transformedForceScalar * dataPoint.forceGravity
      );

      // net force is zero if projectile is on ground
      var xTotalForce = dataPoint.y === 0 ? 0 : dataPoint.xDragForce;
      var yTotalForce = dataPoint.y === 0 ? 0 : dataPoint.yDragForce + dataPoint.forceGravity;
      totalForceArrow.setTailAndTip( freeBody.x,
        freeBody.y,
        freeBody.x + self.transformedForceScalar * xTotalForce,
        freeBody.y - self.transformedForceScalar * yTotalForce
      );

      forcesBox.setRectBounds( freeBodyDiagram.getChildBounds().dilated( FORCES_BOX_DILATION ) );
    } );

  }

  projectileMotion.register( 'ProjectileNode', ProjectileNode );

  return inherit( Node, ProjectileNode );
} );

