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
  var ObservableArray = require( 'AXON/ObservableArray' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var Trajectory = require( 'PROJECTILE_MOTION/common/model/Trajectory' );
  var Tracer = require( 'PROJECTILE_MOTION/common/model/Tracer' );
  var Score = require( 'PROJECTILE_MOTION/common/model/Score' );
  var ProjectileMotionMeasuringTape = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionMeasuringTape' );
  var Util = require( 'DOT/Util' );

  // constants
  var TIME_PER_DATA_POINT = ProjectileMotionConstants.TIME_PER_DATA_POINT; // ms

  /**
   * @constructor
   */
  function ProjectileMotionModel() {
    var self = this;

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
    this.projectileMassProperty = new Property( ProjectileMotionConstants.CANNONBALL_MASS );

    // @public {Property.<number>} diameter of the projectile, in meters
    this.projectileDiameterProperty = new Property( ProjectileMotionConstants.CANNONBALL_DIAMETER );

    // @public {Property.<number>} drag coefficient of the projectile, unitless as it is a coefficient
    this.projectileDragCoefficientProperty = new Property( ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT );

    // --properties that change the environment and affect all projectiles

    // @public {Property.<number>} altitude of the environment, in meters
    this.altitudeProperty = new Property( 0 );

    // @public {Property.<boolean>} whether air resistance is on
    this.airResistanceOnProperty = new Property( false );

    // @public {DerivedProperty.<number>} air density, in kg/cu m, which depends on altitude and whether air resistance is on
    this.airDensityProperty = new DerivedProperty( [ this.altitudeProperty, this.airResistanceOnProperty ],
      
      function( altitude, airResistanceOn ) {

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
      } );

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
    
    // --animation playing controls

    // @public {Property.<String>} speed of animation, normal/slow
    this.speedProperty = new Property( 'normal' );

    // @public {Property.<boolean>} whether animation is playing (as opposed to paused)
    this.isPlayingProperty = new Property( true );

    // @private, how many steps mod three, used to slow animation down to a third of normal speed
    this.stepCount = 0;

    // @private, tracks remaining time mod 16 ms
    this.residualTime = 0;

  }

  projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

  return inherit( Object, ProjectileMotionModel, {

    // @public resets all model elements
    reset: function() {

      // remove all projectiles
      this.trajectories.reset();

      this.score.reset();
      this.measuringTape.reset();
      this.tracer.reset();

      this.cannonHeightProperty.reset();
      this.cannonAngleProperty.reset();
      this.launchVelocityProperty.reset();
      this.projectileMassProperty.reset();
      this.projectileDiameterProperty.reset();
      this.projectileDragCoefficientProperty.reset();
      this.altitudeProperty.reset();
      this.airResistanceOnProperty.reset();
      this.speedProperty.reset();
      this.isPlayingProperty.reset();
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
      var numberSteps = Util.toFixedNumber( this.residualTime / TIME_PER_DATA_POINT , 0 ) / 1000;

      this.residualTime = this.residualTime % TIME_PER_DATA_POINT;

      if ( this.isPlayingProperty.get() ) {
        // for every 3 * 16 ms, stepModelElements is called for 16 ms
        // TODO: revert back to one second = one third of a second
        if ( this.speedProperty.get() === 'normal' || this.stepCount === 0 ) {
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
      this.score.step( dt );
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
          removedRank = trajectory.rankProperty.get();
          trajectory.rankProperty.set( 0 );
        }
        else {
          trajectory.rankProperty.set( trajectory.rankProperty.get() + 1 );
        }
      } );

      // if there has been an equal trajectory found, create a new trajectory
      if (!equalsExistingTrajectory ) {
        this.trajectories.push( new Trajectory( this ) );
      }

      // decrement ranks after the shifted trajectory
      this.trajectories.forEach( function( trajectory) {
        if ( trajectory.rankProperty.get() > removedRank ) {
          trajectory.rankProperty.set( trajectory.rankProperty.get() - 1 );
        }
      } );

      this.limitTrajectories();

    },

    // @private remove old trajectories that are over the limit from the observable array
    limitTrajectories: function() {
      var trajectories = this.trajectories;
      trajectories.forEach( function( trajectory ) {
        if ( trajectory.rankProperty.get() > ProjectileMotionConstants.MAX_NUMBER_OF_PROJECTILES ) {
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
      this.isPlayingProperty.set( true );
      this.addProjectile();
      this.score.turnOffScore();
    }

  } );
} );

