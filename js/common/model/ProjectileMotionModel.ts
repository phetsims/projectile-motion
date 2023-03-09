// Copyright 2016-2023, University of Colorado Boulder

/**
 * Common model (base type) for Projectile Motion.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import VarianceNumberProperty from '../../../../axon/js/VarianceNumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import EventTimer from '../../../../phet-core/js/EventTimer.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhysicalConstants from '../../../../phet-core/js/PhysicalConstants.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import StatUtils from '../StatUtils.js';
import DataProbe from './DataProbe.js';
import ProjectileMotionMeasuringTape from './ProjectileMotionMeasuringTape.js';
import ProjectileObjectType from './ProjectileObjectType.js';
import Target from './Target.js';
import Trajectory, { TrajectoryGroupCreateElementArguments } from './Trajectory.js';

// constants
const MIN_ZOOM = ProjectileMotionConstants.MIN_ZOOM;
const MAX_ZOOM = ProjectileMotionConstants.MAX_ZOOM;
const DEFAULT_ZOOM = ProjectileMotionConstants.DEFAULT_ZOOM;

const TIME_PER_DATA_POINT = ProjectileMotionConstants.TIME_PER_DATA_POINT; // ms

type ProjectileMotionModelOptions = {
  maxProjectiles?: number;
  defaultCannonHeight?: number;
  defaultCannonAngle?: number;
  defaultInitialSpeed?: number;
  defaultSpeedStandardDeviation?: number;
  defaultAngleStandardDeviation?: number;
  targetX?: number;
  phetioInstrumentAltitudeProperty?: boolean;
};

class ProjectileMotionModel implements TModel {
  public maxProjectiles: number;
  public target: Target;
  public measuringTape: ProjectileMotionMeasuringTape;
  public cannonHeightProperty: Property<number>;
  public initialSpeedStandardDeviationProperty: Property<number>;
  public initialSpeedProperty: VarianceNumberProperty;
  public initialAngleStandardDeviationProperty: Property<number>;
  public cannonAngleProperty: VarianceNumberProperty;
  public projectileMassProperty: Property<number>;
  public projectileDiameterProperty: Property<number>;
  public projectileDragCoefficientProperty: Property<number>;
  public selectedProjectileObjectTypeProperty: Property<ProjectileObjectType>;
  public gravityProperty: Property<number>;
  public altitudeProperty: Property<number>;
  public airResistanceOnProperty: Property<boolean>;
  public airDensityProperty: TReadOnlyProperty<number>;
  public timeSpeedProperty: EnumerationProperty<TimeSpeed>;
  public isPlayingProperty: Property<boolean>;
  public readonly davidHeight: number;
  public readonly davidPosition: Vector2;
  public numberOfMovingProjectilesProperty: Property<number>;
  public rapidFireModeProperty: Property<boolean>;
  public fireEnabledProperty: TReadOnlyProperty<boolean>;
  public updateTrajectoryRanksEmitter: Emitter;
  private eventTimer: EventTimer;
  public muzzleFlashStepper: Emitter<[ number ]>; // emits when cannon needs to update its muzzle flash animation
  public zoomProperty: NumberProperty;
  public trajectoryGroup: PhetioGroup<Trajectory, TrajectoryGroupCreateElementArguments>; // a group of trajectories, limited to this.maxProjectiles
  public dataProbe: DataProbe;

  /**
   * @param defaultProjectileObjectType -  default object type for the model
   * @param defaultAirResistanceOn -  default air resistance on value
   * @param possibleObjectTypes - a list of the possible ProjectileObjectTypes for the model
   */
  public constructor( defaultProjectileObjectType: ProjectileObjectType, defaultAirResistanceOn: boolean,
                      possibleObjectTypes: ProjectileObjectType[], tandem: Tandem, providedOptions?: ProjectileMotionModelOptions ) {

    const options = optionize<ProjectileMotionModelOptions>()( {
      maxProjectiles: ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES,
      defaultCannonHeight: 0,
      defaultCannonAngle: 80,
      defaultInitialSpeed: 18,
      defaultSpeedStandardDeviation: 0,
      defaultAngleStandardDeviation: 0,
      targetX: ProjectileMotionConstants.TARGET_X_DEFAULT,
      phetioInstrumentAltitudeProperty: true
    }, providedOptions );

    this.maxProjectiles = options.maxProjectiles;
    this.target = new Target( options.targetX, tandem.createTandem( 'target' ) );
    this.measuringTape = new ProjectileMotionMeasuringTape( tandem.createTandem( 'measuringTape' ) );

    this.cannonHeightProperty = new NumberProperty( options.defaultCannonHeight, {
      tandem: tandem.createTandem( 'cannonHeightProperty' ),
      phetioDocumentation: 'Height of the cannon',
      units: 'm',
      range: ProjectileMotionConstants.CANNON_HEIGHT_RANGE
    } );

    this.initialSpeedStandardDeviationProperty = new NumberProperty( options.defaultSpeedStandardDeviation, {
      tandem: tandem.createTandem( 'initialSpeedStandardDeviationProperty' ),
      phetioDocumentation: 'The standard deviation of the launch speed',
      units: 'm/s',
      range: new Range( 0, 10 )
    } );

    this.initialSpeedProperty = new VarianceNumberProperty( options.defaultInitialSpeed, value => {
      return StatUtils.randomFromNormal( value, this.initialSpeedStandardDeviationProperty.value );
    }, {
      tandem: tandem.createTandem( 'initialSpeedProperty' ),
      phetioDocumentation: 'The speed on launch',
      units: 'm/s',
      range: ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE
    } );

    this.initialAngleStandardDeviationProperty = new NumberProperty( options.defaultAngleStandardDeviation, {
      tandem: tandem.createTandem( 'initialAngleStandardDeviationProperty' ),
      phetioDocumentation: 'The standard deviation of the launch angle',
      units: '\u00B0', // degrees
      range: new Range( 0, 30 )
    } );

    this.cannonAngleProperty = new VarianceNumberProperty( options.defaultCannonAngle, value => {
      return StatUtils.randomFromNormal( value, this.initialAngleStandardDeviationProperty.value );
    }, {
      tandem: tandem.createTandem( 'cannonAngleProperty' ),
      phetioDocumentation: 'Angle of the cannon',
      units: '\u00B0', // degrees
      range: ProjectileMotionConstants.CANNON_ANGLE_RANGE
    } );

    this.projectileMassProperty = new NumberProperty( defaultProjectileObjectType.mass, {
      tandem: tandem.createTandem( 'projectileMassProperty' ),
      phetioDocumentation: 'Mass of the projectile',
      units: 'kg',
      range: ProjectileMotionConstants.PROJECTILE_MASS_RANGE
    } );

    this.projectileDiameterProperty = new NumberProperty( defaultProjectileObjectType.diameter, {
      tandem: tandem.createTandem( 'projectileDiameterProperty' ),
      phetioDocumentation: 'Diameter of the projectile',
      units: 'm',
      range: ProjectileMotionConstants.PROJECTILE_DIAMETER_RANGE
    } );

    this.projectileDragCoefficientProperty = new NumberProperty( defaultProjectileObjectType.dragCoefficient, {
      tandem: tandem.createTandem( 'projectileDragCoefficientProperty' ),
      phetioDocumentation:
        'Drag coefficient of the projectile, unitless as it is a coefficient',
      range: ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE
    } );

    this.selectedProjectileObjectTypeProperty = new Property( defaultProjectileObjectType, {
      tandem: tandem.createTandem( 'selectedProjectileObjectTypeProperty' ),
      phetioDocumentation: 'The currently selected projectile object type',
      phetioValueType: ReferenceIO( ProjectileObjectType.ProjectileObjectTypeIO ),
      validValues: possibleObjectTypes
    } );

    this.gravityProperty = new NumberProperty( PhysicalConstants.GRAVITY_ON_EARTH, {
      tandem: tandem.createTandem( 'gravityProperty' ),
      phetioDocumentation: 'Acceleration due to gravity',
      units: 'm/s^2'
    } );

    this.altitudeProperty = new NumberProperty( 0, {
      tandem: options.phetioInstrumentAltitudeProperty ? tandem.createTandem( 'altitudeProperty' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'Altitude of the environment',
      range: ProjectileMotionConstants.ALTITUDE_RANGE,
      units: 'm'
    } );

    this.airResistanceOnProperty = new BooleanProperty( defaultAirResistanceOn, {
      tandem: tandem.createTandem( 'airResistanceOnProperty' ),
      phetioDocumentation: 'Whether air resistance is on'
    } );

    this.airDensityProperty = new DerivedProperty( [ this.altitudeProperty, this.airResistanceOnProperty ], calculateAirDensity, {
      tandem: tandem.createTandem( 'airDensityProperty' ),
      units: 'kg/m^3',
      phetioDocumentation:
        'air density, depends on altitude and whether air resistance is on',
      phetioValueType: NumberIO
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      tandem: tandem.createTandem( 'timeSpeedProperty' ),
      phetioDocumentation: 'Speed of animation, either normal or slow.'
    } );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: 'whether animation is playing (as opposed to paused)'
    } );

    this.davidHeight = 2; // meters
    this.davidPosition = new Vector2( 7, 0 ); // meters

    this.numberOfMovingProjectilesProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'numberOfMovingProjectilesProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'number of projectiles that are still moving'
    } );

    this.rapidFireModeProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'rapidFireModeProperty' ),
      phetioDocumentation: 'Is the stats screen in rapid-fire mode?'
    } );

    this.fireEnabledProperty = new DerivedProperty( [ this.numberOfMovingProjectilesProperty, this.rapidFireModeProperty ],
      ( numMoving, rapidFireMode ) =>
        !rapidFireMode && numMoving < this.maxProjectiles, {
        tandem: tandem.createTandem( 'fireEnabledProperty' ),
        phetioDocumentation: `The fire button is only enabled if there are less than ${this.maxProjectiles} projectiles in the air.`,
        phetioValueType: BooleanIO
      } );

    this.updateTrajectoryRanksEmitter = new Emitter();

    this.eventTimer = new EventTimer(
      new EventTimer.ConstantEventModel( 1000 / TIME_PER_DATA_POINT ),
      this.stepModelElements.bind( this, TIME_PER_DATA_POINT / 1000 )
    );

    this.muzzleFlashStepper = new Emitter( {
      parameters: [ { valueType: 'number' } ]
    } );

    this.zoomProperty = new NumberProperty( DEFAULT_ZOOM, {
      tandem: tandem.createTandem( 'zoomProperty' ),
      range: new Range( MIN_ZOOM, MAX_ZOOM ),
      phetioDocumentation: 'Used to adjust to visual zoom for this screen. Each new zoom level increases the value by a factor of 2.',
      phetioReadOnly: true
    } );

    // Create this after model properties to support the PhetioGroup creating the prototype immediately
    this.trajectoryGroup = Trajectory.createGroup( this, tandem.createTandem( 'trajectoryGroup' ) );

    this.dataProbe = new DataProbe( this.trajectoryGroup, 10, 10, this.zoomProperty, tandem.createTandem( 'dataProbe' ) ); // position arbitrary

    // Links in this constructor last for the lifetime of the sim, so no need to dispose

    // if any of the global Properties change, update the status of moving projectiles
    this.airDensityProperty.link( () => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.markMovingTrajectoriesChangedMidAir();
      }
    } );
    this.gravityProperty.link( () => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.markMovingTrajectoriesChangedMidAir();
      }
    } );
    this.selectedProjectileObjectTypeProperty.link(
      selectedProjectileObjectType => {
        if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
          this.setProjectileParameters( selectedProjectileObjectType );
        }
      }
    );
  }

  public reset(): void {
    // disposes all trajectories and resets number of moving projectiles Property
    this.eraseTrajectories();

    this.target.reset();
    this.measuringTape.reset();
    this.dataProbe.reset();
    this.zoomProperty.reset();
    this.cannonHeightProperty.reset();
    this.cannonAngleProperty.reset();
    this.initialAngleStandardDeviationProperty.reset();
    this.initialSpeedProperty.reset();
    this.initialSpeedStandardDeviationProperty.reset();
    this.selectedProjectileObjectTypeProperty.reset();
    this.projectileMassProperty.reset();
    this.projectileDiameterProperty.reset();
    this.projectileDragCoefficientProperty.reset();
    this.gravityProperty.reset();
    this.altitudeProperty.reset();
    this.airResistanceOnProperty.reset();
    this.timeSpeedProperty.reset();
    this.isPlayingProperty.reset();
    this.rapidFireModeProperty.reset();

    this.muzzleFlashStepper.emit( 0 );
  }

  public step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      this.eventTimer.step( ( this.timeSpeedProperty.value === TimeSpeed.SLOW ? 0.33 : 1 ) * dt );
    }
  }

  // Steps model elements given a time step, used by the step button
  public stepModelElements( dt: number ): void {
    for ( let i = 0; i < this.trajectoryGroup.count; i++ ) {
      const trajectory = this.trajectoryGroup.getElement( i );
      if ( !trajectory.reachedGround ) {
        trajectory.step( dt );
      }
    }
    this.muzzleFlashStepper.emit( dt );
  }

  // Remove and dispose old trajectories that are over the limit from the observable array
  public limitTrajectories(): void {
    // create a temporary array to hold all trajectories to be disposed, to avoid array mutation of trajectoryGroup while looping
    const trajectoriesToDispose = [];
    const numTrajectoriesToDispose = this.trajectoryGroup.count - this.maxProjectiles;
    if ( numTrajectoriesToDispose > 0 ) {
      for ( let i = 0; i < this.trajectoryGroup.count; i++ ) {
        const trajectory = this.trajectoryGroup.getElement( i );
        if ( trajectory.reachedGround ) {
          trajectoriesToDispose.push( trajectory );
          if ( trajectoriesToDispose.length >= numTrajectoriesToDispose ) {
            break;
          }
        }
      }
      trajectoriesToDispose.forEach( t => this.trajectoryGroup.disposeElement( t ) );
    }
  }

  // Removes all trajectories and resets corresponding Properties
  public eraseTrajectories(): void {
    this.trajectoryGroup.clear();
    this.numberOfMovingProjectilesProperty.reset();
  }

  /**
   * @param numProjectiles - the number of simultaneous projectiles to fire
   */
  public fireNumProjectiles( numProjectiles: number ): void {
    for ( let i = 0; i < numProjectiles; i++ ) {
      const initialSpeed = this.initialSpeedProperty.getRandomizedValue();
      const initialAngle = this.cannonAngleProperty.getRandomizedValue();

      this.trajectoryGroup.createNextElement( this.selectedProjectileObjectTypeProperty.value,
        this.projectileMassProperty.value,
        this.projectileDiameterProperty.value,
        this.projectileDragCoefficientProperty.value,
        initialSpeed,
        this.cannonHeightProperty.value,
        initialAngle );

      this.updateTrajectoryRanksEmitter.emit(); // increment rank of all trajectories
    }

    this.limitTrajectories();
  }

  // Set changedInMidAir to true for trajectories with currently moving projectiles
  private markMovingTrajectoriesChangedMidAir(): void {
    let trajectory;
    for ( let j = 0; j < this.trajectoryGroup.count; j++ ) {
      trajectory = this.trajectoryGroup.getElement( j );

      // Trajectory has not reached ground
      if ( !trajectory.changedInMidAir && !trajectory.reachedGround ) {
        trajectory.changedInMidAir = true;
      }
    }
  }

  /**
   * Set mass, diameter, and drag coefficient based on the currently selected projectile object type
   * @param selectedProjectileObjectType - contains information such as mass, diameter, etc.
   */
  private setProjectileParameters( selectedProjectileObjectType: ProjectileObjectType ): void {
    this.projectileMassProperty.set( selectedProjectileObjectType.mass );
    this.projectileDiameterProperty.set( selectedProjectileObjectType.diameter );
    this.projectileDragCoefficientProperty.set( selectedProjectileObjectType.dragCoefficient );
  }
}

/**
 * @param altitude - in meters
 * @param airResistanceOn - if off, zero air density
 */
const calculateAirDensity = ( altitude: number, airResistanceOn: boolean ): number => {
  // Atmospheric model algorithm is taken from https://www.grc.nasa.gov/www/k-12/airplane/atmosmet.html
  // Checked the values at http://www.engineeringtoolbox.com/standard-atmosphere-d_604.html

  if ( airResistanceOn ) {
    let temperature;
    let pressure;

    // The sim doesn't go beyond 5000, rendering the elses unnecessary, but keeping if others would like to
    // increase the altitude range.

    if ( altitude < 11000 ) {
      // troposphere
      temperature = 15.04 - 0.00649 * altitude;
      pressure = 101.29 * Math.pow( ( temperature + 273.1 ) / 288.08, 5.256 );
    }
    else if ( altitude < 25000 ) {
      // lower stratosphere
      temperature = -56.46;
      pressure = 22.65 * Math.exp( 1.73 - 0.000157 * altitude );
    }
    else {
      // upper stratosphere (altitude >= 25000 meters)
      temperature = -131.21 + 0.00299 * altitude;
      pressure = 2.488 * Math.pow( ( temperature + 273.1 ) / 216.6, -11.388 );
    }

    return pressure / ( 0.2869 * ( temperature + 273.1 ) );
  }
  else {
    return 0;
  }
};

projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

export default ProjectileMotionModel;
