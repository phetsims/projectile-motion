// Copyright 2016, University of Colorado Boulder

/**
 * View for the projectile. Listens to projectile model and whether velocity vectors should be turned on.
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
  var Property = require( 'AXON/Property' );

  // constants
  var ARROW_FILL_COLOR = 'rgb( 100, 100, 100 )';
  var ARROW_HEAD_WIDTH = 12;
  var ARROW_TAIL_WIDTH = 6;
  var ARROW_SIZE_DEFAULT = 1;

  /**
   * @param {Projectile} projectile - model for the projectile
   * @param {Property.<boolean>} velocityVectorComponentsOnProperty - whether those vectors should be visible
   * @param {ModelViewTransform2} modelViewTransform - meters to scale, inverted y axis, translated origin
   * @constructor
   */
  function ProjectileNode( projectile, velocityVectorComponentsOnProperty, modelViewTransform, options ) {
    var thisNode = this;
    options = options || {};
    Node.call( thisNode, options );

    this.tranformedUnit = modelViewTransform.modelToViewDeltaX( 1 );
    this.tranformedArrowSize = this.tranformedUnit * ARROW_SIZE_DEFAULT;

    // add view for projectile
    if ( projectile.projectileObject ) {
      this.projectileView = ProjectileObjectViewFactory.createObjectView( projectile.projectileObject, modelViewTransform );
    } else {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( projectile.diameter );
      this.projectileView = ProjectileObjectViewFactory.createCustom( transformedBallSize / 2, projectile.dragCoefficient );
    }
    this.addChild( this.projectileView );

    // move projectile view if new data points are added
    function handleDataPointAdded( addedPoint ) {
      // move projectile to new position
      thisNode.projectileView.x = modelViewTransform.modelToViewX( addedPoint.x );
      thisNode.projectileView.y = modelViewTransform.modelToViewY( addedPoint.y );
    }

    // view listens to whether a datapoint has been added in the model
    projectile.dataPoints.forEach( handleDataPointAdded );
    projectile.dataPoints.addItemAddedListener( handleDataPointAdded );

    // add vector view for velocity x component
    var velocityXArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ARROW_FILL_COLOR,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    thisNode.addChild( velocityXArrow );

    // add vector view for velocity y component
    var velocityYArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ARROW_FILL_COLOR,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    thisNode.addChild( velocityYArrow );

    // update velocity vector visibilities, positions, and magnitudes
    Property.multilink( [
      projectile.xVelocityProperty,
      projectile.yVelocityProperty,
      velocityVectorComponentsOnProperty
    ], function( xVelocity, yVelocity, velocityVectorComponentsOn ) {
      velocityXArrow.visible = velocityVectorComponentsOn;
      velocityYArrow.visible = velocityVectorComponentsOn;

      // update size and position if checkbox is checked
      if ( velocityVectorComponentsOn ) {
        var x = modelViewTransform.modelToViewX( projectile.x );
        var y = modelViewTransform.modelToViewY( projectile.y );
        velocityXArrow.setTailAndTip( x,
          y,
          x + thisNode.tranformedArrowSize * xVelocity,
          y
        );
        velocityYArrow.setTailAndTip( x,
          y,
          x,
          y - thisNode.tranformedArrowSize * yVelocity
        );
      }
    } );

  }

  projectileMotion.register( 'ProjectileNode', ProjectileNode );

  return inherit( Node, ProjectileNode );
} );

