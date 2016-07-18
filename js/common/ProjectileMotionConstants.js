// Copyright 2016, University of Colorado Boulder

/**
 * This object is collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this simulation.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );

  // constants
  var ProjectileMotionConstants = {

    DEFAULT_HEIGHT: 0, // meters
    DEFAULT_ANGLE: 80, // degrees
    DEFAULT_VELOCITY: 18, // m/s
    DEFAULT_MASS: 5, // kg
    DEFAULT_DIAMETER: 0.37, // of a pumpkin, in meters
    DEFAULT_DRAG_COEFFICIENT: 0.6, // of a pumpkin
    DEFAULT_ALTITUDE: 0, // meters, will change to 0 meters
    DEFAULT_AIR_RESISTANCE_ON: false,

    HEIGHT_RANGE: { min: 0, max: 10 },
    ANGLE_RANGE: { min: -90, max: 180 },
    VELOCITY_RANGE: { min: 0, max: 50 },
    MASS_RANGE: { min: 0.04, max: 100 }, // in original, highest is 1000
    DIAMETER_RANGE: { min: 0.1, max: 2.5 }, // in original, smallest is 0.043
    DRAG_COEFFICIENT_RANGE: { min: 0, max: 50 }, // completely arbitrary
    ALTITUDE_RANGE: { min: 0, max: 30000 }, // meters, max is arbitrary but in upper stratosphere

    INITIAL_CANNON_X: 0,
    INITIAL_CANNON_Y: 0,

    INITIAL_TARGET_X: 15, // meters
    TARGET_LENGTH: 2, // meters

    INITIAL_TAPE_MEASURE_X: 0,
    INITIAL_TAPE_MEASURE_Y: 0, // location will be transformed, but not length

    PANEL_FILL_COLOR: 'rgb(255,238,218)',

    SHOW_SCORE_TIME: 1 // seconds

  };

  projectileMotion.register( 'ProjectileMotionConstants', ProjectileMotionConstants );

  return ProjectileMotionConstants;

} );
