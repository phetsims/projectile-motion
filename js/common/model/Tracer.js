// Copyright 2016, University of Colorado Boulder

/**
 * Model for the tracer tool.
 * Knows about projectiles, which contain arrays of points on their projectiles.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  
  // constants
  var SENSING_RADIUS = 0.2; // meters, will change to view units. How close the tracer needs to get to a datapoint


  /**
   * @param {ObservableArray.<Projectile>} projectiles
   * @param {number} tracerX - x position of the tracer
   * @param {number} tracerY - y position of the tracer
   * @constructor
   */
  function Tracer( projectiles, tracerX, tracerY ) {

    // @public {Property.<Vector2>} position of the tracer
    this.positionProperty = new Property( new Vector2( tracerX, tracerY ) );

    // @public {Property.<DataPoint/null>} point that the tracer is displaying information about
    this.pointProperty = new Property( null );

    // @public {Property.<boolean>} whether the tracer is out in the play area (false when in toolbox)
    this.isActiveProperty = new Property( false );

    // @public {ObservableArray.<Trajectory>} array of projectiles in the model
    this.projectiles = projectiles;
  }

  projectileMotion.register( 'Tracer', Tracer );

  return inherit( Object, Tracer, {

    // @public resets properties of this tracer model
    reset: function() {
      this.positionProperty.reset();
      this.pointProperty.reset();
      this.isActiveProperty.reset();
    },

    // @public checks for if there is a point the tracer is close to. if so, updates pointProperty
    updateData: function() {
      var i;
      for ( i = this.projectiles.length - 1; i >= 0; i-- ) {
        var currentTrajectory = this.projectiles.get( i );
        var point = currentTrajectory.getNearestPoint( this.positionProperty.get().x, this.positionProperty.get().y );
        if ( point && point.distance( this.positionProperty.get() ) <= SENSING_RADIUS ) {
          this.pointProperty.set( point );
          return;
        }
      }
      this.pointProperty.set( null );
    },

  } );

} );

