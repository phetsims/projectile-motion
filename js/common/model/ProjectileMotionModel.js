// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Trajectory = require( 'PROJECTILE_MOTION/common/model/Trajectory' );
  var Tracer = require( 'PROJECTILE_MOTION/common/model/Tracer' );
  var Score = require( 'PROJECTILE_MOTION/common/model/Score' );
  var ProjectileMotionMeasuringTape = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionMeasuringTape' );

  // constants
  var TIME_PER_DATA_POINT = ProjectileMotionConstants.TIME_PER_DATA_POINT; // ms

  /**
   * @constructor
   */
  function ProjectileMotionModel( additionalProperties ) {
    var self = this;

    // @public
    PropertySet.call( this, _.extend( {

      

      // animation controls, e.g. normal/slow/play/pause/step
      speed: 'normal',
      isPlaying: true
    }, additionalProperties ) );

    // --initial values

    // @public {Property.<number>} height of the cannon, in meters
    this.cannonHeightProperty = new Property( 0 );

    // @public {Property.<number>} angle of the cannon, in degrees
    this.cannonAngleProperty = new Property( 80 );

    // @public {Property.<number>} launch speed, in meters per second
    this.launchVelocityProperty = new Property( 18 );

    // --parameters for next projectile fired, defaults to a cannonball

    // @public {Property.<number>} mass of the projectile, in kilograms
    this.projectileMassProperty = new Property( ProjectileMotionConstants.CANNONBALL_MASS );

    // @public {Property.<number>} diameter of the projectile, in meters
    this.projectileDiameterProperty = new Property( ProjectileMotionConstants.CANNONBALL_DIAMETER );

    // @public {Property.<number>} drag coefficient of the projectile
    this.projectileDragCoefficientProperty = new Property( ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT );

    // --properties that change the environment and affect all projectiles

    // @public {Property.<number>} altitude of the environment, in meters
    this.altitudeProperty = new Property( 0 );

    // @public {Property.<boolean>} whether air resistance is on
    this.airResistanceOnProperty = new Property( false );

    // @public {Property.<number>} air density, which depends on altitude and whether air resistance is on
    this.airDensityProperty = new DerivedProperty( [ this.altitudeProperty, this.airResistanceOnProperty ],
      function( altitude, airResistanceOn ) {
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
      } );

    // --vectors visibility

    // @public {Property.<boolean>} whether total velocity vector is showing
    this.totalVelocityVectorOnProperty = new Property( false );

    // @public {Property.<boolean>} whether component velocity vectors are showing
    this.componentsVelocityVectorsOnProperty = new Property( false );

    // @public {Property.<boolean>} whether total force vector is showing
    this.totalForceVectorOnProperty = new Property( false );

    // @public {Property.<boolean>} whether component force vectors are showing
    this.componentsForceVectorsOnProperty = new Property( false );

    // @public {Property.<boolean>} whether component acceleration vectors are showing
    this.componentsAccelerationVectorsOnProperty = new Property( false );

    // @private, how many steps mod three, used to slow animation down to a third of normal speed
    this.stepCount = 0;

    // @private, tracks remaining time mod 16 ms
    this.residualTime = 0;

    // @public {ObservableArray.<Trajectory>} observable array of trajectories, limited to 5
    this.trajectories = new ObservableArray();

    // @public {Score} model for handling scoring ( if/when projectile hits target )
    this.scoreModel = new Score( ProjectileMotionConstants.TARGET_X_DEFAULT );

    // @public {ProjectileMotionMeasuringTape} model for measuring tape
    this.measuringTape = new ProjectileMotionMeasuringTape();

    // @public {Tracer} model for the tracer probe
    this.tracerModel = new Tracer( this.trajectories, 10, 10 ); // location arbitrary

    // update air density as needed, and change status of projectiles
    this.airDensityProperty.link( function() {
      self.trajectories.forEach( function( trajectory ) {
        trajectory.changedInMidAir = true;

        var i;
        for ( i = 1; i < trajectory.projectileObjects.length; i++ ) {
          var projectileObject = trajectory.projectileObjects.get( i );
          if ( projectileObject.dataPointProperty.get().y > 0 ) {
            // object is still in the air so a new trajectory needs to be created
            var newTrajectory = trajectory.newTrajectory( projectileObject );
            newTrajectory.changedInMidAir = true;
            self.trajectories.push( newTrajectory );
          }
        }
      } );

      // delete over-the-max trajectories
      self.limitTrajectories();

    } );
  }

  projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

  return inherit( PropertySet, ProjectileMotionModel, {

    // @public resets all model elements
    reset: function() {
      // reset all properties by calling super class
      PropertySet.prototype.reset.call( this );

      this.cannonHeightProperty.reset();
      this.cannonAngleProperty.reset();
      this.launchVelocityProperty.reset();
      this.projectileMassProperty.reset();
      this.projectileDiameterProperty.reset();
      this.projectileDragCoefficientProperty.reset();
      this.altitudeProperty.reset();
      this.airResistanceOnProperty.reset();
      this.totalVelocityVectorOnProperty.reset();
      this.componentsVelocityVectorsOnProperty.reset();
      this.totalForceVectorOnProperty.reset();
      this.componentsForceVectorsOnProperty.reset();
      this.componentsAccelerationVectorsOnProperty.reset();

      // remove all projectiles
      this.trajectories.reset();

      this.scoreModel.reset();
      this.measuringTape.reset();
      this.tracerModel.reset();
    },

    // @public determines animation based on play/pause and speed
    step: function( dt ) {
      // stepCount tracks how many frames mod 3, so slow motion is slowed down to once every three frames
      this.stepCount += 1;
      this.stepCount = this.stepCount % 3;

      // prevent sudden dt bursts when the user comes back to the tab after a while
      dt = Math.min( TIME_PER_DATA_POINT * 3 / 1000, dt );

      this.residualTime += dt * 1000; // in milliseconds

      // number of model steps to clock this frame
      var numberSteps = ( this.residualTime / TIME_PER_DATA_POINT ).toFixed( 0 ) / 1000;

      this.residualTime = this.residualTime % TIME_PER_DATA_POINT;

      if ( this.isPlaying ) {
        // for every 3 * 16 ms, stepModelElements is called for 16 ms
        // TODO: revert back to one second = one third of a second
        if ( this.speed === 'normal' || this.stepCount === 0 ) {
          var i;
          for ( i = 0; i < numberSteps; i++ ) {
            this.stepModelElements( TIME_PER_DATA_POINT / 1000 );
          }
        }
      }
    },

    // @public animate model elements given a time step
    stepModelElements: function( dt ) {
      this.trajectories.forEach( function( trajectory ) { trajectory.step( dt ); } );
      this.scoreModel.step( dt );
    },

    // @protected, adds a projectile to the model
    addProjectile: function() {
      var equalsExistingTrajectory = false; // whether the added p
      var removedRank = this.trajectories.length;

      // search for equal trajectory and add a new projectile object to it, if found
      this.trajectories.forEach( function( trajectory ) {
        if ( trajectory.equalsCurrent() ) {
          trajectory.addProjectileObject();

          equalsExistingTrajectory = true;
          // shift trajectory to the the most recent slot
          removedRank = trajectory.rank;
          trajectory.rank = 0;
        }
        else {
          trajectory.rank ++;
        }
      } );

      // if there has been an equal trajectory found, create a new trajectory
      if (!equalsExistingTrajectory ) {
        this.trajectories.push( new Trajectory( this ) );
      }

      // decrement ranks after the shifted trajectory
      this.trajectories.forEach( function( trajectory) {
        if ( trajectory.rank > removedRank ) {
          trajectory.rank --;
        }
      } );

      this.limitTrajectories();

    },

    // @private remove old trajectories that are over the limit from the observable array
    limitTrajectories: function() {
      var trajectories = this.trajectories;
      trajectories.forEach( function( trajectory ) {
        if ( trajectory.rank > ProjectileMotionConstants.MAX_NUMBER_OF_PROJECTILES ) {
          trajectories.remove( trajectory );
        }
      } );
    },

    // @public, removes all projectiles
    eraseProjectiles: function() {
      this.trajectories.clear();
    },

    // @public fires cannon, called on by fire button
    cannonFired: function() {
      this.isPlaying = true;
      this.addProjectile();
      this.scoreModel.turnOffScore();
    },

    // @private, updates air density property based on air resistance and altitude
    updateAirDensity: function() {
      // Air resistance is turned on.
      if ( this.airResistanceOnProperty.get() ) {

        var altitude = this.altitudeProperty.get();
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

        this.airDensityProperty.set( pressure / ( 0.2869 * ( temperature + 273.1 ) ) );
      }

      // Air resistance is turned off.
      else {
        this.airDensityProperty.set( 0 );
      }

    }

  } );
} );

