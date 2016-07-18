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
      height: ProjectileMotionConstants.INITIAL_CANNON_Y,
      angle: ProjectileMotionConstants.DEFAULT_ANGLE,
      velocity: ProjectileMotionConstants.DEFAULT_VELOCITY,
      mass: ProjectileMotionConstants.DEFAULT_MASS, // kg
      diameter: ProjectileMotionConstants.DEFAULT_DIAMETER, // meters
      dragCoefficient: ProjectileMotionConstants.DEFAULT_DRAG_COEFFICIENT,
      altitude: ProjectileMotionConstants.DEFAULT_ALTITUDE,
      airResistanceOn: ProjectileMotionConstants.DEFAULT_AIR_RESISTANCE_ON, // should default to false

      velocityVectorComponentsOn: false,

      speed: 'normal',
      isPlaying: true,
      units: { name: 'meters', multiplier: 1 }, // for common code measuringtape

      measuringTape: true,
      measuringTapeX: ProjectileMotionConstants.INITIAL_TAPE_MEASURE_X,
      measuringTapeY: ProjectileMotionConstants.INITIAL_TAPE_MEASURE_Y,

      cannonX: ProjectileMotionConstants.INITIAL_CANNON_X
    } );

    // observable array of trajectories
    projectileMotionModel.trajectories = new ObservableArray();

    // called when fire button is pressed
    projectileMotionModel.addTrajectory = function() {
      projectileMotionModel.trajectories.push( new Trajectory( projectileMotionModel, projectileMotionModel.cannonX, projectileMotionModel.height, projectileMotionModel.velocity, projectileMotionModel.angle, projectileMotionModel.mass,
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
      // reset properties of the projectile
      this.velocityProperty.reset();
      this.angleProperty.reset();
      this.massProperty.reset();
      this.diameterProperty.reset();
      this.dragCoefficientProperty.reset();

      // reset properties of the environment
      this.airResistanceOnProperty.reset();
      this.altitudeProperty.reset();

      this.speedProperty.reset();
      this.isPlayingProperty.reset();

      // the following matters if user has changed the height of the cannon
      this.cannonXProperty.reset();
      this.heightProperty.reset();

      // resets the position of the measuring tape
      this.measuringTapeXProperty.reset();
      this.measuringTapeYProperty.reset();

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
    }
  } );
} );

