// Copyright 2016-2017, University of Colorado Boulder

/**
 * Constants for the entire sim, global.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Range = require( 'DOT/Range' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var AIR_RESISTANCE_ICON_PATH = new Path( Shape.arc( 0, 0, 10, Math.PI * 1.15, Math.PI * 1.85 ), {
    lineWidth: 3,
    stroke: 'rgb( 252, 40, 252 )'
  } );
  var SMALL_DOT_RADIUS = 1.65; // in global view coordinates, empirically determined

  var ProjectileMotionConstants = {

    // truths about the world
    GRAVITY_ON_EARTH: 9.81,

    // screen view layout
    VIEW_ORIGIN: new Vector2( 100, 510 ),

    // cannonball defaults
    CANNONBALL_MASS: 17.6,
    CANNONBALL_DIAMETER: 0.18,
    CANNONBALL_DRAG_COEFFICIENT: 0.47,

    // productive constraints
    MAX_NUMBER_OF_TRAJECTORIES: 5,
    MAX_NUMBER_OF_FLYING_PROJECTILES: 3,

    CANNON_HEIGHT_RANGE: new Range( 0, 15 ),
    CANNON_ANGLE_RANGE: new Range( -90, 90 ),
    LAUNCH_VELOCITY_RANGE: new Range( 0, 30 ),

    PROJECTILE_MASS_RANGE: new Range( 1, 10 ), // in original, highest is 1000
    PROJECTILE_DIAMETER_RANGE: new Range( 0.1, 1 ), // in original, smallest is 0.043
    PROJECTILE_DRAG_COEFFICIENT_RANGE: new Range( 0.04, 1 ), // teardrop to almost hemisphere shape

    ALTITUDE_RANGE: new Range( 0, 5000 ), // meters, max is arbitrary but in upper stratosphere
    GRAVITY_RANGE: new Range( 5, 20 ), // in m/s/s

    // projectile and trajectory
    AIR_RESISTANCE_ON_PATH_COLOR: 'rgb( 252, 40, 252 )',
    AIR_RESISTANCE_OFF_PATH_COLOR: 'blue',
    VELOCITY_ARROW_FILL: 'rgb( 50, 255, 50 )',
    ACCELERATION_ARROW_FILL: 'rgb( 255, 255, 50 )',
    PATH_WIDTH: 2,

    // data point collection along the trajectory
    TIME_PER_DATA_POINT: 25, // milliseconds
    TIME_PER_MINOR_DOT: 100, // milliseconds
    TIME_PER_MAJOR_DOT: 1000, // milliseconds
    SMALL_DOT_RADIUS: SMALL_DOT_RADIUS, // in global view coordinates
    LARGE_DOT_RADIUS: SMALL_DOT_RADIUS * 2, // in global view coordinates

    // icons
    VELOCITY_VECTOR_ICON: new ArrowNode( 0, 0, 20, 0, {
      fill: 'rgb( 50, 255, 50 )',
      lineWidth: 0.5,
      tailWidth: 4,
      headWidth: 10,
      headHeight: 8
    } ),
    ACCELERATION_VECTOR_ICON: new ArrowNode( 0, 0, 20, 0, {
      fill: 'rgb( 255, 255, 50 )',
      lineWidth: 0.5,
      tailWidth: 4,
      headWidth: 10,
      headHeight: 8
    } ),
    FORCE_VECTOR_ICON: new ArrowNode( 0, 0, 20, 0, {
      fill: 'black',
      stroke: null,
      tailWidth: 4,
      headWidth: 10,
      headHeight: 8
    } ),
    AIR_RESISTANCE_ICON: new Node( {
      centerY: 0, left: 0, children: [
        AIR_RESISTANCE_ICON_PATH,
        new Circle( 2.2, {
          x: AIR_RESISTANCE_ICON_PATH.right - 0.8,
          y: AIR_RESISTANCE_ICON_PATH.bottom - 0.2,
          fill: 'black'
        } ),
        new Circle( 2.2, {
          x: AIR_RESISTANCE_ICON_PATH.left + 0.8,
          y: AIR_RESISTANCE_ICON_PATH.bottom - 0.2,
          fill: 'black'
        } ),
        new Circle( 2.2, {
          x: AIR_RESISTANCE_ICON_PATH.centerX,
          y: AIR_RESISTANCE_ICON_PATH.top + 1.5,
          fill: 'black'
        } )
      ]
    } ),

    // target
    TARGET_X_DEFAULT: 15, // meters
    TARGET_WIDTH: 3, // meters
    TARGET_HEIGHT: 0.6, // meters

    // control panels
    RIGHTSIDE_PANEL_OPTIONS: {
      align: 'center',
      controlsVerticalSpace: 9,
      minWidth: 260,
      xMargin: 10,
      xSpacing: 10,
      yMargin: 10,
      fill: 'rgb( 255, 238, 218 )',
      lineWidth: 1,
      stroke: 'black',
      textDisplayWidth: 60,
      textDisplayHeight: 24,
      sliderLabelSpacing: 6
    },

    INITIAL_SPEED_PANEL_OPTIONS: {
      fill: 'rgb( 235, 235, 235 )',
      lineWidth: 1,
      stroke: 'black',
      xMargin: 10,
      yMargin: 5
    },

    PANEL_TITLE_OPTIONS: { font: new PhetFont( { size: 14, weight: 'bold' } ), align: 'center' },
    PANEL_LABEL_OPTIONS: { font: new PhetFont( 14 ) },
    PANEL_BOLD_LABEL_OPTIONS: { font: new PhetFont( { size: 14, weight: 'bold' } ) },

    TEXT_BACKGROUND_OPTIONS: { fill: 'white', stroke: 'lightGray' },

    LABEL_TEXT_OPTIONS: { font: new PhetFont( 14 ) },

    //Light gray, used as the 'disabled' color
    LIGHT_GRAY: 'rgb( 220, 220, 220 )',

    YELLOW_BUTTON_OPTIONS: {
      font: new PhetFont( 14 ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      cornerRadius: 4,
      xMargin: 12,
      yMargin: 7
    },

    // zooming
    MIN_ZOOM: 0.25,
    MAX_ZOOM: 2,
    DEFAULT_ZOOM: 1.0,

    // normal/slow/play/pause/step
    PLAY_CONTROLS_HORIZONTAL_INSET: 10,
    PLAY_CONTROLS_TEXT_MAX_WIDTH: 80
  };

  projectileMotion.register( 'ProjectileMotionConstants', ProjectileMotionConstants );

  return ProjectileMotionConstants;

} );

