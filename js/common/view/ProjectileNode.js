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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );

  // constants
  var VELOCITY_ARROW_FILL = 'rgb( 50, 255, 50 )';
  var ACCELERATION_ARROW_FILL = 'rgb( 255, 255, 50 )';
  var ARROW_HEAD_WIDTH = 12;
  var ARROW_TAIL_WIDTH = 6;
  var VELOCITY_SCALAR = 1; // scales the velocity arrow representations
  var ACCELERATION_SCALAR = 0.5; // scales the acceleration arrow represenations

  /**
   * @param {Property.<DataPoint>} dataPointProperty - data for where the projectile is
   * @param {string} objectType - pumpkin? human? canonball?
   * @param {number} diameter - how big the object is
   * @param {number} dragCoefficient - shape of the object
   * @param {Property.<boolean>} - velocityVectorComponentsOnProperty
   * @param {ModelViewTransform2} modelViewTransform - meters to scale, inverted y axis, translated origin
   * @constructor
   */
  function ProjectileNode(
                          dataPointProperty,
                          objectType,
                          diameter,
                          dragCoefficient,
                          modelViewTransform,
                          velocityVectorComponentsOnProperty,
                          options
  ) {

    var self = this;
    options = options || {};
    Node.call( self, options );

    this.tranformedUnit = modelViewTransform.modelToViewDeltaX( 1 );
    this.tranformedVelocityScalar = this.tranformedUnit * VELOCITY_SCALAR;
    this.tranformedAccelerationScalar = this.tranformedUnit * ACCELERATION_SCALAR;

    // add view for projectile
    if ( objectType ) {
      this.projectileObjectView = ProjectileObjectViewFactory.createObjectView( objectType, modelViewTransform );
    } else {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      this.projectileObjectView = ProjectileObjectViewFactory.createCustom( transformedBallSize / 2, dragCoefficient );
    }
    this.addChild( this.projectileObjectView );

    // add vector view for velocity x component
    var velocityXArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    self.addChild( velocityXArrow );

    // add vector view for velocity y component
    var velocityYArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    self.addChild( velocityYArrow );

    // add vector view for total velocity
    var totalVelocityArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: VELOCITY_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    self.addChild( totalVelocityArrow );

    // add vector view for acceleration x component
    var accelerationXArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    self.addChild( accelerationXArrow );

    // add vector view for acceleration y component
    var accelerationYArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ACCELERATION_ARROW_FILL,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    self.addChild( accelerationYArrow );

    // listen to whether velocity vectors should be on
    velocityVectorComponentsOnProperty.link( function( velocityVectorComponentsOn ) {
      velocityXArrow.visible = velocityVectorComponentsOn;
      velocityYArrow.visible = velocityVectorComponentsOn;
      totalVelocityArrow.visible = velocityVectorComponentsOn;
      accelerationXArrow.visible = velocityVectorComponentsOn;
      accelerationYArrow.visible = velocityVectorComponentsOn;
    } );

    // update if data point changes
    dataPointProperty.link( function( dataPoint ) {
      self.projectileObjectView.x = modelViewTransform.modelToViewX( dataPoint.x );
      self.projectileObjectView.y = modelViewTransform.modelToViewY( dataPoint.y );

      var angle = Math.atan( dataPoint.yVelocity / dataPoint.xVelocity ) || 0;
      self.projectileObjectView.setRotation( -angle );

      var x = modelViewTransform.modelToViewX( dataPoint.x );
      var y = modelViewTransform.modelToViewY( dataPoint.y );
      velocityXArrow.setTailAndTip( x,
        y,
        x + self.tranformedVelocityScalar * dataPoint.xVelocity,
        y
      );
      velocityYArrow.setTailAndTip( x,
        y,
        x,
        y - self.tranformedVelocityScalar * dataPoint.yVelocity
      );
      totalVelocityArrow.setTailAndTip( x,
        y,
        x + self.tranformedVelocityScalar * dataPoint.xVelocity,
        y - self.tranformedVelocityScalar * dataPoint.yVelocity
      );
      accelerationXArrow.setTailAndTip( x,
        y,
        x + self.tranformedAccelerationScalar * dataPoint.xAcceleration,
        y
      );
      accelerationYArrow.setTailAndTip( x,
        y,
        x,
        y - self.tranformedAccelerationScalar * dataPoint.yAcceleration
      );
    } );

  }

  projectileMotion.register( 'ProjectileNode', ProjectileNode );

  return inherit( Node, ProjectileNode );
} );

