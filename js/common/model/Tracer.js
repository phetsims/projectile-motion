// Copyright 2016-2017, University of Colorado Boulder

/**
 * Model for the tracer tool.
 * Knows about trajectories, which contain arrays of points on their paths
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Property = require( 'AXON/Property' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Vector2 = require( 'DOT/Vector2' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Util = require( 'DOT/Util' );

  // constants
  var SENSING_RADIUS = 0.2; // meters, will change to view units. How close the tracer needs to get to a datapoint
  var TIME_PER_MINOR_DOT = ProjectileMotionConstants.TIME_PER_MINOR_DOT; // milliseconds

  /**
   * @param {ObservableArray.<Trajectory>} trajectories
   * @param {number} tracerX - x position of the tracer
   * @param {number} tracerY - y position of the tracer
   * @constructor
   */
  function Tracer( trajectories, tracerX, tracerY ) {

    // @public {Property.<Vector2>} position of the tracer
    this.positionProperty = new Property( new Vector2( tracerX, tracerY ) );

    // @public {Property.<DataPoint||null>} point that the tracer is displaying information about, or null if no info displayed
    this.dataPointProperty = new Property( null );

    // @public whether the tracer is out in the play area (false when in toolbox)
    this.isActiveProperty = new BooleanProperty( false );

    // @public {ObservableArray.<Trajectory>} array of trajectories in the model
    this.trajectories = trajectories;

    this.trajectories.addItemRemovedListener( this.updateData.bind( this ) );
  }

  projectileMotion.register( 'Tracer', Tracer );

  return inherit( Object, Tracer, {

    /**
     * Reset these Properties
     * @public
     * @override
     */
    reset: function() {
      this.positionProperty.reset();
      this.dataPointProperty.reset();
      this.isActiveProperty.reset();
    },

    /**
     * Checks for if there is a point the tracer is close to. If so, updates dataPointProperty
     * @public
     */
    updateData: function() {
      for ( var i = this.trajectories.length - 1; i >= 0; i-- ) {
        var currentTrajectory = this.trajectories.get( i );
        if ( currentTrajectory.apexPoint && currentTrajectory.apexPoint.position.distance( this.positionProperty.get() ) <= SENSING_RADIUS ) { // current point shown is apex and it is still within sensing radius
          this.dataPointProperty.set( currentTrajectory.apexPoint );
          return;
        }
        var point = currentTrajectory.getNearestPoint( this.positionProperty.get().x, this.positionProperty.get().y );
        var pointIsReadable = point &&
          ( point.apex || point.position.y === 0 || Util.toFixedNumber( point.time * 1000, 0 ) % TIME_PER_MINOR_DOT === 0 );
        if ( pointIsReadable && point.position.distance( this.positionProperty.get() ) <= SENSING_RADIUS ) {
          this.dataPointProperty.set( point );
          return;
        }
      }
      this.dataPointProperty.set( null );
    },

    /**
     * Checks if the given point is close enough to the tracer and updates information if so
     * @public
     *
     * @param {DataPoint} point
     */
    updateDataIfWithinRange: function( point ) {

      // point can be read by tracer if it exists, it is on the ground, or it is the right timestep
      var pointIsReadable = point &&
        ( point.apex || point.position.y === 0 || Util.toFixedNumber( point.time * 1000, 0 ) % TIME_PER_MINOR_DOT === 0 );
      if ( pointIsReadable && point.position.distance( this.positionProperty.get() ) <= SENSING_RADIUS ) {
        this.dataPointProperty.set( point );
      }
    }
  } );

} );

