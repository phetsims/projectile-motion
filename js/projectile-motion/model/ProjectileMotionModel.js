// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Trajectory = require( 'PROJECTILE_MOTION/projectile-motion/model/Trajectory' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   * @constructor
   */
  function ProjectileMotionModel() {
    PropertySet.call( this, {
      velocity: 50,
      running: false // supposed to be false
    } );

    this.trajectory = new Trajectory( this.velocity, 10 );
    this.trajectories = new ObservableArray( [ this.trajectory ] );

    this.createTrajectory = function() {
      console.log( 'new trajectory' );

      // remove the old trajectory
      this.trajectories.pop();

      // add the new trajectory
      this.trajectories.push( new Trajectory( this.velocity, 10 ) );
    };

  }

  projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

  return inherit( PropertySet, ProjectileMotionModel, {

    reset: function() {
      this.trajectory.reset();
      this.trajectories.reset();
      this.running = false;
    },

    //TODO Called by the animation loop. Optional, so if your model has no animation, please delete this.
    step: function( dt ) {
      // console.log( this.velocity, this.running );
      if ( this.running ) {
        this.trajectories.forEach( function( trajectory ) {
          trajectory.step( dt );
        } );
      }
    }
  } );
} );

