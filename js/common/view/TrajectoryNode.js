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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ProjectileNode = require( 'PROJECTILE_MOTION/common/view/ProjectileNode' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  // constants
  var MAX_COUNT = ProjectileMotionConstants.MAX_NUMBER_OF_PROJECTILES;
  var DOT_RADIUS = ProjectileMotionConstants.DOT_RADIUS; // view units
  var PATH_WIDTH = 2;
  var CURRENT_PATH_COLOR = 'blue';
  var AIR_RESISTANCE_ON_COLOR = 'rgb( 252, 40, 252 )';
  var TIME_PER_SHOWN_DOT = ProjectileMotionConstants.TIME_PER_SHOWN_DOT; // milliseconds
  var PATH_MIN_OPACITY = 0;
  var PATH_MAX_OPACITY = 1;
  var DOTS_MIN_OPACITY = 0;
  var DOTS_MAX_OPACITY = 0.5;

  /**
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - properties that determine which vectors are shown,
   * only needed to pass down to ProjectileNode
   * @param {Trajectory} trajectory - model for the trajectory
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @constructor
   */
  function TrajectoryNode(
    vectorVisibilityProperties,
    trajectory,
    transformProperty
  ) {
    var self = this;
    Node.call( this, { pickable: false, preventFit: true } );

    var scratchVector = new Vector2();
    var scratchVector2 = new Vector2();

    var currentPathShape = null;
    var currentPathStroke = null;

    this.pathsLayer = new Node();
    var projectileNodesLayer = new Node();

    var dotsShape = new Shape();
    var dotsPath = new Path( dotsShape, {
      fill: 'black'
    } );

    this.addChild( projectileNodesLayer );
    this.addChild( this.pathsLayer );
    this.addChild( dotsPath );


    var viewLastPosition = null;

    function handleDataPointAdded( addedPoint ) {
      var viewAddedPosition = scratchVector.set( addedPoint.position );
      transformProperty.get().getMatrix().multiplyVector2( viewAddedPosition );

      if ( viewLastPosition ) {
        var pathStroke = addedPoint.airDensity > 0 ? AIR_RESISTANCE_ON_COLOR : CURRENT_PATH_COLOR;
        if ( !currentPathShape || currentPathStroke !== pathStroke ) {
          currentPathShape = new Shape().moveTo( viewLastPosition.x, viewLastPosition.y );
          currentPathStroke = pathStroke;
          self.pathsLayer.addChild( new Path( currentPathShape, {
            lineWidth: PATH_WIDTH,
            stroke: pathStroke
          } ) );
        }
        currentPathShape.lineTo( viewAddedPosition.x, viewAddedPosition.y );
      }
      viewLastPosition = scratchVector2.set( viewAddedPosition );

      // draw dot if it is time for data point should be shown
      if ( Util.toFixedNumber( addedPoint.time * 1000, 0 ) % TIME_PER_SHOWN_DOT === 0 ) {

        dotsShape.moveTo( viewAddedPosition.x + DOT_RADIUS, viewAddedPosition.y )
                 .circle( viewAddedPosition.x, viewAddedPosition.y, DOT_RADIUS );
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
        transformProperty.get()
      );
      projectileNodesLayer.addChild( newProjectileNode );
    }

    // view adds projectile object if another one is created in the model
    trajectory.projectileObjects.forEach( handleProjectileObjectAdded );
    trajectory.projectileObjects.addItemAddedListener( handleProjectileObjectAdded );

    function updateTransform( transform ) {
      self.pathsLayer.removeAllChildren();

      currentPathShape = null;
      currentPathStroke = null;

      dotsShape = new Shape();
      dotsPath.shape = dotsShape;

      viewLastPosition = null;
      trajectory.dataPoints.forEach( handleDataPointAdded );
      projectileNodesLayer.removeAllChildren();
      trajectory.projectileObjects.forEach( handleProjectileObjectAdded );
    }

    // update if model view transform changes
    transformProperty.lazyLink( updateTransform );

    function updateOpacity( rank ) {
      var strength = ( MAX_COUNT - rank ) / MAX_COUNT;
      self.pathsLayer.opacity = PATH_MIN_OPACITY + strength * ( PATH_MAX_OPACITY - PATH_MIN_OPACITY );
      projectileNodesLayer.opacity = self.pathsLayer.opacity;
      dotsPath.opacity = DOTS_MIN_OPACITY + strength * ( DOTS_MAX_OPACITY - DOTS_MIN_OPACITY );
    }

    // change decrease in opacity with each successive projectiled fired
    trajectory.rankProperty.link( updateOpacity );

    var disposeProjectileNode = function( projectileNode ) {
      projectileNode.dispose();
    };

    this.disposeTrajectoryNode = function() {
      transformProperty.unlink( updateTransform );
      trajectory.rankProperty.unlink( updateOpacity );
      projectileNodesLayer.children.forEach( disposeProjectileNode );
    };
  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode, {

    /**
     * Dispose this trajectory for memory management
     * 
     * @public
     * @override
     */
    dispose: function() {
      this.disposeTrajectoryNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );

