// Copyright 2016, University of Colorado Boulder

/**
 * Trajectory view.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  // var Property = require( 'AXON/Property' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var Shape = require( 'KITE/Shape' );
  // var Vector2 = require( 'DOT/Vector2' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Property = require( 'AXON/Property' );

  // constants
  var COLOR = 'black';
  // var PATH_OPTIONS = { stroke: 'black', lineWidth: 2 }; // width arbitrary
  // constants
  var ARROW_FILL_COLOR = 'rgb(100,100,100)';
  var ARROW_HEAD_WIDTH = 12;
  var ARROW_TAIL_WIDTH = 6;
  var ARROW_SIZE_DEFAULT = 1; // can scale down

  /**
   * @param {Trajectory} trajectory - model for the trajectory
   * @param {Property} velocityVectorComponentsOnProperty - whether those vectors should be visible
   * @param {ModelViewTransform2} modelViewTransform - meters to scale, inverted y axis, translated origin
   * @constructor
   */
  function TrajectoryNode( trajectory, velocityVectorComponentsOnProperty, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode, { pickable: false } );
    // debugger;

    this.transformedBallSize = modelViewTransform.modelToViewDeltaX( trajectory.diameter );
    this.tranformedUnit = modelViewTransform.modelToViewDeltaX( 1 );
    this.tranformedArrowSize = this.tranformedUnit * ARROW_SIZE_DEFAULT;

    // node drawn
    thisNode.projectile = new Circle( this.transformedBallSize / 2, {
      x: modelViewTransform.modelToViewX( trajectory.x ),
      y: modelViewTransform.modelToViewY( trajectory.y ),
      fill: COLOR
    } );

    thisNode.addChild( thisNode.projectile );

    // add vector for velocity x component
    var velocityXArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ARROW_FILL_COLOR,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    thisNode.addChild( velocityXArrow );

    // add vector for velocity y component
    var velocityYArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ARROW_FILL_COLOR,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    thisNode.addChild( velocityYArrow );

    Property.multilink( [
      trajectory.xVelocityProperty,
      trajectory.yVelocityProperty,
      velocityVectorComponentsOnProperty
    ], function( xVelocity, yVelocity, velocityVectorComponentsOn ) {
      velocityXArrow.visible = velocityVectorComponentsOn;
      velocityYArrow.visible = velocityVectorComponentsOn;
      
      // update size and position if checkbox is checked
      if ( velocityVectorComponentsOn ) {
        var x = modelViewTransform.modelToViewX( trajectory.x );
        var y = modelViewTransform.modelToViewY( trajectory.y );
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


    // thisNode.trajectoryShape = new Shape();
    // thisNode.trajectoryShape.moveToPoint( modelViewTransform.modelToViewPosition( thisNode.projectile.center ) );

    // thisNode.trajectoryPath = new Path( thisNode.trajectoryShape, PATH_OPTIONS );

    // thisNode.addChild( thisNode.trajectoryPath );

    // watch for if the trajectory changes location
    trajectory.xProperty.lazyLink( function() {
      // if it's going off screen in the model, stop drawing it screen
      // if (
      //   modelViewTransform.modelToViewX( trajectory.x ) < thisNode.parents[ 0 ].layoutBounds.minX ||
      //   modelViewTransform.modelToViewX( trajectory.x ) > thisNode.parents[ 0 ].layoutBounds.maxX ||
      //   modelViewTransform.modelToViewY( trajectory.y ) < thisNode.parents[ 0 ].layoutBounds.minY ||
      //   modelViewTransform.modelToViewY( trajectory.y ) > thisNode.parents[ 0 ].layoutBounds.maxY
      // ) {
      //   console.log( thisNode.parents[ 0 ].layoutBounds );
      //   return;
      // }
      thisNode.projectile.x = modelViewTransform.modelToViewX( trajectory.x );
      thisNode.projectile.y = modelViewTransform.modelToViewY( trajectory.y );

      // thisNode.trajectoryShape.lineToPoint( thisNode.projectile.center );


    } );

    trajectory.yProperty.lazyLink( function() {
      // if it's going off screen in the model, stop it right before
      // if (
      //   modelViewTransform.modelToViewX( trajectory.x ) < thisNode.parents[ 0 ].layoutBounds.minX ||
      //   modelViewTransform.modelToViewX( trajectory.x ) > thisNode.parents[ 0 ].layoutBounds.maxX ||
      //   modelViewTransform.modelToViewY( trajectory.y ) < thisNode.parents[ 0 ].layoutBounds.minY ||
      //   modelViewTransform.modelToViewY( trajectory.y ) > thisNode.parents[ 0 ].layoutBounds.maxY
      // ) {
      //   // console.log( thisNode.parents[ 0 ].layoutBounds );
      //   return;
      // }
      thisNode.projectile.y = modelViewTransform.modelToViewY( trajectory.y );
      thisNode.projectile.x = modelViewTransform.modelToViewX( trajectory.x );

      // thisNode.trajectoryShape.lineToPoint( thisNode.projectile.center );

    } );

    // trajectory.showPathsProperty.link( function( showPaths ) {
    //   // showPaths tells you if you want to see the path of the projectory
    //   if ( !showPaths ) {
    //     // erase paths
    //     thisNode.trajectoryShape.subpaths = [];
    //   }
    // } );

  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );

