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
  var Trajectory = require( 'PROJECTILE_MOTION/common/model/Trajectory' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   * @constructor
   */
  function ProjectileMotionModel() {
    var projectileMotionModel = this;
    PropertySet.call( projectileMotionModel, {

      // properties of the current projectile that will be fired
      height: ProjectileMotionConstants.HEIGHT_DEFAULT,
      angle: ProjectileMotionConstants.ANGLE_DEFAULT,
      velocity: ProjectileMotionConstants.VELOCITY_DEFAULT,
      mass: ProjectileMotionConstants.MASS_DEFAULT, // kg
      diameter: ProjectileMotionConstants.DIAMETER_DEFAULT, // meters
      dragCoefficient: ProjectileMotionConstants.DRAG_COEFFICIENT_DEFAULT,
      altitude: ProjectileMotionConstants.ALTITUDE_DEFAULT,
      airResistanceOn: ProjectileMotionConstants.AIR_RESISTANCE_ON_DEFAULT, // should default to false

      velocityVectorComponentsOn: false,

      speed: 'normal',
      isPlaying: true,
      units: { name: 'meters', multiplier: 1 }, // for common code measuringtape

      measuringTape: true,
      measuringTapeX: ProjectileMotionConstants.TAPE_MEASURE_X_DEFAULT,
      measuringTapeY: ProjectileMotionConstants.TAPE_MEASURE_Y_DEFAULT,

      targetX: ProjectileMotionConstants.TARGET_X_DEFAULT,

      showScore: false, // whether to show you have scored
      scoredTime: 0 // amount of time Score! has been visible
    } );

    // observable array of trajectories
    projectileMotionModel.trajectories = new ObservableArray();

    // called when fire button is pressed
    projectileMotionModel.addTrajectory = function() {
      projectileMotionModel.trajectories.push( new Trajectory( projectileMotionModel, 0, projectileMotionModel.height, projectileMotionModel.velocity, projectileMotionModel.angle, projectileMotionModel.mass,
        projectileMotionModel.diameter, projectileMotionModel.dragCoefficient ) );
    };

    // called on when fire button is pressed
    projectileMotionModel.cannonFired = function() {
      projectileMotionModel.isPlaying = true;
      projectileMotionModel.addTrajectory();
    };
  }

  projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

  return inherit( PropertySet, ProjectileMotionModel, {

    reset: function() {

      // reset all properties by calling super class
      PropertySet.prototype.reset.call( this );

      // remove all trajectories
      this.trajectories.reset();
    },

    // @public animates trajectory if running
    step: function( dt ) {
      // prevent sudden dt bursts when the user comes back to the tab after a while
      dt = Math.min( 0.016, dt );
      if ( this.isPlaying ) {
        var adjustedDT = this.speed === 'normal' ? dt : dt * 0.33;
        this.stepInternal( adjustedDT );
      }
    },

    stepInternal: function( dt ) {
      this.trajectories.forEach( function( trajectory ) { trajectory.step( dt ); } );
      if ( this.showScore ) {
        this.scoredTime += dt;
      }
      if ( this.scoredTime >= ProjectileMotionConstants.SHOW_SCORE_TIME ) { // show score for two seconds
        this.showScore = false;
        this.scoredTime = 0;
      }
    }
  } );
} );

