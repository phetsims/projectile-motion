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
  var RandomIconFactory = require( 'PROJECTILE_MOTION/common/RandomIconFactory' );
  var Range = require( 'DOT/Range' );

  var ProjectileMotionConstants = {

    // TODO: take this away eventually
    RANDOM_ICON_FACTORY: new RandomIconFactory( -33 ),

    // truths about the world
    ACCELERATION_DUE_TO_GRAVITY: 9.8,
    SPHERE_DRAG_COEFFICIENT: 0.47, // https://en.wikipedia.org/wiki/Drag_coefficient

    // cannonball defaults
    CANNONBALL_MASS: 100,
    CANNONBALL_DIAMETER: 0.3,
    CANNONBALL_DRAG_COEFFICIENT: 0.45,

    // productive constraints
    MAX_NUMBER_OF_PROJECTILES: 5,

    CANNON_HEIGHT_RANGE: new Range( 0, 15 ),
    CANNON_ANGLE_RANGE: new Range( -90, 90 ),
    LAUNCH_VELOCITY_RANGE: new Range( 0, 100 ),

    PROJECTILE_MASS_RANGE: new Range( 0.04, 200 ), // in original, highest is 1000
    PROJECTILE_DIAMETER_RANGE: new Range( 0.1, 2.5 ), // in original, smallest is 0.043

    // data point collection along the trajectory
    TIME_PER_DATA_POINT: 16, // milliseconds
    TIME_PER_SHOWN_POINT: 48, // milliseconds

    // http://www.aquaphoenix.com/lecture/matlab5/page2.html, teardrop to pancake shape
    PROJECTILE_DRAG_COEFFICIENT_RANGE: new Range( 0.05, 1.1 ),
    ALTITUDE_RANGE: new Range( 0, 30000 ), // meters, max is arbitrary but in upper stratosphere

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
    RIGHTSIDE_PANEL_OPTIONS: {
      align: 'center',
      controlsVerticalSpace: 10,
      minWidth: 240,
      xMargin: 10,
      yMargin: 10,
      fill: 'rgb( 255, 238, 218 )',
      lineWidth: 1,
      stroke: 'black'
    },

    //Light gray, used as the 'disabled' color
    LIGHT_GRAY: 'rgb( 220, 220, 220 )',

    PANEL_TITLE_OPTIONS: { font: new PhetFont( { size: 14, weight: 'bold' } ), align: 'center' },
    PANEL_LABEL_OPTIONS: { font: new PhetFont( 14 ) },
    PANEL_BIGGER_LABEL_OPTIONS: { font: new PhetFont( 16 ) },
    PANEL_BOLD_LABEL_OPTIONS: { font: new PhetFont( { size: 14, weight: 'bold' } ) },
    PANEL_BIGGER_BOLD_LABEL_OPTIONS: { font: new PhetFont( { size: 16, weight: 'bold' } ) },

    YELLOW_BUTTON_OPTIONS: {
      font: new PhetFont( 14 ),
      baseColor: '#F2E916', //TODO: change to rgb?
      cornerRadius: 4,
      xMargin: 12,
      yMargin: 7
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

