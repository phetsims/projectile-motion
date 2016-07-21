// Copyright 2016, University of Colorado Boulder

/**
 * Model of a projectile
 * Notes: air resistance and altitude can immediately change the path of the trajectory, whereas other parameters
 * like velocity, angle, mass, diameter, dragcoefficient only affect the next projectile fired
 * Units are meters, kilograms, and seconds (mks)
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  // var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PropertySet = require( 'AXON/PropertySet' );

  // constants
  var SENSING_RADIUS = 0.2; // meters, will change to view units. How close the tracer needs to get to a datapoint


  /**
   * @param {ObservableArray.<Trajectory>} trajectories
   * @constructor
   */
  function Tracer( trajectories, tracerX, tracerY ) {
    // @public
    PropertySet.call( this, {
      x: tracerX,
      y: tracerY,
      time: null,
      range: null,
      height: null
    } );

    // @public {ObservableArray.<Trajectory>} array of trajectories in the model
    this.trajectories = trajectories;
  }

  projectileMotion.register( 'Tracer', Tracer );

  return inherit( PropertySet, Tracer, {

    // @private checks for if there is a point the tracer is close to
    // @returns {DataPoint|null}
    checkForPoint: function() {
      var i;
      for ( i = this.trajectories.length - 1; i >= 0; i-- ) {
        var currentTrajectory = this.trajectories.get( i );
        var point = currentTrajectory.getNearestPoint( this.x, this.y );
        if ( point && point.distanceXY( this.x, this.y ) <= SENSING_RADIUS ) {
          return point;
        }
      }
      return null;
    },

    // @public updates time, range, and height
    updateData: function() {
      var point = this.checkForPoint();

      // If no point has been found to be close enough to the tracer, set information to null.
      if ( !point ) {
        this.time = null;
        this.range = null;
        this.height = null;
        return;
      }

      // Otherwise, update the information.
      this.time = point.time;
      this.range = point.x;
      this.height = point.y;
    }
  } );

} );

