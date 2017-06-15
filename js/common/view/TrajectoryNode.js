// Copyright 2016, University of Colorado Boulder

/**
 * View for a trajectory.
 * Listens to an observable array of DataPoints in the model to draw dots on the trajectory
 * Creates and contains projectileNodes
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ProjectileNode = require( 'PROJECTILE_MOTION/common/view/ProjectileNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  // constants
  var MAX_COUNT = ProjectileMotionConstants.MAX_NUMBER_OF_PROJECTILES;
  var DOT_DIAMETER = 4; // view units
  var PATH_WIDTH = 2;
  var CURRENT_PATH_COLOR = 'blue';
  var AIR_RESISTANCE_ON_COLOR = 'red';
  var TIME_PER_SHOWN_DOT = 48; // milliseconds

  /**
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - properties that determine which vectors are shown,
   * only needed to pass down to ProjectileNode
   * @param {Trajectory} trajectory - model for the trajectory
   * @param {ModelViewTransform2} modelViewTransform - meters to scale, inverted y axis, translated origin
   * @constructor
   */
  function TrajectoryNode(
    vectorVisibilityProperties,
    trajectory,
    modelViewTransform
  ) {
    var self = this;
    Node.call( this, { pickable: false } );

    var pathsLayer = new Node();
    var dotsLayer = new Node();
    var projectileNodesLayer = new Node();
    this.pathsLayer = pathsLayer;
    this.dotsLayer = dotsLayer;
    this.addChild( pathsLayer );
    this.addChild( dotsLayer );
    this.addChild( projectileNodesLayer );

    var viewLastPoint;

    function handleDataPointAdded( addedPoint ) {
      var viewAddedPoint = modelViewTransform.modelToViewPosition( new Vector2( addedPoint.x, addedPoint.y ) );

      if ( viewLastPoint ) {
        var pathStroke = addedPoint.airDensity > 0 ? AIR_RESISTANCE_ON_COLOR : CURRENT_PATH_COLOR;
        var lineSegment = new Line( viewLastPoint.x, viewLastPoint.y, viewAddedPoint.x, viewAddedPoint.y, {
          lineWidth: PATH_WIDTH,
          stroke: pathStroke
        } );
        pathsLayer.addChild( lineSegment );
      }
      viewLastPoint = viewAddedPoint.copy();

      // draw dot if it is time for data point should be shown
      if ( Util.toFixedNumber( addedPoint.time * 1000, 0 ) % TIME_PER_SHOWN_DOT === 0 ) {
        var addedPointNode = new Circle( DOT_DIAMETER / 2, {
          x: modelViewTransform.modelToViewX( addedPoint.x ),
          y: modelViewTransform.modelToViewY( addedPoint.y ),
          fill: 'black'
        } );
        dotsLayer.addChild( addedPointNode );
      }
    }

    // view listens to whether a datapoint has been added in the model
    trajectory.dataPoints.forEach( handleDataPointAdded );
    trajectory.dataPoints.addItemAddedListener( handleDataPointAdded );

    function handleProjectileObjectAdded( projectileObject ) {
      var newProjectileNode = new ProjectileNode(
        vectorVisibilityProperties,
        projectileObject.dataPointProperty,
        trajectory.projectileObjectType,
        trajectory.diameter,
        trajectory.dragCoefficient,
        modelViewTransform
      );
      projectileNodesLayer.addChild( newProjectileNode );
    }

    // view adds projectile object if another one is created in the model
    trajectory.projectileObjects.forEach( handleProjectileObjectAdded );
    trajectory.projectileObjects.addItemAddedListener( handleProjectileObjectAdded );

    // change decrease in opacity with each successive projectiled fired
    trajectory.rankProperty.link( function( rank ) {
      var opacity = ( MAX_COUNT - rank ) / MAX_COUNT;
      self.children.forEach( function( child ) {
        child.opacity = opacity;
      } );
      // TODO: move to front if it has been shifted to the most recent rank
      // Following implementation slows down sim
      // if ( rank == 0 ) {
      //   self.moveToFront();
      // }
    } );
  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );

