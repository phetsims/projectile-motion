// Copyright 2016-2024, University of Colorado Boulder

/**
 * Constants for the entire sim, global.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import { Shape } from '../../../kite/js/imports.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import { NumberDisplayOptions } from '../../../scenery-phet/js/NumberDisplay.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Circle, Node, Path, TextOptions } from '../../../scenery/js/imports.js';
import { PanelOptions } from '../../../sun/js/Panel.js';
import projectileMotion from '../projectileMotion.js';

export type ProjectileMotionUIOptions = {
  controlsVerticalSpace?: number;
  xSpacing?: number;
  textDisplayWidth?: number;
  numberDisplayMaxWidth?: number;
  textDisplayHeight?: number;
  readoutXMargin?: number;
  sliderLabelSpacing?: number;
} & PanelOptions;

// constants
const AIR_RESISTANCE_ICON_PATH = new Path( Shape.arc( 0, 0, 10, Math.PI * 1.15, Math.PI * 1.85 ), {
    lineWidth: 3, stroke: 'rgb( 252, 40, 252 )'
  }
);
const SMALL_DOT_RADIUS = 1.65; // in global view coordinates, empirically determined

const TEXT_DISPLAY_WIDTH = 50;

const ProjectileMotionConstants = {
  // screen view layout
  VIEW_ORIGIN: new Vector2( 70, 510 ),

  // cannonball defaults
  CANNONBALL_MASS: 17.6,
  CANNONBALL_DIAMETER: 0.18,
  CANNONBALL_DRAG_COEFFICIENT: 0.47,

  // productive constraints
  MAX_NUMBER_OF_TRAJECTORIES: 10,
  MAX_NUMBER_OF_TRAJECTORIES_STATS: 20,
  RAPID_FIRE_DELTA_TIME: 0.2,

  //group size
  GROUP_SIZE_DEFAULT: 10,
  GROUP_SIZE_INCREMENT: 1,
  GROUP_SIZE_MAX: 20,

  CANNON_HEIGHT_RANGE: new Range( 0, 15 ), // in m
  CANNON_ANGLE_RANGE: new Range( -90, 90 ), // in degrees
  LAUNCH_VELOCITY_RANGE: new Range( 0, 30 ), // m/s
  SPEED_STANDARD_DEVIATION_RANGE: new Range( 0, 5 ), // m/s
  ANGLE_STANDARD_DEVIATION_RANGE: new Range( 0, 10 ), // in degrees

  PROJECTILE_MASS_RANGE: new Range( 0.01, 5000 ), // in original, highest is 1000
  PROJECTILE_DIAMETER_RANGE: new Range( 0.01, 3 ), // in original, smallest is 0.043
  PROJECTILE_DRAG_COEFFICIENT_RANGE: new Range( 0.04, 1.2 ), // teardrop to almost hemisphere shape

  ALTITUDE_RANGE: new Range( 0, 5000 ), // meters, max is arbitrary but in upper stratosphere
  GRAVITY_RANGE: new Range( 1, 20 ), // in m/s/s

  // projectile and trajectory
  AIR_RESISTANCE_ON_PATH_COLOR: 'rgb( 252, 40, 252 )',
  AIR_RESISTANCE_OFF_PATH_COLOR: 'blue',
  VELOCITY_ARROW_FILL: PhetColorScheme.VELOCITY,
  ACCELERATION_ARROW_FILL: PhetColorScheme.ACCELERATION,
  PATH_WIDTH: 2,

  // data point collection along the trajectory
  SLOW_MOTION_FACTOR: 0.33, // time slowdown factor

  // This number should be as low as possible for smooth slow motion,
  // but decreasing it causes more data points to be created - see https://github.com/phetsims/projectile-motion/issues/124
  TIME_PER_DATA_POINT: 12, // milliseconds

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
  TARGET_X_STATS: 20, // meters
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
    textDisplayWidth: TEXT_DISPLAY_WIDTH,
    numberDisplayMaxWidth: TEXT_DISPLAY_WIDTH * 1.2,
    textDisplayHeight: 24,
    readoutXMargin: 7,
    sliderLabelSpacing: 6
  } satisfies ProjectileMotionUIOptions,

  INITIAL_VALUE_PANEL_OPTIONS: {
    fill: 'rgb( 235, 235, 235 )',
    lineWidth: 1,
    stroke: 'black',
    xMargin: 10,
    yMargin: 5
  } satisfies PanelOptions,

  PANEL_TITLE_OPTIONS: { font: new PhetFont( { size: 14, weight: 'bold' } ), align: 'center' },
  PANEL_LABEL_OPTIONS: { font: new PhetFont( 14 ) } satisfies TextOptions,
  PANEL_BOLD_LABEL_OPTIONS: { font: new PhetFont( { size: 14, weight: 'bold' } ) },

  NUMBER_DISPLAY_OPTIONS: {
    textOptions: { font: new PhetFont( 14 ) },
    backgroundFill: 'white',
    backgroundStroke: 'lightGray',
    align: 'right',
    yMargin: 4
  } satisfies NumberDisplayOptions,

  LABEL_TEXT_OPTIONS: { font: new PhetFont( 14 ) },

  // Light gray, used as the 'disabled' color
  LIGHT_GRAY: 'rgb( 220, 220, 220 )',
  SEPARATOR_COLOR: 'gray', // horizontal dividing line in the control panels

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
  DEFAULT_ZOOM: 1,

  // normal/slow/play/pause/step
  PLAY_CONTROLS_HORIZONTAL_INSET: 10,
  PLAY_CONTROLS_TEXT_MAX_WIDTH: 80
};

projectileMotion.register(
  'ProjectileMotionConstants',
  ProjectileMotionConstants
);

export default ProjectileMotionConstants;