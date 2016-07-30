// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Projectile = require( 'PROJECTILE_MOTION/common/model/Projectile' );
  var Tracer = require( 'PROJECTILE_MOTION/common/model/Tracer' );
  var Score = require( 'PROJECTILE_MOTION/common/model/Score' );
  var ProjectileMotionMeasuringTape = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionMeasuringTape' );
  // var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TIME_PER_DATA_POINT = ProjectileMotionConstants.TIME_PER_DATA_POINT; // in ms

  /**
   * @constructor
   */
  function ProjectileMotionModel() {
    // @public
    PropertySet.call( this, {

      // variables for the next trajectory, and thus the cannon
      cannonHeight: 0, // meters
      cannonAngle: 80, // degrees
      launchVelocity: 18, // m/s

      // parameters for the next projectile fired
      projectileMass: 5, // kg
      projectileDiameter: 0.37, // meters
      projectileDragCoefficient: 0.6, // of a pumpkin

      // properties that change the environment and affect all projectiles immediately
      altitude: 0, // meters
      airResistanceOn: false, // defaults to air resistance off

      // vectors visibility
      velocityVectorComponentsOn: false,

      // animation controls, e.g. normal/slow/play/pause/step
      speed: 'normal',
      isPlaying: true
    } );

    // @private, how many steps mod three, used to slow animation down to a third of normal speed
    this.stepCount = 0;

    // @private, tracks remaining time mod 16 ms
    this.residualTime = 0;

    // @public {ObservableArray.<Trajectory>} observable array of projectiles
    this.projectiles = new ObservableArray();

    // @public {Score} model for handling scoring ( if/when projectile hits target )
    this.scoreModel = new Score( ProjectileMotionConstants.TARGET_X_DEFAULT );

    // @public {ProjectileMotionMeasuringTape} model for measuring tape
    this.measuringTape = new ProjectileMotionMeasuringTape();

    // @public {Tracer} model for the tracer probe
    this.tracerModel = new Tracer( this.projectiles, 10, 10 ); // location arbitrary
  }

  projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

  return inherit( PropertySet, ProjectileMotionModel, {

    // @public resets all model elements
    reset: function() {
      // reset all properties by calling super class
      PropertySet.prototype.reset.call( this );

      // remove all projectiles
      this.projectiles.reset();

      this.scoreModel.reset();
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
      this.projectiles.forEach( function( projectile ) { projectile.step( dt ); } );
      this.scoreModel.step( dt );
    },

    // @private, adds a projectile to the observable array
    addProjectile: function() {
      var self = this;
      this.projectiles.forEach( function( projectile ) {
        projectile.projectilesInModelAfterSelfFiredCount++;
        if ( projectile.projectilesInModelAfterSelfFiredCount >= ProjectileMotionConstants.MAX_NUMBER_OF_PROJECTILES ) {
          self.projectiles.remove( projectile );
        }
      } );
      this.projectiles.push( new Projectile( this ) );
    },

    // @public, removes all projectiles
    eraseProjectiles: function() {
      this.projectiles.clear();
    },

    // @public fires cannon, called on by fire button
    cannonFired: function() {
      this.isPlaying = true;
      this.addProjectile();
      this.scoreModel.turnOffScore();
    }

  } );
} );

