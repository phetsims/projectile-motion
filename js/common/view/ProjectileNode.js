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
  var ARROW_FILL_COLOR = 'rgb( 100, 100, 100 )';
  var ARROW_HEAD_WIDTH = 12;
  var ARROW_TAIL_WIDTH = 6;
  var ARROW_SIZE_DEFAULT = 1;

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
    this.tranformedArrowSize = this.tranformedUnit * ARROW_SIZE_DEFAULT;

    // add view for projectile
    if ( objectType ) {
      this.projectileView = ProjectileObjectViewFactory.createObjectView( objectType, modelViewTransform );
    } else {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      this.projectileView = ProjectileObjectViewFactory.createCustom( transformedBallSize / 2, dragCoefficient );
    }
    this.addChild( this.projectileView );

    // add vector view for velocity x component
    var velocityXArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ARROW_FILL_COLOR,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    self.addChild( velocityXArrow );

    // add vector view for velocity y component
    var velocityYArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ARROW_FILL_COLOR,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    self.addChild( velocityYArrow );

    // listen to whether velocity vectors should be on
    velocityVectorComponentsOnProperty.link( function( velocityVectorComponentsOn ) {
      velocityXArrow.visible = velocityVectorComponentsOn;
      velocityYArrow.visible = velocityVectorComponentsOn;
    } );

    // update if data point changes
    dataPointProperty.link( function( dataPoint ) {
      self.projectileView.x = modelViewTransform.modelToViewX( dataPoint.x );
      self.projectileView.y = modelViewTransform.modelToViewY( dataPoint.y );

      var x = modelViewTransform.modelToViewX( dataPoint.x );
      var y = modelViewTransform.modelToViewY( dataPoint.y );
      velocityXArrow.setTailAndTip( x,
        y,
        x + self.tranformedArrowSize * dataPoint.xVelocity,
        y
      );
      velocityYArrow.setTailAndTip( x,
        y,
        x,
        y - self.tranformedArrowSize * dataPoint.yVelocity
      );

    } );

  }

  projectileMotion.register( 'ProjectileNode', ProjectileNode );

  return inherit( Node, ProjectileNode );
} );

