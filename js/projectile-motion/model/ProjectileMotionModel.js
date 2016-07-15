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
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   * @constructor
   */
  function ProjectileMotionModel() {
    var projectileMotionModel = this;
    PropertySet.call( projectileMotionModel, {

      // properties of the current projectile that will be fired
      velocity: ProjectileMotionConstants.DEFAULT_VELOCITY,
      angle: ProjectileMotionConstants.DEFAULT_ANGLE,
      mass: ProjectileMotionConstants.DEFAULT_MASS, // kg
      diameter: ProjectileMotionConstants.DEFAULT_DIAMETER, // meters
      dragCoefficient: ProjectileMotionConstants.DEFAULT_DRAG_COEFFICIENT,
      altitude: ProjectileMotionConstants.DEFAULT_ALTITUDE,
      airResistanceOn: ProjectileMotionConstants.DEFAULT_AIR_RESISTANCE_ON, // should default to false

      running: false, // supposed to be false, replace later with paused
      resetListener: 0, // a clumsy way that lets view objects listen for a reset
      units: { name: 'meters', multiplier: 1 }, // for common code measuringtape
      measuringTape: true
    } );

    // properties that do not need to be linked
    this.cannonX = ProjectileMotionConstants.INITIAL_TRAJECTORY_X;
    this.cannonY = ProjectileMotionConstants.INITIAL_TRAJECTORY_Y;

    // default trajectory
    this.trajectory = new Trajectory( this, this.velocity, this.angle, this.mass, this.diameter,
      this.dragCoefficient );

    // observable array of trajectories
    this.trajectories = new ObservableArray( [ this.trajectory ] );
    // debugger;

    // called when fire button is pressed
    this.addTrajectory = function() {
      projectileMotionModel.trajectories.push( new Trajectory( this, this.velocity, this.angle, this.mass,
        this.diameter, this.dragCoefficient ) );
    };

    // // set velocity and angle, and reset position to origin
    // projectileMotionModel.setInitialConditions = function() {
    //   projectileMotionModel.trajectory.setVelocityAndAngle( projectileMotionModel.velocity, projectileMotionModel.angle );
    //   projectileMotionModel.trajectory.resetPosition();
    // };

    // called on when fire button is pressed
    projectileMotionModel.cannonFired = function() {
      projectileMotionModel.addTrajectory();
      projectileMotionModel.running = true;
    };
  }

  projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

  return inherit( PropertySet, ProjectileMotionModel, {

    reset: function() {
      // debugger;
      // reset properties of this model.
      // may replace with this.reset(), depending.
      this.velocityProperty.reset();
      this.angleProperty.reset();
      this.massProperty.reset();
      this.diameterProperty.reset();
      this.airResistanceOnProperty.reset();
      this.dragCoefficientProperty.reset();
      this.altitudeProperty.reset();
      this.runningProperty.reset();
      this.resetListener = this.resetListener + 1;

      this.trajectory.reset();
      this.trajectories.reset();
    },

    // @public animates trajectory if running
    step: function( dt ) {
      // console.log( this.airResistanceOn );
      if ( this.running ) {
        this.trajectories.forEach( function( trajectory ) { trajectory.step( dt ); } );
      }
    }
  } );
} );

