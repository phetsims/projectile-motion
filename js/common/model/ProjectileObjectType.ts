// Copyright 2016-2023, University of Colorado Boulder

/**
 * Projectile object that contains properties of the projectile
 * Creates constants that are used by projectile choice dropdown on the Intro Screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Range, { RangeStateObject } from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import { CompositeSchema } from '../../../../tandem/js/types/StateSchema.js';
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

export type ProjectileObjectViewCreator = ( diameter: number, modelViewTransform: ModelViewTransform2, landed: boolean ) => Node;

type SelfOptions = {
  massRange?: Range;
  massRound?: number;
  diameterRange?: Range;
  diameterRound?: number;

  // most objectTypes have a max of 1
  dragCoefficientRange?: Range;
  viewCreationFunction?: ProjectileObjectViewCreator | null;
};

type ProjectileObjectTypeOptions = SelfOptions &
  PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'> &

  // viewCreationFunction should never be null if provided
  { viewCreationFunction?: ProjectileObjectViewCreator };

type ProjectileObjectTypeStateObject = {
  name: string | null;
  mass: number;
  diameter: number;
  dragCoefficient: number;
  benchmark: string | null;
  rotates: boolean;
  massRange: RangeStateObject;
  massRound: number;
  diameterRange: RangeStateObject;
  diameterRound: number;
  dragCoefficientRange: RangeStateObject;
};

class ProjectileObjectType extends PhetioObject {
  public name: string | null; // name of the object, such as 'Golf ball', or null if it doesn't have a name
  public benchmark: string | null; // identifier of the object benchmark, such as 'tankShell', also considered a 'name' for it like for Tandems. null for screens with only one object type
  public rotates: boolean; // whether the object rotates or just translates in air
  public mass: number; // in kg
  public diameter: number; // in meters
  public dragCoefficient: number;
  public readonly initialMass: number;
  public readonly initialDiameter: number;
  public readonly initialDragCoefficient: number;
  public massRange: Range;
  public massRound: number;
  public diameterRange: Range;
  public diameterRound: number;
  public dragCoefficientRange: Range;
  public viewCreationFunction: ProjectileObjectViewCreator | null;
  public readonly projectileObjectTypeOptions: ProjectileObjectTypeOptions;

  public constructor( name: string | null, mass: number, diameter: number, dragCoefficient: number,
                      benchmark: string | null, rotates: boolean, providedOptions?: ProjectileObjectTypeOptions ) {

    const options = optionize<ProjectileObjectTypeOptions, SelfOptions, PhetioObjectOptions>()( {
      massRange: new Range( 1, 10 ),
      massRound: 1,
      diameterRange: new Range( 0.1, 1 ),
      diameterRound: 0.1,

      // most objectTypes have a max of 1
      dragCoefficientRange: new Range( ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE.min, 1 ),
      viewCreationFunction: null,
      phetioType: ProjectileObjectType.ProjectileObjectTypeIO
    }, providedOptions );

    super( options );

    this.projectileObjectTypeOptions = options;

    this.name = name;
    this.benchmark = benchmark;
    this.rotates = rotates;

    // writable on the lab screen
    this.mass = mass;
    this.diameter = diameter;
    this.dragCoefficient = dragCoefficient;

    // these mutable values also store their initial values
    this.initialMass = mass;
    this.initialDiameter = diameter;
    this.initialDragCoefficient = dragCoefficient;

    this.massRange = options.massRange;
    this.massRound = options.massRound;
    this.diameterRange = options.diameterRange;
    this.diameterRound = options.diameterRound;
    this.dragCoefficientRange = options.dragCoefficientRange;
    this.viewCreationFunction = options.viewCreationFunction;
  }

  public toStateObject(): ProjectileObjectTypeStateObject {
    return {
      name: NullableIO( StringIO ).toStateObject( this.name ),
      mass: this.mass,
      diameter: this.diameter,
      dragCoefficient: this.dragCoefficient,
      benchmark: NullableIO( StringIO ).toStateObject( this.benchmark ),
      rotates: this.rotates,
      massRange: Range.RangeIO.toStateObject( this.massRange ),
      massRound: this.massRound,
      diameterRange: Range.RangeIO.toStateObject( this.diameterRange ),
      diameterRound: this.diameterRound,
      dragCoefficientRange: Range.RangeIO.toStateObject( this.dragCoefficientRange )
    };
  }

  public static get STATE_SCHEMA(): CompositeSchema {
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

  private applyState( stateObject: ProjectileObjectTypeStateObject ): void {
    this.name = NullableIO( StringIO ).fromStateObject( stateObject.name );
    this.mass = stateObject.mass;
    this.diameter = stateObject.diameter;
    this.dragCoefficient = stateObject.dragCoefficient;
    this.benchmark = NullableIO( StringIO ).fromStateObject( stateObject.benchmark );
    this.rotates = stateObject.rotates;
    this.massRange = Range.RangeIO.fromStateObject( stateObject.massRange );
    this.massRound = stateObject.massRound;
    this.diameterRange = Range.RangeIO.fromStateObject( stateObject.diameterRange );
    this.diameterRound = stateObject.diameterRound;
    this.dragCoefficientRange = Range.RangeIO.fromStateObject( stateObject.dragCoefficientRange );
  }

  public static readonly ProjectileObjectTypeIO = new IOType( 'ProjectileObjectTypeIO', {
    valueType: ProjectileObjectType,
    toStateObject: projectileObjectType => projectileObjectType.toStateObject(),
    applyState: ( projectileObjectType, stateObject ) => projectileObjectType.applyState( stateObject ),
    stateSchema: ProjectileObjectType.STATE_SCHEMA,
    documentation: 'A data type that stores the variables for a given object type.'
  } );

//-------------------------------------------------------------------------------------------
// Specific projectile objects below ...
//-------------------------------------------------------------------------------------------

  public static readonly CANNONBALL = new ProjectileObjectType(
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

  public static readonly PUMPKIN = new ProjectileObjectType(
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

  public static readonly BASEBALL = new ProjectileObjectType(
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

  public static readonly CAR = new ProjectileObjectType(
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

  public static readonly FOOTBALL = new ProjectileObjectType(
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

  public static readonly HUMAN = new ProjectileObjectType(
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

  public static readonly PIANO = new ProjectileObjectType(
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

  public static readonly GOLF_BALL = new ProjectileObjectType(
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

  public static readonly TANK_SHELL = new ProjectileObjectType(
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

  public static readonly CUSTOM = new ProjectileObjectType(
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
  public static readonly COMPANIONLESS = new ProjectileObjectType(
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
}

projectileMotion.register( 'ProjectileObjectType', ProjectileObjectType );

export default ProjectileObjectType;