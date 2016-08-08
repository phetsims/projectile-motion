// Copyright 2016, University of Colorado Boulder

/**
 * View for a trajectory.
 * Listens to an observable array in the model to draw dots on the trajectory.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  // var Shape = require( 'KITE/Shape' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Vector2 = require( 'DOT/Vector2' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );

  // constants
  var MAX_COUNT = ProjectileMotionConstants.MAX_NUMBER_OF_PROJECTILES;
  var DOT_DIAMETER = 4; // view units
  var PATH_WIDTH = 2;
  var CURRENT_PATH_COLOR = 'blue';
  var AIR_RESISTANCE_ON_COLOR = 'red';
  var TIME_PER_SHOWN_DOT = 48; // milliseconds

  // var OLD_PATH_COLOR = 'gray';

  /**
   * @param {Projectile} projectile - model for the projectile
   * @constructor
   */
  function TrajectoryNode( projectile, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    var pathsLayer = new Node();
    var dotsLayer = new Node;
    this.addChild( pathsLayer );
    this.addChild( dotsLayer );

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

      // TODO: change color of dot if air resistance was on. May have to add something in model.
      // Create and add the view representation for each datapoint.
      // TODO: pull out datapoint radius into constants

      // draw dot if it is time for data point should be shown
      if ( ( addedPoint.time * 1000 ).toFixed( 0 ) % TIME_PER_SHOWN_DOT === 0 ) {
        var addedPointNode = new Circle( DOT_DIAMETER / 2, {
          x: modelViewTransform.modelToViewX( addedPoint.x ),
          y: modelViewTransform.modelToViewY( addedPoint.y ),
          fill: 'black'
        } );
        dotsLayer.addChild( addedPointNode );
      }
    }

    // view listens to whether a datapoint has been added in the model
    projectile.dataPoints.forEach( handleDataPointAdded );
    projectile.dataPoints.addItemAddedListener( handleDataPointAdded );

    // change color and decrease in opacity which each success next projectile fired
    projectile.countRankProperty.link( function( count ) {
      var opacity = ( MAX_COUNT - count ) / MAX_COUNT;
      thisNode.children.forEach( function( child ) {
        child.opacity = opacity;
      } );
    } );
  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );

