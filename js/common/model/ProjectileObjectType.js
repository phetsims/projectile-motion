// Copyright 2016-2017, University of Colorado Boulder

/**
 * Projectile object that contains properties of the projectile
 * Creates constants that are used by projectile choice dropdown on the Intro Screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Range = require( 'DOT/Range' );

  // strings
  var cannonballString = require( 'string!PROJECTILE_MOTION/cannonball' );
  var pumpkinString = require( 'string!PROJECTILE_MOTION/pumpkin' );
  var baseballString = require( 'string!PROJECTILE_MOTION/baseball' );
  var carString = require( 'string!PROJECTILE_MOTION/car' );
  var footballString = require( 'string!PROJECTILE_MOTION/football' );
  var humanString = require( 'string!PROJECTILE_MOTION/human' );
  var pianoString = require( 'string!PROJECTILE_MOTION/piano' );
  var golfBallString = require( 'string!PROJECTILE_MOTION/golfBall' );
  var tankShellString = require( 'string!PROJECTILE_MOTION/tankShell' );
  var customString = require( 'string!PROJECTILE_MOTION/custom' );

  /**
   * @param {string || null} name - name of the object, such as 'Golf ball', or null if it doesn't have a name
   * @param {number} mass - in kg
   * @param {number} diameter - in meters
   * @param {number} dragCoefficient
   * @param {string || null} benchmark - identifier of the object benchmark, such as 'tankShell', or null for no specific benchmark
   * @param {boolean} rotates - whether the object rotates or just translates in air
   * @param {Object} [options]
   * @constructor
   */
  function ProjectileObjectType( name, mass, diameter, dragCoefficient, benchmark, rotates, options ) {

    // @public (read-only)
    this.name = name;
    this.mass = mass;
    this.diameter = diameter;
    this.dragCoefficient = dragCoefficient;
    this.benchmark = benchmark || null;
    this.rotates = rotates;

    // options contains data about range and rounding for mass, diameter, drag coefficient
    // @public, defaults to those of custom objects for screens that don't have benchmarks
    options = _.extend( {
      massRange: new Range( 1, 10 ),
      massRound: 1,
      diameterRange: new Range( 0.1, 1 ),
      diameterRound: 0.1,
      dragCoefficientRange: new Range( 0.04, 1 ),
      dragCoefficientRound: 0.01
    }, options );

    this.massRange = options.massRange;
    this.massRound = options.massRound;
    this.diameterRange = options.diameterRange;
    this.diameterRound = options.diameterRound;
    this.dragCoefficientRange = options.dragCoefficientRange;
    this.dragCoefficientRound = options.dragCoefficientRound;
  }

  projectileMotion.register( 'ProjectileObjectType', ProjectileObjectType );

  inherit( Object, ProjectileObjectType );

  //-------------------------------------------------------------------------------------------
  // Specific projectile objects below ...
  //-------------------------------------------------------------------------------------------

  ProjectileObjectType.CANNONBALL = new ProjectileObjectType(
    cannonballString,
    ProjectileMotionConstants.CANNONBALL_MASS,
    ProjectileMotionConstants.CANNONBALL_DIAMETER,
    ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT,
    'cannonball',
    false, {
      massRange: new Range( 1, 31.00 ),
      massRound: 0.01,
      diameterRange: new Range( 0.1, 1 ),
      diameterRound: 0.01
    }
  );

  ProjectileObjectType.PUMPKIN = new ProjectileObjectType(
    pumpkinString,
    5,
    0.37,
    0.6,
    'pumpkin',
    false, {
      massRange: new Range( 1, 1000 ),
      massRound: 1,
      diameterRange: new Range( 0.1, 3 ),
      diameterRound: 0.01
    }
  );

  ProjectileObjectType.BASEBALL = new ProjectileObjectType(
    baseballString,
    0.15,
    0.07,
    0.35,
    'baseball',
    false, {
      massRange: new Range( 0.01, 5 ),
      massRound: 0.01,
      diameterRange: new Range( 0.01, 1 ),
      diameterRound: 0.01
    }
  );

  ProjectileObjectType.CAR = new ProjectileObjectType(
    carString,
    2000,
    2,
    0.55,
    'car',
    true, {
      massRange: new Range( 100, 5000 ),
      massRound: 1,
      diameterRange: new Range( 0.5, 3 ),
      diameterRound: 0.1
    }
  );

  ProjectileObjectType.FOOTBALL = new ProjectileObjectType(
    footballString,
    0.41,
    0.17,
    0.05,
    'football',
    true, {
      massRange: new Range( 0.01, 5 ),
      massRound: 0.01,
      diameterRange: new Range( 0.01, 1 ),
      diameterRound: 0.01
    }
  );

  ProjectileObjectType.HUMAN = new ProjectileObjectType(
    humanString,
    70,
    0.5,
    0.6,
    'human',
    true, {
      massRange: new Range( 10, 200 ),
      massRound: 1,
      diameterRange: new Range( 0.1, 1.5 ),
      diameterRound: 0.1
    }
  );

  ProjectileObjectType.PIANO = new ProjectileObjectType(
    pianoString,
    400,
    2.2,
    1.2,
    'piano',
    false, {
      massRange: new Range( 50, 1000 ),
      massRound: 1,
      diameterRange: new Range( 0.5, 3 ),
      diameterRound: 0.1
    }
  );

  ProjectileObjectType.GOLF_BALL = new ProjectileObjectType(
    golfBallString,
    0.05,
    0.04,
    0.25,
    'golfBall',
    false, {
      massRange: new Range( 0.01, 5 ),
      massRound: 0.01,
      diameterRange: new Range( 0.01, 1 ),
      diameterRound: 0.01
    }
  );

  ProjectileObjectType.TANK_SHELL = new ProjectileObjectType(
    tankShellString,
    42,
    0.15,
    0.06,
    'tankShell',
    true, {
      massRange: new Range( 5, 200 ),
      massRound: 1,
      diameterRange: new Range( 0.1, 1 ),
      diameterRound: 0.01
    }
  );

  ProjectileObjectType.CUSTOM = new ProjectileObjectType(
    customString,
    100,
    1,
    ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT,
    null,
    true, {
      massRange: new Range( 1, 5000 ),
      massRound: 0.01,
      diameterRange: new Range( 0.01, 3 ),
      diameterRound: 0.01,
      dragCoefficientRange: new Range( 0.04, 1 ),
      dragCoefficientRound: 0.01
    }
  );

  return ProjectileObjectType;
} );

