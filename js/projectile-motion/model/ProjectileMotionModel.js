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

  /**
   * @constructor
   */
  function ProjectileMotionModel() {
    PropertySet.call( this, {
      velocity: 18,
      angle: 80,
      running: false // supposed to be false
    } );

    this.trajectory = new Trajectory( this.velocity, this.angle );

    this.setInitialConditions = function() {
      this.trajectory.setVelocityAndAngle( this.velocity, this.angle );
      this.trajectory.resetPosition();
    };

    this.cannonFired = function() {
      this.setInitialConditions();
      this.trajectory.focused = false;
    };
  }

  projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

  return inherit( PropertySet, ProjectileMotionModel, {

    reset: function() {
      // reset properties of this model.
      // may replace with this.reset(), depending.
      this.velocityProperty.reset();
      this.angleProperty.reset();
      this.runningProperty.reset();

      // reset the trajectory, resetting to initial velocity and angle
      this.trajectory.reset();
    },

    // @public animates trajectory if running
    step: function( dt ) {
      if ( this.running ) {
        this.trajectory.step( dt );
      }
    }
  } );
} );

