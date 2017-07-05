// Copyright 2002-2016, University of Colorado Boulder

/**
 * Common model (base type) for Projectile Motion.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var EventTimer = require( 'PHET_CORE/EventTimer' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var Trajectory = require( 'PROJECTILE_MOTION/common/model/Trajectory' );
  var Tracer = require( 'PROJECTILE_MOTION/common/model/Tracer' );
  var Score = require( 'PROJECTILE_MOTION/common/model/Score' );
  var ProjectileMotionMeasuringTape = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionMeasuringTape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TIME_PER_DATA_POINT = ProjectileMotionConstants.TIME_PER_DATA_POINT; // ms
  var DAVID_RADIUS = 0.5; // meters, will change to view units. How close the tracer needs to get to a datapoint

  /**
   * @param {ProjectileObjectType} defaultProjectileObjectType -  default object type for the each model
   * @param {boolean} defaultAirResistance -  default air resistance on value
   * @constructor
   */
  function ProjectileMotionModel( defaultProjectileObjectType, defaultAirResistance ) {


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
    this.cannonHeightProperty = new Property( 0 );

    // @public {Property.<number>} angle of the cannon, in degrees
    this.cannonAngleProperty = new Property( 80 );

    // @public {Property.<number>} launch speed, in meters per second
    this.launchVelocityProperty = new Property( 18 );

    // --parameters for next projectile fired, defaults to a cannonball

    // @public {Property.<number>} mass of the projectile, in kilograms
    this.projectileMassProperty = new Property( defaultProjectileObjectType.mass );

    // @public {Property.<number>} diameter of the projectile, in meters
    this.projectileDiameterProperty = new Property( defaultProjectileObjectType.diameter );

    // @public {Property.<number>} drag coefficient of the projectile, unitless as it is a coefficient
    this.projectileDragCoefficientProperty = new Property( defaultProjectileObjectType.dragCoefficient );

    this.selectedProjectileObjectTypeProperty = new Property( defaultProjectileObjectType );

    this.selectedProjectileObjectTypeProperty.link( this.setProjectileParameters.bind( this ) );
    
    // --properties that change the environment and affect all projectiles

    // @public {Property.<number>} acceleration due to gravity, in meters per second squared
    this.gravityProperty = new Property( ProjectileMotionConstants.GRAVITY_ON_EARTH );

    // @public {Property.<number>} altitude of the environment, in meters
    this.altitudeProperty = new Property( 0 );

    // @public {Property.<boolean>} whether air resistance is on
    this.airResistanceOnProperty = new Property( defaultAirResistance );

    // @public {DerivedProperty.<number>} air density, in kg/cu m, which depends on altitude and whether air resistance is on
    this.airDensityProperty = new DerivedProperty( [ this.altitudeProperty, this.airResistanceOnProperty ], getAirDensity );

    // change status of projectiles
    this.airDensityProperty.link( this.updateStatusofTrajectories.bind( this ) );
    this.gravityProperty.link( this.updateStatusofTrajectories.bind( this ) );

    // --animation playing controls

    // @public {Property.<String>} speed of animation, normal/slow
    this.speedProperty = new Property( 'normal' );

    // @public {Property.<boolean>} whether animation is playing (as opposed to paused)
    this.isPlayingProperty = new Property( true );

    // @private
    this.davidShortsOnProperty = new Property( true );

    // @public (read-only)
    this.davidPosition = new Vector2( ProjectileMotionConstants.DAVID_HORIZONTAL_PLACEMENT, ProjectileMotionConstants.DAVID_HEIGHT / 2 );

    // @public number of projectiles that are still moving
    this.numberOfMovingProjectilesProperty = new Property( 0 );

    // @public {Property.<boolean>}
    this.fireEnabledProperty = new DerivedProperty( [ this.numberOfMovingProjectilesProperty ], function( number ) {
      return number < ProjectileMotionConstants.MAX_NUMBER_OF_FLYING_PROJECTILES;
    } );

    // @public {Emitter}
    this.updateRanksEmitter = new Emitter();

    // @private {EventTimer}
    this.eventTimer = new EventTimer( new EventTimer.ConstantEventModel( 1 / 0.016 ), this.stepModelElements.bind( this, TIME_PER_DATA_POINT / 1000 ) );
  }

  projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

  /**
   * @param  {number} altitude - in meters
   * @param  {boolean} airResistanceOn - if off, zero air density
   * @returns {number} - air density
   */
  function getAirDensity( altitude, airResistanceOn ) {

    // Atmospheric model algorithm is taken from https://www.grc.nasa.gov/www/k-12/airplane/atmosmet.html
    // Checked the values at http://www.engineeringtoolbox.com/standard-atmosphere-d_604.html

    if ( airResistanceOn ) {
      var temperature;
      var pressure;

      if ( altitude < 11000 ) {
        // troposphere
        temperature = 15.04 - 0.00649 * altitude;
        pressure = 101.29 * Math.pow( ( temperature + 273.1 ) / 288.08, 5.256 );
      } else if ( altitude < 25000 ) {
        // lower stratosphere
        temperature = -56.46;
        pressure = 22.65 * Math.exp( 1.73 - 0.000157 * altitude );
      } else {
        // upper stratosphere (altitude >= 25000 meters)
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

    reset: function() {

      // disposes all trajectories and resets number of moving projectiles property
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

      this.davidShortsOnProperty.reset();
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
      var i;
      for ( i = 0; i < this.trajectories.length; i++ ) {
        this.trajectories.get( i ).step( dt );
      }
    },

    /** 
     * Remove and dispose old trajectories that are over the limit from the observable array
     * @private 
     */
    limitTrajectories: function() {
      var numberToRemove = this.trajectories.length - ProjectileMotionConstants.MAX_NUMBER_OF_PROJECTILES;
      var i;
      for ( i = 0; i < numberToRemove; i++ ) {
        this.trajectories.shift().dispose();
      }
    },

    /**
     * Removes all trajectories and resets corresponding properties
     * @public
     */
    eraseTrajectories: function() {
      while( this.trajectories.length ) {
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
      this.isPlayingProperty.set( true );
      var lastTrajectory = this.trajectories.get( this.trajectories.length - 1 );
      var newTrajectory = new Trajectory( this );
      if ( lastTrajectory && newTrajectory.equals( lastTrajectory ) ) {
        lastTrajectory.addProjectileObject();
        newTrajectory.dispose();
      }
      else {
        this.updateRanksEmitter.emit(); // increment rank of all trajectories
        newTrajectory.rankProperty.reset(); // make this one go back to zero
        this.trajectories.push( newTrajectory );
      }
      this.numberOfMovingProjectilesProperty.value++;
      this.limitTrajectories();
    },

    /**
     * Updates the status of the trajectories, as in whether they are changed in mid air
     * @private 
     */
    updateStatusofTrajectories: function() {
      var newTrajectories = [];
      var trajectory;
      var j;
      for ( j = 0; j < this.trajectories.length; j++ ) {
        trajectory = this.trajectories.get( j );

        var removedProjectileObjects = [];

        // Furthest projectile on trajectory has not reached ground
        if( !trajectory.reachedGround ) {
          trajectory.changedInMidAir = true; // make note that this trajectory has changed in mid air, so it will not be the same as another trajectory

          // For each projectile except for the one furthest along the path, create a new trajectory
          var i;
          for (i = 1; i < trajectory.projectileObjects.length; i++ ) {
            var projectileObject = trajectory.projectileObjects.get( i );
            removedProjectileObjects.push( projectileObject );
            this.updateRanksEmitter.emit();
            var newTrajectory = trajectory.newTrajectory( projectileObject );
            newTrajectories.push( newTrajectory );
          }
        }
        
        // Furthest object on trajectory has reached ground
        else {
          
          // For each projectile still in the air, create a new trajectory
          for (i = 0; i < trajectory.projectileObjects.length; i++ ) {
            projectileObject = trajectory.projectileObjects.get( i );
            if ( !projectileObject.dataPointProperty.get().reachedGround ) {
              projectileObject = trajectory.projectileObjects.get( i );
              removedProjectileObjects.push( projectileObject );
              this.updateRanksEmitter.emit();
              newTrajectory = trajectory.newTrajectory( projectileObject );
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
     * Checks if position is close to David and updates the property accordingly
     * @public
     * 
     * @param  {Vector2} position - a point in the model coordinate
     */
    updateDavidIfWithinRange: function( position ) {
      if ( position && position.distance( this.davidPosition ) <= DAVID_RADIUS ) {
        this.davidShortsOnProperty.set( false );
      }
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

