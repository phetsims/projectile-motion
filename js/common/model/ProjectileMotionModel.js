// Copyright 2016-2017, University of Colorado Boulder

/**
 * Common model (base type) for Projectile Motion.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var EventTimer = require( 'PHET_CORE/EventTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ProjectileMotionMeasuringTape = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionMeasuringTape' );
  var Property = require( 'AXON/Property' );
  var Score = require( 'PROJECTILE_MOTION/common/model/Score' );
  var Tracer = require( 'PROJECTILE_MOTION/common/model/Tracer' );
  var Trajectory = require( 'PROJECTILE_MOTION/common/model/Trajectory' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TIME_PER_DATA_POINT = ProjectileMotionConstants.TIME_PER_DATA_POINT; // ms

  /**
   * @param {ProjectileObjectType} defaultProjectileObjectType -  default object type for the each model
   * @param {boolean} defaultAirResistance -  default air resistance on value
   * @param {number} defaultCannonHeight - optional, defaults to 0, only used by Intro screen
   * @param {number} defaultCannonAngle - option, defaults to 80, only used by Intro screen
   * @param {number} defaultInitialSpeed - option, defaults to 80, only used by Intro screen
   * @constructor
   */
  function ProjectileMotionModel( defaultProjectileObjectType, defaultAirResistance, defaultCannonHeight, defaultCannonAngle, defaultInitialSpeed ) {


    // @public {ObservableArray.<Trajectory>} observable array of trajectories, limited to 5
    this.trajectories = new ObservableArray();

    // @public {Score} model for handling scoring ( if/when projectile hits target )
    this.score = new Score( ProjectileMotionConstants.TARGET_X_DEFAULT );

    // @public {ProjectileMotionMeasuringTape} model for measuring tape
    this.measuringTape = new ProjectileMotionMeasuringTape();

    // @public {Tracer} model for the tracer probe
    this.tracer = new Tracer( this.trajectories, 10, 10 ); // location arbitrary

    // --initial values

    // @public {Property.<number>} height of the cannon, in meters
    this.cannonHeightProperty = new NumberProperty( defaultCannonHeight ? defaultCannonHeight : 0 );

    // @public {Property.<number>} angle of the cannon, in degrees
    this.cannonAngleProperty = new NumberProperty( defaultCannonHeight ? defaultCannonAngle : 80 );

    // @public {Property.<number>} launch speed, in meters per second
    this.launchVelocityProperty = new NumberProperty( defaultCannonHeight ? defaultInitialSpeed : 18 );

    // --parameters for next projectile fired

    // @public {Property.<number>} mass of the projectile, in kilograms
    this.projectileMassProperty = new NumberProperty( defaultProjectileObjectType.mass );

    // @public {Property.<number>} diameter of the projectile, in meters
    this.projectileDiameterProperty = new NumberProperty( defaultProjectileObjectType.diameter );

    // @public {Property.<number>} drag coefficient of the projectile, unitless as it is a coefficient
    this.projectileDragCoefficientProperty = new NumberProperty( defaultProjectileObjectType.dragCoefficient );

    this.selectedProjectileObjectTypeProperty = new Property( defaultProjectileObjectType );

    this.selectedProjectileObjectTypeProperty.link( this.setProjectileParameters.bind( this ) );

    // --Properties that change the environment and affect all projectiles, called global

    // @public acceleration due to gravity, in meters per second squared
    this.gravityProperty = new NumberProperty( ProjectileMotionConstants.GRAVITY_ON_EARTH );

    // @public altitude of the environment, in meters
    this.altitudeProperty = new NumberProperty( 0 );

    // @public whether air resistance is on
    this.airResistanceOnProperty = new BooleanProperty( defaultAirResistance );

    // @public {DerivedProperty.<number>} air density, in kg/cu m, depends on altitude and whether air resistance is on
    this.airDensityProperty = new DerivedProperty( [
      this.altitudeProperty,
      this.airResistanceOnProperty
    ], calculateAirDensity );

    // if any of the global Properties change, update the status of moving projectiles
    this.airDensityProperty.link( this.updateTrajectoriesWithMovingProjectiles.bind( this ) );
    this.gravityProperty.link( this.updateTrajectoriesWithMovingProjectiles.bind( this ) );

    // --animation controls

    // @public {Property.<String>} speed of animation, normal/slow
    this.speedProperty = new Property( 'normal' );

    // @public whether animation is playing (as opposed to paused)
    this.isPlayingProperty = new BooleanProperty( true );

    // @public (read-only)
    this.davidHeight = 2; // meters
    this.davidPosition = new Vector2( 7, 0 ); // meters

    // @public number of projectiles that are still moving
    this.numberOfMovingProjectilesProperty = new NumberProperty( 0 );

    // @public {DerivedProperty.<boolean>} is the fire button enabled? Yes if there are less than the max projectiles
    // in the air.
    this.fireEnabledProperty = new DerivedProperty( [ this.numberOfMovingProjectilesProperty ], function( number ) {
      return number < ProjectileMotionConstants.MAX_NUMBER_OF_FLYING_PROJECTILES;
    } );

    // @public {Emitter}
    this.updateTrajectoryRanksEmitter = new Emitter();

    // @private {EventTimer}
    this.eventTimer = new EventTimer(
      new EventTimer.ConstantEventModel( 1000 / TIME_PER_DATA_POINT ),
      this.stepModelElements.bind( this, TIME_PER_DATA_POINT / 1000 )
    );

    // @public {Emitter} emits when cannon needs to update its muzzle flash animation
    this.muzzleFlashStepper = new Emitter();

    // Links in this constructor last for the life time of the sim, so no need to dispose
  }

  projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

  /**
   * @param {number} altitude - in meters
   * @param {boolean} airResistanceOn - if off, zero air density
   * @returns {number} - air density
   */
  function calculateAirDensity( altitude, airResistanceOn ) {

    // Atmospheric model algorithm is taken from https://www.grc.nasa.gov/www/k-12/airplane/atmosmet.html
    // Checked the values at http://www.engineeringtoolbox.com/standard-atmosphere-d_604.html

    if ( airResistanceOn ) {
      var temperature;
      var pressure;

      // The sim doesn't go beyond 5000, rendering the elses unnecessary, but keeping if others would like to
      // increase the altitude range.

      if ( altitude < 11000 ) { // troposphere
        temperature = 15.04 - 0.00649 * altitude;
        pressure = 101.29 * Math.pow( ( temperature + 273.1 ) / 288.08, 5.256 );
      }
      else if ( altitude < 25000 ) { // lower stratosphere
        temperature = -56.46;
        pressure = 22.65 * Math.exp( 1.73 - 0.000157 * altitude );
      }
      else { // upper stratosphere (altitude >= 25000 meters)
        temperature = -131.21 + 0.00299 * altitude;
        pressure = 2.488 * Math.pow( ( temperature + 273.1 ) / 216.6, -11.388 );
      }

      return pressure / ( 0.2869 * ( temperature + 273.1 ) );

    }
    else {
      return 0;
    }
  }

  return inherit( Object, ProjectileMotionModel, {

    /**
     * Reset these Properties
     * @public
     * @override
     */
    reset: function() {

      // disposes all trajectories and resets number of moving projectiles Property
      this.eraseTrajectories();

      this.score.reset();
      this.measuringTape.reset();
      this.tracer.reset();

      this.cannonHeightProperty.reset();
      this.cannonAngleProperty.reset();
      this.launchVelocityProperty.reset();
      this.selectedProjectileObjectTypeProperty.reset();
      this.projectileMassProperty.reset();
      this.projectileDiameterProperty.reset();
      this.projectileDragCoefficientProperty.reset();
      this.gravityProperty.reset();
      this.altitudeProperty.reset();
      this.airResistanceOnProperty.reset();
      this.speedProperty.reset();
      this.isPlayingProperty.reset();

      this.muzzleFlashStepper.emit();
    },

    /**
     * Steps the model forward in time using the created eventTimer
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      if ( this.isPlayingProperty.value ) {
        this.eventTimer.step( ( this.speedProperty.value === 'normal' ? 1 : 0.33 ) * dt );
      }
    },

    /**
     * Steps model elements given a time step, used by the step button
     * @public
     *
     * @param {number} dt
     */
    stepModelElements: function( dt ) {
      for ( var i = 0; i < this.trajectories.length; i++ ) {
        this.trajectories.get( i ).step( dt );
      }
      this.muzzleFlashStepper.emit();
    },

    /**
     * Remove and dispose old trajectories that are over the limit from the observable array
     * @private
     */
    limitTrajectories: function() {
      var numberToRemove = this.trajectories.length - ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES;
      for ( var i = 0; i < numberToRemove; i++ ) {
        this.trajectories.shift().dispose();
      }
    },

    /**
     * Removes all trajectories and resets corresponding Properties
     * @public
     */
    eraseTrajectories: function() {
      while ( this.trajectories.length ) {
        this.trajectories.pop().dispose();
      }
      this.numberOfMovingProjectilesProperty.reset();
    },

    /**
     * Fires cannon, called on by fire button
     * Adds a new trajectory, unless the same exact trajectory as the last one is being fired, in which case it just
     * adds a projectile to the last trajectory.
     * @public
     */
    cannonFired: function() {
      var lastTrajectory = this.trajectories.get( this.trajectories.length - 1 );
      var newTrajectory = new Trajectory( this );
      if ( lastTrajectory && newTrajectory.equals( lastTrajectory ) ) {
        lastTrajectory.addProjectileObject();
        newTrajectory.dispose();
      }
      else {
        this.updateTrajectoryRanksEmitter.emit(); // increment rank of all trajectories
        newTrajectory.rankProperty.reset(); // make the new Trajectory's rank go back to zero
        this.trajectories.push( newTrajectory );
      }
      this.numberOfMovingProjectilesProperty.value++;
      this.limitTrajectories();
    },

    /**
     * Update trajectories that have moving projectiles
     * @private
     */
    updateTrajectoriesWithMovingProjectiles: function() {
      var i;
      var newTrajectories = [];
      var trajectory;
      for ( var j = 0; j < this.trajectories.length; j++ ) {
        trajectory = this.trajectories.get( j );

        var removedProjectileObjects = [];

        // Furthest projectile on trajectory has not reached ground
        if ( !trajectory.reachedGround ) {
          
          // make note that this trajectory has changed in mid air, so it will not be the same as another trajectory
          trajectory.changedInMidAir = true;

          // For each projectile except for the one furthest along the path, create a new trajectory
          for ( i = 1; i < trajectory.projectileObjects.length; i++ ) {
            var projectileObject = trajectory.projectileObjects.get( i );
            removedProjectileObjects.push( projectileObject );
            this.updateTrajectoryRanksEmitter.emit();
            var newTrajectory = trajectory.newTrajectory( projectileObject );
            newTrajectory.changedInMidAir = true;
            newTrajectories.push( newTrajectory );
          }
        }

        // Furthest object on trajectory has reached ground
        else {
          
          // For each projectile still in the air, create a new trajectory
          for ( i = 0; i < trajectory.projectileObjects.length; i++ ) {
            projectileObject = trajectory.projectileObjects.get( i );
            if ( !projectileObject.dataPointProperty.get().reachedGround ) {
              projectileObject = trajectory.projectileObjects.get( i );
              removedProjectileObjects.push( projectileObject );
              this.updateTrajectoryRanksEmitter.emit();
              newTrajectory = trajectory.newTrajectory( projectileObject );
              newTrajectory.changedInMidAir = true;
              newTrajectories.push( newTrajectory );
            }
          }
        }

        trajectory.projectileObjects.removeAll( removedProjectileObjects );
      }
      this.trajectories.addAll( newTrajectories );
      this.limitTrajectories();
    },

    /**
     * Set mass, diameter, and drag coefficient based on the currently selected projectile object type
     * @private
     *
     * @param {ProjectileObjectType} selectedProjectileObjectType - contains information such as mass, diameter, etc.
     */
    setProjectileParameters: function( selectedProjectileObjectType ) {
      this.projectileMassProperty.set( selectedProjectileObjectType.mass );
      this.projectileDiameterProperty.set( selectedProjectileObjectType.diameter );
      this.projectileDragCoefficientProperty.set( selectedProjectileObjectType.dragCoefficient );
    },

  } );
} );

