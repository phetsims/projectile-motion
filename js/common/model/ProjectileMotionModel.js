// Copyright 2016-2019, University of Colorado Boulder

/**
 * Common model (base type) for Projectile Motion.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanIO = require( 'TANDEM/types/BooleanIO' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const Emitter = require( 'AXON/Emitter' );
  const EventTimer = require( 'PHET_CORE/EventTimer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhysicalConstants = require( 'PHET_CORE/PhysicalConstants' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const ProjectileMotionMeasuringTape = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionMeasuringTape' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const ReferenceIO = require( 'TANDEM/types/ReferenceIO' );
  const Score = require( 'PROJECTILE_MOTION/common/model/Score' );
  const Tracer = require( 'PROJECTILE_MOTION/common/model/Tracer' );
  const Trajectory = require( 'PROJECTILE_MOTION/common/model/Trajectory' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const TIME_PER_DATA_POINT = ProjectileMotionConstants.TIME_PER_DATA_POINT; // ms

  /**
   * @param {ProjectileObjectType} defaultProjectileObjectType -  default object type for the each model
   * @param {boolean} defaultAirResistance -  default air resistance on value
   * @param {ProjectileObjectType[]} possibleObjectTypes - a list of the possible ProjectileObjectTypes for the model
   * @param {Tandem} tandem
   * @param options
   * @constructor
   */
  function ProjectileMotionModel( defaultProjectileObjectType, defaultAirResistance, possibleObjectTypes, tandem, options ) {

    options = merge( {
      defaultCannonHeight: 0,
      defaultCannonAngle: 80,
      defaultInitialSpeed: 18
    }, options );

    // @public {Score} model for handling scoring ( if/when projectile hits target )
    this.score = new Score( ProjectileMotionConstants.TARGET_X_DEFAULT, tandem.createTandem( 'score' ) );

    // @public {ProjectileMotionMeasuringTape} model for measuring tape
    this.measuringTape = new ProjectileMotionMeasuringTape( tandem.createTandem( 'measuringTape' ) );

    // --initial values

    // @public {Property.<number>} height of the cannon, in meters
    this.cannonHeightProperty = new NumberProperty( options.defaultCannonHeight, {
      tandem: tandem.createTandem( 'cannonHeightProperty' ),
      units: 'm',
      range: ProjectileMotionConstants.CANNON_HEIGHT_RANGE
    } );

    // @public {Property.<number>} angle of the cannon, in degrees
    this.cannonAngleProperty = new NumberProperty( options.defaultCannonAngle, {
      tandem: tandem.createTandem( 'cannonAngleProperty' ),
      units: '\u00B0',
      range: ProjectileMotionConstants.CANNON_ANGLE_RANGE
    } );

    // @public {Property.<number>} launch speed, in meters per second
    this.launchVelocityProperty = new NumberProperty( options.defaultInitialSpeed, {
      tandem: tandem.createTandem( 'launchVelocityProperty' ),
      units: 'm/s',
      range: ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE
    } );

    // --parameters for next projectile fired

    // @public {Property.<number>} mass of the projectile, in kilograms
    this.projectileMassProperty = new NumberProperty( defaultProjectileObjectType.mass, {
      tandem: tandem.createTandem( 'projectileMassProperty' ),
      units: 'kg'
    } );

    // @public {Property.<number>} diameter of the projectile, in meters
    this.projectileDiameterProperty = new NumberProperty( defaultProjectileObjectType.diameter, {
      tandem: tandem.createTandem( 'projectileDiameterProperty' ),
      units: 'm'
    } );

    // @public {Property.<number>} drag coefficient of the projectile, unitless as it is a coefficient
    this.projectileDragCoefficientProperty = new NumberProperty( defaultProjectileObjectType.dragCoefficient, {
      tandem: tandem.createTandem( 'projectileDragCoefficientProperty' )
    } );

    this.selectedProjectileObjectTypeProperty = new Property( defaultProjectileObjectType, {
      tandem: tandem.createTandem( 'selectedProjectileObjectTypeProperty' ),
      phetioType: PropertyIO( ReferenceIO ),
      validValues: possibleObjectTypes
    } );

    // --Properties that change the environment and affect all projectiles, called global

    // @public acceleration due to gravity, in meters per second squared
    this.gravityProperty = new NumberProperty( PhysicalConstants.GRAVITY_ON_EARTH, {
      tandem: tandem.createTandem( 'gravityProperty' ),
      units: 'm/s^2'
    } );

    // @public altitude of the environment, in meters
    this.altitudeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'altitudeProperty' ),
      units: 'm'
    } );

    // @public whether air resistance is on
    this.airResistanceOnProperty = new BooleanProperty( defaultAirResistance, { tandem: tandem.createTandem( 'airResistanceOnProperty' ) } );

    // @public {DerivedProperty.<number>} air density, in kg/cu m, depends on altitude and whether air resistance is on
    this.airDensityProperty = new DerivedProperty( [
      this.altitudeProperty,
      this.airResistanceOnProperty
    ], calculateAirDensity, {
      tandem: tandem.createTandem( 'airDensityProperty' ),
      phetioType: DerivedPropertyIO( NumberIO )
    } );

    // --animation controls

    // @public {Property.<String>} speed of animation, normal/slow
    this.speedProperty = new Property( 'normal' );

    // @public whether animation is playing (as opposed to paused)
    this.isPlayingProperty = new BooleanProperty( true, { tandem: tandem.createTandem( 'isPlayingProperty' ) } );

    // @public (read-only)
    this.davidHeight = 2; // meters
    this.davidPosition = new Vector2( 7, 0 ); // meters

    // @public number of projectiles that are still moving
    this.numberOfMovingProjectilesProperty = new NumberProperty( 0, { tandem: tandem.createTandem( 'numberOfMovingProjectilesProperty' ) } );

    // @public {DerivedProperty.<boolean>} is the fire button enabled? Yes if there are less than the max projectiles
    // in the air.
    this.fireEnabledProperty = new DerivedProperty( [ this.numberOfMovingProjectilesProperty ], function( number ) {
      return number < ProjectileMotionConstants.MAX_NUMBER_OF_FLYING_PROJECTILES;
    }, {
      tandem: tandem.createTandem( 'fireEnabledProperty' ),
      phetioType: DerivedPropertyIO( BooleanIO )
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

    // @public {PhetioGroup.<Trajectory>} a group of trajectories, limited to MAX_NUMBER_OF_TRAJECTORIES
    // Create this after model properties to support the PhetioGroup creating the prototype immediately
    this.trajectories = Trajectory.createGroup( this, tandem.createTandem( 'trajectories' ) );

    // @public {Tracer} model for the tracer probe
    this.tracer = new Tracer( this.trajectories, 10, 10, tandem.createTandem( 'tracer' ) ); // location arbitrary

    // Links in this constructor last for the life time of the sim, so no need to dispose

    // if any of the global Properties change, update the status of moving projectiles
    this.airDensityProperty.link( this.updateTrajectoriesWithMovingProjectiles.bind( this ) );
    this.gravityProperty.link( this.updateTrajectoriesWithMovingProjectiles.bind( this ) );
    this.selectedProjectileObjectTypeProperty.link( this.setProjectileParameters.bind( this ) );
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
      let temperature;
      let pressure;

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
      for ( let i = 0; i < this.trajectories.length; i++ ) {
        this.trajectories.get( i ).step( dt );
      }
      this.muzzleFlashStepper.emit();
    },

    /**
     * Remove and dispose old trajectories that are over the limit from the observable array
     * @private
     */
    limitTrajectories: function() {
      const numberToRemove = this.trajectories.length - ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES;
      for ( let i = 0; i < numberToRemove; i++ ) {
        this.trajectories.disposeGroupMember( this.trajectories.get( 0 ) );
      }
    },

    /**
     * Removes all trajectories and resets corresponding Properties
     * @public
     */
    eraseTrajectories: function() {
      this.trajectories.clear();
      this.numberOfMovingProjectilesProperty.reset();
    },

    /**
     * Fires cannon, called on by fire button
     * Adds a new trajectory, unless the same exact trajectory as the last one is being fired, in which case it just
     * adds a projectile to the last trajectory.
     * @public
     */
    cannonFired: function() {
      const lastTrajectory = this.trajectories.get( this.trajectories.length - 1 );
      const newTrajectory = this.trajectories.createNextMember( this );
      if ( lastTrajectory && newTrajectory.equals( lastTrajectory ) ) {
        lastTrajectory.addProjectileObject();
        this.trajectories.disposeGroupMember( newTrajectory );
      }
      else {
        this.updateTrajectoryRanksEmitter.emit(); // increment rank of all trajectories
        newTrajectory.rankProperty.reset(); // make the new Trajectory's rank go back to zero
      }
      this.numberOfMovingProjectilesProperty.value++;
      this.limitTrajectories();
    },

    /**
     * Update trajectories that have moving projectiles
     * @private
     */
    updateTrajectoriesWithMovingProjectiles: function() {
      let i;
      let trajectory;

      for ( let j = 0; j < this.trajectories.length; j++ ) {
        trajectory = this.trajectories.get( j );

        const removedProjectileObjects = [];

        const updateTrajectoryForProjectileObject = ( trajectory, projectileObjectIndex ) => {
          var projectileObject = trajectory.projectileObjects.get( projectileObjectIndex );
          removedProjectileObjects.push( projectileObject );
          this.updateTrajectoryRanksEmitter.emit();
          var newTrajectory = trajectory.copyFromProjectileObject( projectileObject );
          newTrajectory.changedInMidAir = true;
        };

        // Furthest projectile on trajectory has not reached ground
        if ( !trajectory.reachedGround ) {

          // make note that this trajectory has changed in mid air, so it will not be the same as another trajectory
          trajectory.changedInMidAir = true;

          // For each projectile except for the one furthest along the path, create a new trajectory
          for ( i = 1; i < trajectory.projectileObjects.length; i++ ) {
            updateTrajectoryForProjectileObject( trajectory, i );
          }
        }

        // Furthest object on trajectory has reached ground
        else {

          // For each projectile still in the air, create a new trajectory
          for ( i = 0; i < trajectory.projectileObjects.length; i++ ) {
            if ( !trajectory.projectileObjects.get( i ).dataPointProperty.get().reachedGround ) {
              updateTrajectoryForProjectileObject( trajectory, i );
            }
          }
        }

        trajectory.projectileObjects.removeAll( removedProjectileObjects );
      }
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
    }

  } );
} );

