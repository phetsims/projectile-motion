// Copyright 2016-2019, University of Colorado Boulder

/**
 * Projectile object that contains properties of the projectile
 * Creates constants that are used by projectile choice dropdown on the Intro Screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  const Range = require( 'DOT/Range' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const baseballString = require( 'string!PROJECTILE_MOTION/baseball' );
  const cannonballString = require( 'string!PROJECTILE_MOTION/cannonball' );
  const carString = require( 'string!PROJECTILE_MOTION/car' );
  const customString = require( 'string!PROJECTILE_MOTION/custom' );
  const footballString = require( 'string!PROJECTILE_MOTION/football' );
  const golfBallString = require( 'string!PROJECTILE_MOTION/golfBall' );
  const humanString = require( 'string!PROJECTILE_MOTION/human' );
  const pianoString = require( 'string!PROJECTILE_MOTION/piano' );
  const pumpkinString = require( 'string!PROJECTILE_MOTION/pumpkin' );
  const tankShellString = require( 'string!PROJECTILE_MOTION/tankShell' );

  // constants
  const objectTypesTandem = Tandem.GLOBAL_MODEL.createTandem( 'projectileObjectTypes' );

  class ProjectileObjectType extends PhetioObject {

    /**
     * @param {string|null} name - name of the object, such as 'Golf ball', or null if it doesn't have a name
     * @param {number} mass - in kg
     * @param {number} diameter - in meters
     * @param {number} dragCoefficient
     * @param {string|null} benchmark - identifier of the object benchmark, such as 'tankShell', also considered a
     *                                      'name' for it like for Tandems. null for screens with only one object type
     * @param {boolean} rotates - whether the object rotates or just translates in air
     * @param {Object} [options]
     * @constructor
     */
    constructor( name, mass, diameter, dragCoefficient, benchmark, rotates, options ) {

      options = merge( {
        phetioState: false,
        tandem: Tandem.required
      }, options );

      super( options );

      // @public (read-only)
      this.name = name;
      this.mass = mass;
      this.diameter = diameter;
      this.dragCoefficient = dragCoefficient;
      this.benchmark = benchmark;
      this.rotates = rotates;

      // options contains data about range and rounding for mass, diameter, drag coefficient
      // @public, defaults to those of custom objects for screens that don't have benchmarks
      options = merge( {
        massRange: new Range( 1, 10 ),
        massRound: 1,
        diameterRange: new Range( 0.1, 1 ),
        diameterRound: 0.1,
        dragCoefficientRange: new Range( 0.04, 1 ),
        dragCoefficientRound: 0.01,
        viewCreationFunction: null
      }, options );

      // @public (read-only)
      this.massRange = options.massRange;
      this.massRound = options.massRound;
      this.diameterRange = options.diameterRange;
      this.diameterRound = options.diameterRound;
      this.dragCoefficientRange = options.dragCoefficientRange;
      this.dragCoefficientRound = options.dragCoefficientRound;
      this.viewCreationFunction = options.viewCreationFunction;
    }
  }

  projectileMotion.register( 'ProjectileObjectType', ProjectileObjectType );

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
      diameterRound: 0.01,
      viewCreationFunction: ProjectileObjectViewFactory.createCannonball,
      tandem: objectTypesTandem.createTandem( 'cannonball' )
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
      diameterRound: 0.01,
      viewCreationFunction: ProjectileObjectViewFactory.createPumpkin,
      tandem: objectTypesTandem.createTandem( 'pumpkin' )
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
      diameterRound: 0.01,
      viewCreationFunction: ProjectileObjectViewFactory.createBaseball,
      tandem: objectTypesTandem.createTandem( 'baseball' )
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
      diameterRound: 0.1,
      viewCreationFunction: ProjectileObjectViewFactory.createCar,
      tandem: objectTypesTandem.createTandem( 'car' )
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
      diameterRound: 0.01,
      viewCreationFunction: ProjectileObjectViewFactory.createFootball,
      tandem: objectTypesTandem.createTandem( 'football' )
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
      diameterRound: 0.1,
      viewCreationFunction: ProjectileObjectViewFactory.createHuman,
      tandem: objectTypesTandem.createTandem( 'human' )
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
      diameterRound: 0.1,
      viewCreationFunction: ProjectileObjectViewFactory.createPiano,
      tandem: objectTypesTandem.createTandem( 'piano' )
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
      diameterRound: 0.01,
      viewCreationFunction: ProjectileObjectViewFactory.createGolfBall,
      tandem: objectTypesTandem.createTandem( 'golfBall' )
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
      diameterRound: 0.01,
      viewCreationFunction: ProjectileObjectViewFactory.createTankShell,
      tandem: objectTypesTandem.createTandem( 'tankShell' )
    }
  );

  ProjectileObjectType.CUSTOM = new ProjectileObjectType(
    customString,
    100,
    1,
    ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT,
    'custom',
    true, {
      massRange: new Range( 1, 5000 ),
      massRound: 0.01,
      diameterRange: new Range( 0.01, 3 ),
      diameterRound: 0.01,
      dragCoefficientRange: new Range( 0.04, 1 ),
      dragCoefficientRound: 0.01,
      tandem: objectTypesTandem.createTandem( 'custom' ),
      phetioDocumentation: 'A custom projectile type that can have its values edited by the user'
    }
  );

  return ProjectileObjectType;
} );

