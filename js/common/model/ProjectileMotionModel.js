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
      velocity: ProjectileMotionConstants.DEFAULT_VELOCITY,
      angle: ProjectileMotionConstants.DEFAULT_ANGLE,
      mass: ProjectileMotionConstants.DEFAULT_MASS, // kg
      diameter: ProjectileMotionConstants.DEFAULT_DIAMETER, // meters
      dragCoefficient: ProjectileMotionConstants.DEFAULT_DRAG_COEFFICIENT,
      altitude: ProjectileMotionConstants.DEFAULT_ALTITUDE,
      airResistanceOn: ProjectileMotionConstants.DEFAULT_AIR_RESISTANCE_ON, // should default to false

      velocityVectorComponentsOn: false,



      isPlaying: true,
      resetListener: false, // a clumsy way that lets view objects listen for a reset
      units: { name: 'meters', multiplier: 1 }, // for common code measuringtape

      measuringTape: true,
      measuringTapeX: ProjectileMotionConstants.INITIAL_TAPE_MEASURE_X,
      measuringTapeY: ProjectileMotionConstants.INITIAL_TAPE_MEASURE_Y,

      cannonX: ProjectileMotionConstants.INITIAL_CANNON_X,
      cannonY: ProjectileMotionConstants.INITIAL_CANNON_Y
    } );

    // observable array of trajectories
    projectileMotionModel.trajectories = new ObservableArray();

    // called when fire button is pressed
    projectileMotionModel.addTrajectory = function() {
      projectileMotionModel.trajectories.push( new Trajectory( projectileMotionModel, projectileMotionModel.cannonX, projectileMotionModel.cannonY, projectileMotionModel.velocity, projectileMotionModel.angle, projectileMotionModel.mass,
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

      this.resetListener = !this.resetListener;

      // the following matters if user has changed the height of the cannon
      this.cannonXProperty.reset();
      this.cannonYProperty.reset();

      // resets the position of the measuring tape
      this.measuringTapeXProperty.reset();
      this.measuringTapeYProperty.reset();

      // remove all trajectories
      this.trajectories.reset();
    },

    // @public animates trajectory if running
    step: function( dt ) {
      if ( this.isPlaying ) {
        this.stepInternal( dt );
      }
    },

    stepInternal: function( dt ) {
      this.trajectories.forEach( function( trajectory ) { trajectory.step( dt ); } );
    }
  } );
} );

