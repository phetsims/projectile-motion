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
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/projectile-motion/ProjectileMotionConstants' );

  /**
   * @constructor
   */
  function ProjectileMotionModel() {
    var projectileMotionModel = this;
    PropertySet.call( projectileMotionModel, {
      velocity: 18,
      angle: 80,
      mass: 5, // kg
      diameter: 0.37, // meters
      dragCoefficient: 6,
      airResistanceOn: true, // should default to false
      running: false // supposed to be false, replace later with paused
    } );

    this.cannonX = ProjectileMotionConstants.INITIAL_TRAJECTORY_X;
    this.cannonY = ProjectileMotionConstants.INITIAL_TRAJECTORY_Y;

    this.trajectory = new Trajectory( this.velocity, this.angle, this.mass, this.diameter,
      this.dragCoefficient, this.airResistanceOn );

    // set velocity and angle, and reset position to origin
    projectileMotionModel.setInitialConditions = function() {
      projectileMotionModel.trajectory.setVelocityAndAngle( projectileMotionModel.velocity, projectileMotionModel.angle );
      projectileMotionModel.trajectory.resetPosition();
    };

    // called on when fire button is pressed
    projectileMotionModel.cannonFired = function() {
      projectileMotionModel.setInitialConditions();
      projectileMotionModel.running = true;
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
      // this.trajectory.showPaths = false;
      this.trajectory.resetPosition();
      // this.trajectory.reset();
    },

    // @public animates trajectory if running
    step: function( dt ) {
      if ( this.running ) {
        this.trajectory.step( dt );
      }
    }
  } );
} );

