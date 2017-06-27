// Copyright 2013-2015, University of Colorado Boulder

/**
 * Projectile object that contains properties of the projectile
 * Creates constants that are used by projectile choice dropdown on the Intro Screen.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
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
  var buickString = require( 'string!PROJECTILE_MOTION/buick' );
  var footballString = require( 'string!PROJECTILE_MOTION/football' );
  var humanString = require( 'string!PROJECTILE_MOTION/human' );
  var pianoString = require( 'string!PROJECTILE_MOTION/piano' );
  var golfBallString = require( 'string!PROJECTILE_MOTION/golfBall' );
  var tankShellString = require( 'string!PROJECTILE_MOTION/tankShell' );
  var customString = require( 'string!PROJECTILE_MOTION/custom' );

  /**
   * @param {string} name - name of the object, such as 'Golf ball'
   * @param {number} mass - in kg
   * @param {number} diameter - in meters
   * @param {number} dragCoefficient
   * @param {string || null} type - identifier of the object type, such as 'tankShell'
   * @param {boolean || null} rotates - whether the object rotates or just translates in air
   * @param {Object} [options]
   * @constructor
   */
  function ProjectileObjectType( name, mass, diameter, dragCoefficient, type, rotates, options ) {

    // @public (read-only)
    this.name = name;
    this.mass = mass;
    this.diameter = diameter;
    this.dragCoefficient = dragCoefficient;
    this.type = type || null;
    this.rotates = rotates || false;

    // optionscontains data about range and rounding for mass, diameter, drag coefficient
    // defaults are null, which means no specific range or rounding is needed
    options = options || {};

    // @public
    this.massRange = options.massRange || null;
    this.massRound = options.massRound || null;
    this.diameterRange = options.diameterRange || null;
    this.diameterRound = options.diameterRound || null;
    this.dragCoefficientRange = options.dragCoefficientRange || null;
    this.dragCoefficientRound = options.dragCoefficientRound || null;
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
      massRange: new Range( 1, 50 ),
      massRound: 0.1,
      diameterRange: new Range( 0.1, 1 ),
      diameterRound: 0.01,
      dragCoefficientRange: new Range( 0.2, 0.7 ),
      dragCoefficientRound: 0.01
    }
  );

  ProjectileObjectType.PUMPKIN = new ProjectileObjectType(
    pumpkinString,
    5,
    0.37,
    0.6,
    'pumpkin',
    false, {
      massRange: new Range( 1, 10 ),
      massRound: 0.1,
      diameterRange: new Range( 0.1, 1 ),
      diameterRound: 0.01,
      dragCoefficientRange: new Range( 0.4, 0.8 ),
      dragCoefficientRound: 0.1
    }
  );

  ProjectileObjectType.BASEBALL = new ProjectileObjectType(
    baseballString,
    0.145,
    0.074,
    0.35,
    'baseball',
    false, {
      massRange: new Range( 0.1, 0.2 ),
      massRound: 0.001,
      diameterRange: new Range( 0.02, 0.1 ),
      diameterRound: 0.001,
      dragCoefficientRange: new Range( 0.1, 0.5 ),
      dragCoefficientRound: 0.01
    }
  );

  ProjectileObjectType.BUICK = new ProjectileObjectType(
    buickString,
    2000,
    2,
    0.55,
    'buick',
    true, {
      massRange: new Range( 1800, 2000 ),
      massRound: 1,
      diameterRange: new Range( 1.5, 2 ),
      diameterRound: 0.1,
      dragCoefficientRange: new Range( 0.4, 0.7 ),
      dragCoefficientRound: 0.01
    }
  );

  ProjectileObjectType.FOOTBALL = new ProjectileObjectType(
    footballString,
    0.41,
    0.17,
    0.05,
    'football',
    true, {
      massRange: new Range( 0.2, 0.5 ),
      massRound: 0.01,
      diameterRange: new Range( 0.1, 0.2 ),
      diameterRound: 0.01,
      dragCoefficientRange: new Range( 0.04, 0.1 ),
      dragCoefficientRound: 0.01
    }
  );

  ProjectileObjectType.HUMAN = new ProjectileObjectType(
    humanString,
    70,
    0.5,
    0.6,
    'human',
    true, {
      massRange: new Range( 20, 100 ),
      massRound: 1,
      diameterRange: new Range( 0.2, 1.5 ),
      diameterRound: 0.1,
      dragCoefficientRange: new Range( 0.5, 0.8 ),
      dragCoefficientRound: 0.1
    }
  );

  ProjectileObjectType.PIANO = new ProjectileObjectType(
    pianoString,
    480,
    2.2,
    0.9,
    'piano',
    false, {
      massRange: new Range( 400, 600 ),
      massRound: 1,
      diameterRange: new Range( 2, 2.5 ),
      diameterRound: 0.1,
      dragCoefficientRange: new Range( 0.7, 1 ),
      dragCoefficientRound: 0.1
    }
  );

  ProjectileObjectType.GOLF_BALL = new ProjectileObjectType(
    golfBallString,
    0.046,
    0.043,
    0.25,
    'golfBall',
    false, {
      massRange: new Range( 0.04, 0.06 ),
      massRound: 0.001,
      diameterRange: new Range( 0.01, 0.08 ),
      diameterRound: 0.001,
      dragCoefficientRange: new Range( 0.2, 0.4 ),
      dragCoefficientRound: 0.01
    }
  );

  ProjectileObjectType.TANK_SHELL = new ProjectileObjectType(
    tankShellString,
    41.9,
    0.15,
    0.06,
    'tankShell',
    true, {
      massRange: new Range( 30, 50 ),
      massRound: 0.1,
      diameterRange: new Range( 0.05, 0.5 ),
      diameterRound: 0.01,
      dragCoefficientRange: new Range( 0.04, 0.1 ),
      dragCoefficientRound: 0.01
    }
  );

  ProjectileObjectType.CUSTOM = new ProjectileObjectType(
    customString,
    ProjectileMotionConstants.CANNONBALL_MASS,
    ProjectileMotionConstants.CANNONBALL_DIAMETER,
    ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT,
    null,
    false, {
      massRange: new Range( 0.04, 2000 ),
      massRound: 0.001,
      diameterRange: new Range( 0.01, 2.5 ),
      diameterRound: 0.001,
      dragCoefficientRange: new Range( 0.04, 1 ),
      dragCoefficientRound: 0.01
    }
  );

  return ProjectileObjectType;
} );

