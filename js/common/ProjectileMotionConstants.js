// Copyright 2016, University of Colorado Boulder

/**
 * Constants for the entire sim, global.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );

  var ProjectileMotionConstants = {

    // truths about the world
    ACCELERATION_DUE_TO_GRAVITY: 9.8,
    SPHERE_DRAG_COEFFICIENT: 0.47, // https://en.wikipedia.org/wiki/Drag_coefficient

    // productive constraints
    CANNON_HEIGHT_RANGE: { min: 0, max: 10 },
    CANNON_ANGLE_RANGE: { min: -90, max: 180 },
    LAUNCH_VELOCITY_RANGE: { min: 0, max: 50 },

    PROJECTILE_MASS_RANGE: { min: 0.04, max: 100 }, // in original, highest is 1000
    PROJECTILE_DIAMETER_RANGE: { min: 0.1, max: 2.5 }, // in original, smallest is 0.043

    // http://www.aquaphoenix.com/lecture/matlab5/page2.html, teardrop to pancake shape
    PROJECTILE_DRAG_COEFFICIENT_RANGE: { min: 0.05, max: 1.1 },
    ALTITUDE_RANGE: { min: 0, max: 30000 }, // meters, max is arbitrary but in upper stratosphere

    // vectors
    ARROW_SIZE_DEFAULT: 1, // 1 means velocity of 1 m/s is represented with 1 m length, can scale down
    ARROW_FILL_COLOR: 'rgb( 100, 100, 100 )',
    ARROW_HEAD_WIDTH: 12, // view units
    ARROW_TAIL_WIDTH: 6, // view units

    // cannon
    CANNON_LENGTH: 3, // meters
    CANNON_WIDTH: 0.7, // meters

    // target
    TARGET_X_DEFAULT: 15, // meters
    TARGET_LENGTH: 2, // meters
    TARGET_WIDTH: 0.5, // meters

    // tracer
    LABEL_TEXT_OPTIONS: { font: new PhetFont( 14 ) },

    // control panels
    PANEL_FILL_COLOR: 'rgb( 255, 238, 218 )',
    PANEL_TITLE_OPTIONS: { font: new PhetFont( 16 ), align: 'center' },
    PANEL_LABEL_OPTIONS: { font: new PhetFont( 11 ) },
    PANEL_LINE_WIDTH: 1,
    PANEL_STROKE: 'black',
    YELLOW_BUTTON_OPTIONS:  {
      font: new PhetFont( 16 ),
      baseColor: '#F2E916', //TODO: change to rgb?
      cornerRadius: 4
    },

    // zooming
    MIN_ZOOM: 0.1,
    MAX_ZOOM: 5,
    DEFAULT_ZOOM: 1.0,

    // normal/slow/play/pause/step
    PLAY_CONTROLS_HORIZONTAL_INSET: 10,
    PLAY_CONTROLS_TEXT_MAX_WIDTH: 80
  };

  projectileMotion.register( 'ProjectileMotionConstants', ProjectileMotionConstants );

  return ProjectileMotionConstants;

} );

