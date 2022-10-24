// Copyright 2016-2022, University of Colorado Boulder

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
import VarianceNumberProperty from '../../../../axon/js/VarianceNumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import EventTimer from '../../../../phet-core/js/EventTimer.js';
import merge from '../../../../phet-core/js/merge.js';
import PhysicalConstants from '../../../../phet-core/js/PhysicalConstants.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
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
import Trajectory from './Trajectory.js';

// constants
const MIN_ZOOM = ProjectileMotionConstants.MIN_ZOOM;
const MAX_ZOOM = ProjectileMotionConstants.MAX_ZOOM;
const DEFAULT_ZOOM = ProjectileMotionConstants.DEFAULT_ZOOM;

const TIME_PER_DATA_POINT = ProjectileMotionConstants.TIME_PER_DATA_POINT; // ms

class ProjectileMotionModel {
  /**
   * @param {ProjectileObjectType} defaultProjectileObjectType -  default object type for the each model
   * @param {boolean} defaultAirResistance -  default air resistance on value
   * @param {ProjectileObjectType[]} possibleObjectTypes - a list of the possible ProjectileObjectTypes for the model
   * @param {Tandem} tandem
   * @param options
   */
  constructor(
    defaultProjectileObjectType,
    defaultAirResistance,
    possibleObjectTypes,
    tandem,
    options
  ) {
    options = merge(
      {
        defaultCannonHeight: 0,
        defaultCannonAngle: 80,
        defaultInitialSpeed: 18,
        phetioInstrumentAltitudeProperty: true,
        statsScreen: false
      },
      options
    );

    assert && assert( defaultProjectileObjectType instanceof ProjectileObjectType,
      'defaultProjectileObjectType should be a ProjectileObjectType' );

    // @public {Target} model for handling scoring ( if/when projectile hits target )
    this.target = new Target(
      ProjectileMotionConstants.TARGET_X_DEFAULT,
      tandem.createTandem( 'target' )
    );

    // @public {ProjectileMotionMeasuringTape} model for measuring tape
    this.measuringTape = new ProjectileMotionMeasuringTape(
      tandem.createTandem( 'measuringTape' )
    );

    // --initial values

    // @public {Property.<number>}
    this.cannonHeightProperty = new NumberProperty(
      options.defaultCannonHeight,
      {
        tandem: tandem.createTandem( 'cannonHeightProperty' ),
        phetioDocumentation: 'Height of the cannon',
        units: 'm',
        range: ProjectileMotionConstants.CANNON_HEIGHT_RANGE
      }
    );

    const initialAngleStandardDeviation = options.statsScreen ? 2 : 0;

    // @public {Property.<number>}
    this.initialAngleStandardDeviationProperty = new NumberProperty( initialAngleStandardDeviation, {
      tandem: tandem.createTandem( 'initialAngleStandardDeviationProperty' ),
      phetioDocumentation: 'The standard deviation of the launch angle',
      units: '\u00B0', // degrees
      range: new Range( 0, 30 )
    } );

    // @public {Property.<number>}
    this.cannonAngleProperty = new VarianceNumberProperty(
      options.defaultCannonAngle, value => {
        return StatUtils.randomFromNormal( value, this.initialAngleStandardDeviationProperty.value );
      },
      {
        tandem: tandem.createTandem( 'cannonAngleProperty' ),
        phetioDocumentation: 'Angle of the cannon',
        units: '\u00B0', // degrees
        range: ProjectileMotionConstants.CANNON_ANGLE_RANGE
      }
    );

    const initialSpeedStandardDeviation = options.statsScreen ? 2 : 0;

    // @public {Property.<number>}
    this.initialSpeedStandardDeviationProperty = new NumberProperty( initialSpeedStandardDeviation, {
      tandem: tandem.createTandem( 'initialSpeedStandardDeviationProperty' ),
      phetioDocumentation: 'The standard deviation of the launch speed',
      units: 'm/s',
      range: new Range( 0, 10 )
    } );

    // @public {Property.<number>}
    this.initialSpeedProperty = new VarianceNumberProperty(
      options.defaultInitialSpeed, value => {
        return StatUtils.randomFromNormal( value, this.initialSpeedStandardDeviationProperty.value );
      },
      {
        tandem: tandem.createTandem( 'initialSpeedProperty' ),
        phetioDocumentation: 'The speed on launch',
        units: 'm/s',
        range: ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE
      }
    );

    // --parameters for next projectile fired

    // @public {Property.<number>}
    this.projectileMassProperty = new NumberProperty(
      defaultProjectileObjectType.mass,
      {
        tandem: tandem.createTandem( 'projectileMassProperty' ),
        phetioDocumentation: 'Mass of the projectile',
        units: 'kg',
        range: ProjectileMotionConstants.PROJECTILE_MASS_RANGE
      }
    );

    // @public {Property.<number>}
    this.projectileDiameterProperty = new NumberProperty(
      defaultProjectileObjectType.diameter,
      {
        tandem: tandem.createTandem( 'projectileDiameterProperty' ),
        phetioDocumentation: 'Diameter of the projectile',
        units: 'm',
        range: ProjectileMotionConstants.PROJECTILE_DIAMETER_RANGE
      }
    );

    // @public {Property.<number>}
    this.projectileDragCoefficientProperty = new NumberProperty(
      defaultProjectileObjectType.dragCoefficient,
      {
        tandem: tandem.createTandem( 'projectileDragCoefficientProperty' ),
        phetioDocumentation:
          'Drag coefficient of the projectile, unitless as it is a coefficient',
        range: ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE
      }
    );

    // @public {Property.<ProjectileObjectType>}
    this.selectedProjectileObjectTypeProperty = new Property(
      defaultProjectileObjectType,
      {
        tandem: tandem.createTandem( 'selectedProjectileObjectTypeProperty' ),
        phetioDocumentation: 'The currently selected projectile object type',
        phetioValueType: ReferenceIO( ProjectileObjectType.ProjectileObjectTypeIO ),
        validValues: possibleObjectTypes
      }
    );

    // --Properties that change the environment and affect all projectiles, called global

    // @public
    this.gravityProperty = new NumberProperty(
      PhysicalConstants.GRAVITY_ON_EARTH,
      {
        tandem: tandem.createTandem( 'gravityProperty' ),
        phetioDocumentation: 'Acceleration due to gravity',
        units: 'm/s^2'
      }
    );

    // @public
    this.altitudeProperty = new NumberProperty( 0, {
      tandem: options.phetioInstrumentAltitudeProperty ? tandem.createTandem( 'altitudeProperty' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'Altitude of the environment',
      range: ProjectileMotionConstants.ALTITUDE_RANGE,
      units: 'm'
    } );

    // @public
    this.airResistanceOnProperty = new BooleanProperty( defaultAirResistance, {
      tandem: tandem.createTandem( 'airResistanceOnProperty' ),
      phetioDocumentation: 'Whether air resistance is on'
    } );

    // @public {DerivedProperty.<number>}
    this.airDensityProperty = new DerivedProperty(
      [ this.altitudeProperty, this.airResistanceOnProperty ],
      calculateAirDensity,
      {
        tandem: tandem.createTandem( 'airDensityProperty' ),
        units: 'kg/m^3',
        phetioDocumentation:
          'air density, depends on altitude and whether air resistance is on',
        phetioValueType: NumberIO
      }
    );

    // --animation controls

    // @public {Property.<boolean>}
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      tandem: tandem.createTandem( 'timeSpeedProperty' ),
      phetioDocumentation: 'Speed of animation, either normal or slow.'
    } );

    // @public
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation:
        'whether animation is playing (as opposed to paused)'
    } );

    // @public (read-only)
    this.davidHeight = 2; // meters
    this.davidPosition = new Vector2( 7, 0 ); // meters

    // @public
    this.numberOfMovingProjectilesProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'numberOfMovingProjectilesProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'number of projectiles that are still moving'
    } );

    // @private {Property.<boolean>}
    this.rapidFireModeProperty = new BooleanProperty(
      false,
      {
        tandem: tandem.createTandem( 'rapidFireModeProperty' ),
        phetioDocumentation: 'Is the stats screen in rapid-fire mode?'
      }
    );

    // @public {DerivedProperty.<boolean>}
    this.fireEnabledProperty = new DerivedProperty(
      [ this.numberOfMovingProjectilesProperty, this.rapidFireModeProperty ],
      ( numMoving, rapidFireMode ) =>
        !rapidFireMode && numMoving < ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES,
      {
        tandem: tandem.createTandem( 'fireEnabledProperty' ),
        phetioDocumentation: `The fire button is only enabled if there are less than ${ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES} projectiles in the air.`,
        phetioValueType: BooleanIO
      }
    );

    // @public {Emitter}
    this.updateTrajectoryRanksEmitter = new Emitter();

    // @private {EventTimer}
    this.eventTimer = new EventTimer(
      new EventTimer.ConstantEventModel( 1000 / TIME_PER_DATA_POINT ),
      this.stepModelElements.bind( this, TIME_PER_DATA_POINT / 1000 )
    );

    // @public {Emitter} emits when cannon needs to update its muzzle flash animation
    this.muzzleFlashStepper = new Emitter();

    // zoom Property
    this.zoomProperty = new NumberProperty( DEFAULT_ZOOM, {
      tandem: tandem.createTandem( 'zoomProperty' ),
      range: new Range( MIN_ZOOM, MAX_ZOOM ),
      phetioDocumentation:
        'Used to adjust to visual zoom for this screen. Each new zoom level increases the value by a factor of 2.',
      phetioReadOnly: true
    } );

    // @public {PhetioGroup.<Trajectory>} a group of trajectories, limited to MAX_NUMBER_OF_TRAJECTORIES
    // Create this after model properties to support the PhetioGroup creating the prototype immediately
    this.trajectoryGroup = Trajectory.createGroup( this, tandem.createTandem( 'trajectoryGroup' ) );

    // @public {DataProbe} model for the dataProbe probe
    this.dataProbe = new DataProbe(
      this.trajectoryGroup,
      10,
      10,
      this.zoomProperty,
      tandem.createTandem( 'dataProbe' )
    ); // position arbitrary

    // Links in this constructor last for the lifetime of the sim, so no need to dispose

    // if any of the global Properties change, update the status of moving projectiles
    this.airDensityProperty.link( () => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.updateTrajectoriesWithMovingProjectiles();
      }
    } );
    this.gravityProperty.link( () => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.updateTrajectoriesWithMovingProjectiles();
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

  /**
   * Reset these Properties
   * @public
   * @override
   */
  reset() {
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

    this.muzzleFlashStepper.emit();
  }

  /**
   * Steps the model forward in time using the created eventTimer
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
    if ( this.isPlayingProperty.value ) {
      this.eventTimer.step(
        ( this.timeSpeedProperty.value === TimeSpeed.SLOW ? 0.33 : 1 ) * dt
      );
    }
  }

  /**
   * Steps model elements given a time step, used by the step button
   * @public
   *
   * @param {number} dt
   */
  stepModelElements( dt ) {
    for ( let i = 0; i < this.trajectoryGroup.count; i++ ) {
      this.trajectoryGroup.getElement( i ).step( dt );
    }
    this.muzzleFlashStepper.emit();
  }

  /**
   * Remove and dispose old trajectories that are over the limit from the observable array
   * @public
   */
  limitTrajectories() {
    const trajectoriesToDispose = [];
    const numTrajectoriesToDispose = this.trajectoryGroup.count - ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES;
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

  /**
   * Removes all trajectories and resets corresponding Properties
   * @public
   */
  eraseTrajectories() {
    this.trajectoryGroup.clear();
    this.numberOfMovingProjectilesProperty.reset();
  }

  /**
   * @public
   *
   * @param {number} numProjectiles - the number of simultaneous projectiles to fire
   */
  fireNumProjectiles( numProjectiles ) {
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
      this.numberOfMovingProjectilesProperty.value++;
    }

    this.limitTrajectories();
    this.updateTrajectoryRanksEmitter.emit(); // increment rank of all trajectories
  }

  /**
   * Update trajectories that have moving projectiles
   * @private
   */
  updateTrajectoriesWithMovingProjectiles() {
    let i;
    let trajectory;

    for ( let j = 0; j < this.trajectoryGroup.count; j++ ) {
      trajectory = this.trajectoryGroup.getElement( j );

      const removedProjectileObjects = [];

      const updateTrajectoryForProjectileObject = (
        trajectory,
        projectileObjectIndex
      ) => {
        const projectileObject = trajectory.projectileObjects.get(
          projectileObjectIndex
        );
        removedProjectileObjects.push( projectileObject );
        this.updateTrajectoryRanksEmitter.emit();
        const newTrajectory =
          trajectory.copyFromProjectileObject( this.trajectoryGroup, projectileObject );
        newTrajectory.changedInMidAir = true;
      };

      // Furthest projectile on trajectory has not reached ground
      if ( !trajectory.reachedGround ) {
        // make note that this trajectory has changed in mid air, so it will not be the same as another trajectory
        trajectory.changedInMidAir = true;

        // For each projectile except for the one furthest along the path, create a new trajectory
        for ( i = 1; i < trajectory.projectileObjects.length; i++ ) {
          updateTrajectoryForProjectileObject( trajectory, i );
        }
      }

      // Furthest object on trajectory has reached ground
      else {
        // For each projectile still in the air, create a new trajectory
        for ( i = 0; i < trajectory.projectileObjects.length; i++ ) {
          if (
            !trajectory.projectileObjects.get( i ).dataPointProperty.get()
              .reachedGround
          ) {
            updateTrajectoryForProjectileObject( trajectory, i );
          }
        }
      }

      trajectory.projectileObjects.removeAll( removedProjectileObjects );
    }
    this.limitTrajectories();
  }

  /**
   * Set mass, diameter, and drag coefficient based on the currently selected projectile object type
   * @private
   *
   * @param {ProjectileObjectType} selectedProjectileObjectType - contains information such as mass, diameter, etc.
   */
  setProjectileParameters( selectedProjectileObjectType ) {
    this.projectileMassProperty.set( selectedProjectileObjectType.mass );
    this.projectileDiameterProperty.set( selectedProjectileObjectType.diameter );
    this.projectileDragCoefficientProperty.set(
      selectedProjectileObjectType.dragCoefficient
    );
  }
}

/**
 * @param {number} altitude - in meters
 * @param {boolean} airResistanceOn - if off, zero air density
 * @returns {number} - air density
 */
function

calculateAirDensity( altitude, airResistanceOn ) {
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
}

projectileMotion.register( 'ProjectileMotionModel', ProjectileMotionModel );

export default ProjectileMotionModel;
