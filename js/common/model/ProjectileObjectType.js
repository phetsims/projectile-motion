// Copyright 2016-2022, University of Colorado Boulder

/**
 * Projectile object that contains properties of the projectile
 * Creates constants that are used by projectile choice dropdown on the Intro Screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import ProjectileObjectViewFactory from '../view/ProjectileObjectViewFactory.js';

const baseballString = ProjectileMotionStrings.baseball;
const cannonballString = ProjectileMotionStrings.cannonball;
const carString = ProjectileMotionStrings.car;
const customString = ProjectileMotionStrings.custom;
const footballString = ProjectileMotionStrings.football;
const golfBallString = ProjectileMotionStrings.golfBall;
const humanString = ProjectileMotionStrings.human;
const pianoString = ProjectileMotionStrings.piano;
const pumpkinString = ProjectileMotionStrings.pumpkin;
const tankShellString = ProjectileMotionStrings.tankShell;

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
   */
  constructor( name, mass, diameter, dragCoefficient, benchmark, rotates, options ) {

    // Options contains data about range and rounding for mass, diameter, drag coefficient.
    // defaults to those of custom objects for screens that don't have benchmarks
    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioType: ProjectileObjectType.ProjectileObjectTypeIO,

      massRange: new Range( 1, 10 ),
      massRound: 1,
      diameterRange: new Range( 0.1, 1 ),
      diameterRound: 0.1,

      // most objectTypes have a max of 1
      dragCoefficientRange: new Range( ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE.min, 1 ),
      viewCreationFunction: null
    }, options );

    super( options );

    // @public (read-only)
    this.name = name;
    this.benchmark = benchmark;
    this.rotates = rotates;
    this.options = options; // stored to support `this.prototype.copy`

    // @public - writable on the lab screen
    this.mass = mass;
    this.diameter = diameter;
    this.dragCoefficient = dragCoefficient;

    // @private - these mutable values also store their initial values
    this.initialMass = mass;
    this.initialDiameter = diameter;
    this.initialDragCoefficient = dragCoefficient;

    // @public (read-only)
    this.massRange = options.massRange;
    this.massRound = options.massRound;
    this.diameterRange = options.diameterRange;
    this.diameterRound = options.diameterRound;
    this.dragCoefficientRange = options.dragCoefficientRange;
    this.viewCreationFunction = options.viewCreationFunction;
  }

  /**
   * @public
   * @returns {Object}
   */
  toStateObject() {
    return {
      name: NullableIO( StringIO ).toStateObject( this.name ),
      mass: NumberIO.toStateObject( this.mass ),
      diameter: NumberIO.toStateObject( this.diameter ),
      dragCoefficient: NumberIO.toStateObject( this.dragCoefficient ),
      benchmark: NullableIO( StringIO ).toStateObject( this.benchmark ),
      rotates: BooleanIO.toStateObject( this.rotates ),
      massRange: Range.RangeIO.toStateObject( this.massRange ),
      massRound: NumberIO.toStateObject( this.massRound ),
      diameterRange: Range.RangeIO.toStateObject( this.diameterRange ),
      diameterRound: NumberIO.toStateObject( this.diameterRound ),
      dragCoefficientRange: Range.RangeIO.toStateObject( this.dragCoefficientRange )
    };
  }


  /**
   * @public
   * @returns {Object}
   */
  static get STATE_SCHEMA() {
    return {
      name: NullableIO( StringIO ),
      mass: NumberIO,
      diameter: NumberIO,
      dragCoefficient: NumberIO,
      benchmark: NullableIO( StringIO ),
      rotates: BooleanIO,
      massRange: Range.RangeIO,
      massRound: NumberIO,
      diameterRange: Range.RangeIO,
      diameterRound: NumberIO,
      dragCoefficientRange: Range.RangeIO
    };
  }

  /**
   * @public
   * @returns {Object}
   */
  applyState( stateObject ) {
    this.name = NullableIO( StringIO ).fromStateObject( stateObject.name );
    this.mass = NumberIO.fromStateObject( stateObject.mass );
    this.diameter = NumberIO.fromStateObject( stateObject.diameter );
    this.dragCoefficient = NumberIO.fromStateObject( stateObject.dragCoefficient );
    this.benchmark = NullableIO( StringIO ).fromStateObject( stateObject.benchmark );
    this.rotates = BooleanIO.fromStateObject( stateObject.rotates );
    this.massRange = Range.RangeIO.fromStateObject( stateObject.massRange );
    this.massRound = NumberIO.fromStateObject( stateObject.massRound );
    this.diameterRange = Range.RangeIO.fromStateObject( stateObject.diameterRange );
    this.diameterRound = NumberIO.fromStateObject( stateObject.diameterRound );
    this.dragCoefficientRange = Range.RangeIO.fromStateObject( stateObject.dragCoefficientRange );
  }
}

ProjectileObjectType.ProjectileObjectTypeIO = new IOType( 'ProjectileObjectTypeIO', {
  valueType: ProjectileObjectType,
  toStateObject: t => t.toStateObject(),
  applyState: ( t, s ) => t.applyState( s ),
  stateSchema: ProjectileObjectType.STATE_SCHEMA,
  documentation: 'A data type that stores the variables for a given object type.'
} );

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
  ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE.max,
  'piano',
  false, {
    massRange: new Range( 50, 1000 ),
    massRound: 1,
    diameterRange: new Range( 0.5, 3 ),
    diameterRound: 0.1,

    // the piano can accept all drag coefficient ranges
    dragCoefficientRange: ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE,
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
    tandem: objectTypesTandem.createTandem( 'custom' ),
    phetioDocumentation: 'A custom projectile type that can have its values edited by the user'
  }
);

// Meant to be used on screens that don't have object type selection, and only use a single object type
ProjectileObjectType.COMPANIONLESS = new ProjectileObjectType(
  null,
  5,
  0.8,
  ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT,
  null,
  true, {
    tandem: objectTypesTandem.createTandem( 'genericObjectType' ),
    phetioDocumentation: 'On some screens there are only a single, general projectile object type. It cannot be ' +
                         'changed to a different object type, but can be altered via Properties in the model.'
  }
);

export default ProjectileObjectType;