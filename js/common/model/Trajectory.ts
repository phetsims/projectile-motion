// Copyright 2016-2023, University of Colorado Boulder

/**
 * Model of a trajectory.
 * One trajectory can have multiple projectiles on its path.
 * Air resistance and altitude can immediately change the path of the projectiles in the air.
 * Velocity, angle, mass, diameter, dragcoefficient only affect the next projectile fired.
 * Units are meters, kilograms, and seconds (mks)
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import projectileMotion from '../../projectileMotion.js';
import DataPoint, { DataPointStateObject } from './DataPoint.js';
import DataProbe from './DataProbe.js';
import ProjectileObjectType from './ProjectileObjectType.js';
import ProjectileMotionModel from './ProjectileMotionModel.js';
import { CompositeSchema } from '../../../../tandem/js/types/StateSchema.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type TrajectoryOptions = {
  tandem?: Tandem;
  phetioDynamicElement?: boolean;
  phetioType?: IOType;
};

type LandedEmitterParams = {
  name?: string;
  phetioType?: IOType;
};

type TrajectoryStateObject = {
  mass: number;
  diameter: number;
  dragCoefficient: number;
  changedInMidAir: boolean;
  reachedGround: boolean;
  apexPoint: DataPointStateObject | null;
  maxHeight: number;
  horizontalDisplacement: number;
  flightTime: number;
  hasHitTarget: boolean;
  projectileObjectType: ReferenceIOState;
  initialSpeed: number;
  initialHeight: number;
  initialAngle: number;
};

export type TrajectoryGroupCreateElementArguments = [ ProjectileObjectType, number, number, number, number, number, number ];

class Trajectory extends PhetioObject {
  public readonly projectileObjectType: ProjectileObjectType; // the type of projectile being launched
  private readonly mass: number; // mass of projectiles in kilograms
  public readonly diameter: number; // diameter of projectiles in meters
  public readonly dragCoefficient: number; // drag coefficient of the projectiles
  private readonly initialSpeed: number; // launch speed of the projectiles
  private readonly initialHeight: number; // initial height of the projectiles
  private readonly initialAngle: number; // cannon launch angle
  private readonly gravityProperty: Property<number>; // world gravity
  private readonly airDensityProperty: TReadOnlyProperty<number>; // air density
  private numberOfMovingProjectilesProperty: Property<number>; // the number of projectiles that are currently in flight
  private readonly updateTrajectoryRanksEmitter: Emitter; // emitter to update the ranks of the trajectories
  public apexPoint: DataPoint | null; // contains reference to the apex point, or null if apex point doesn't exist/has been recorded
  private maxHeight: number; // the maximum height reached by the projectile
  private horizontalDisplacement: number; // the horizontal displacement of the projectile from its launch point
  private flightTime: number; // the horizontal displacement of the projectile from its launch point
  private checkIfHitTarget: ( positionX: number ) => boolean; // the callback from the common Target to check and return if the projectile hit the target
  public hasHitTarget: boolean; // whether the projectile has hit the target
  private getDataProbe: () => DataProbe | null; // accessor for DataProbe component
  public rankProperty: Property<number>;
  public changedInMidAir: boolean;
  public readonly dataPoints: ObservableArray<DataPoint>;
  public reachedGround: boolean;
  public projectileDataPointProperty: Property<DataPoint>;
  private trajectoryLandedEmitter: Emitter<LandedEmitterParams[]>;
  private disposeTrajectory: () => void;

  public constructor( projectileObjectType: ProjectileObjectType,
                      projectileMass: number,
                      projectileDiameter: number,
                      projectileDragCoefficient: number,
                      initialSpeed: number,
                      initialHeight: number,
                      initialAngle: number,
                      airDensityProperty: TReadOnlyProperty<number>,
                      gravityProperty: Property<number>,
                      updateTrajectoryRanksEmitter: Emitter,
                      numberOfMovingProjectilesProperty: Property<number>,
                      checkIfHitTarget: ( positionX: number ) => boolean,
                      getDataProbe: () => DataProbe | null,
                      providedOptions?: TrajectoryOptions ) {

    const options = optionize<TrajectoryOptions>()( {
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true,
      phetioType: Trajectory.TrajectoryIO
    }, providedOptions );

    super( options );

    this.projectileObjectType = projectileObjectType;
    this.mass = projectileMass;
    this.diameter = projectileDiameter;
    this.dragCoefficient = projectileDragCoefficient;
    this.initialSpeed = initialSpeed;
    this.initialHeight = initialHeight;
    this.initialAngle = initialAngle;
    this.gravityProperty = gravityProperty;
    this.airDensityProperty = airDensityProperty;
    this.numberOfMovingProjectilesProperty = numberOfMovingProjectilesProperty;
    this.numberOfMovingProjectilesProperty.value++;
    this.updateTrajectoryRanksEmitter = updateTrajectoryRanksEmitter;
    this.apexPoint = null;
    this.maxHeight = this.initialHeight;
    this.horizontalDisplacement = 0;
    this.flightTime = 0;
    this.checkIfHitTarget = checkIfHitTarget;
    this.hasHitTarget = false;
    this.getDataProbe = getDataProbe;

    this.rankProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'rankProperty' ),
      phetioDocumentation: `${'The count of how old this projectile trajectory is. Older trajectories have more ' +
                              'opacity until they are subsequently removed. The most recent trajectory fired has rank 0. ' +
                              'The second most recent has rank 1.'}`,
      phetioReadOnly: true
    } );

    // did the trajectory path change in midair due to air density change
    this.changedInMidAir = false;

    // record points along the trajectory with critical information
    this.dataPoints = createObservableArray( {
      phetioType: createObservableArray.ObservableArrayIO( DataPoint.DataPointIO ),
      tandem: options.tandem.createTandem( 'dataPoints' ),
      phetioDocumentation: 'An ordered list of all data points taken on this trajectory. The earliest data point ' +
                           'will be first'
    } );

    // set by TrajectoryIO.js
    this.reachedGround = false;

    // Add one to the rank
    const incrementRank = () => this.rankProperty.value++;

    // Listen to whether this rank should be incremented
    this.updateTrajectoryRanksEmitter.addListener( incrementRank );

    // Set the initial velocity based on the initial speed and angle
    const velocity = Vector2.pool.fetch().setPolar( this.initialSpeed, ( this.initialAngle * Math.PI ) / 180 );

    const dragForce = this.dragForceForVelocity( velocity );
    const acceleration = this.accelerationForDragForce( dragForce );

    const initialPoint = new DataPoint( 0, Vector2.pool.create( 0, this.initialHeight ), this.airDensityProperty.value,
      velocity, acceleration, dragForce, this.gravityForce() );

    this.addDataPoint( initialPoint );

    // The "projectile object" is really just what data point the projectile is currently at.
    this.projectileDataPointProperty = new Property( initialPoint, { phetioValueType: DataPoint.DataPointIO } );

    this.trajectoryLandedEmitter = new Emitter( {
      tandem: options.tandem.createTandem( 'trajectoryLandedEmitter' ),
      parameters: [ { name: 'trajectory', phetioType: Trajectory.TrajectoryIO } ]
    } );

    this.dataPoints.elementAddedEmitter.addListener( addedDataPoint => {
      this.maxHeight = Math.max( addedDataPoint.position.y, this.maxHeight );
      this.horizontalDisplacement = addedDataPoint.position.x;
      this.flightTime = addedDataPoint.time;

      if ( addedDataPoint.reachedGround ) {
        this.trajectoryLandedEmitter.emit( this );
      }
    } );

    this.disposeTrajectory = () => {
      this.apexPoint = null; // remove reference
      this.dataPoints.dispose();
      this.trajectoryLandedEmitter.dispose();
      this.rankProperty.dispose();
      this.updateTrajectoryRanksEmitter.removeListener( incrementRank );
    };
  }

  private gravityForce(): number {
    return -this.gravityProperty.value * this.mass;
  }

  /**
   * @param dragForce - the drag force on the projectile
   */
  private accelerationForDragForce( dragForce: Vector2 ): Vector2 {
    return Vector2.pool.fetch().setXY( -dragForce.x / this.mass, -this.gravityProperty.value - dragForce.y / this.mass );
  }

  /**
   * @param velocity - the velocity of the projectile
   */
  private dragForceForVelocity( velocity: Vector2 ): Vector2 {
    // cross-sectional area of the projectile
    const area = ( Math.PI * this.diameter * this.diameter ) / 4;
    return Vector2.pool.fetch().set( velocity ).multiplyScalar(
      0.5 * this.airDensityProperty.value * area * this.dragCoefficient * velocity.magnitude
    );
  }

  public step( dt: number ): void {
    assert && assert( !this.reachedGround, 'Trajectories should not step after reaching ground' );

    const previousPoint = this.dataPoints.get( this.dataPoints.length - 1 );

    let newY = nextPosition( previousPoint.position.y, previousPoint.velocity.y, previousPoint.acceleration.y, dt );

    if ( newY <= 0 ) {
      newY = 0;
      this.reachedGround = true;
    }

    const cappedDeltaTime = this.reachedGround ? timeToGround( previousPoint ) : dt;

    let newX = nextPosition( previousPoint.position.x, previousPoint.velocity.x, previousPoint.acceleration.x, cappedDeltaTime );
    let newVx = previousPoint.velocity.x + previousPoint.acceleration.x * cappedDeltaTime;
    const newVy = previousPoint.velocity.y + previousPoint.acceleration.y * cappedDeltaTime;

    // if drag force reverses the x-velocity in this step, set vx to zero to better approximate reality
    // We do not need to do this adjustment for the y direction because gravity is already resulting in a change in
    // direction, and because our air-resistance model is not 100% accurate already (via linear interpolation).
    if ( Math.sign( newVx ) !== Math.sign( previousPoint.velocity.x ) ) {
      const deltaTimeForLargeDragForceX = -1 * previousPoint.velocity.x / previousPoint.acceleration.x;
      newX = nextPosition( previousPoint.position.x, previousPoint.velocity.x, previousPoint.acceleration.x, deltaTimeForLargeDragForceX );
      newVx = 0;
    }

    const newPosition = Vector2.pool.fetch().setXY( newX, newY );
    const newVelocity = Vector2.pool.fetch().setXY( newVx, newVy );
    const newDragForce = this.dragForceForVelocity( newVelocity );
    const newAcceleration = this.accelerationForDragForce( newDragForce );

    //if the apex has been reached
    if ( previousPoint.velocity.y > 0 && newVelocity.y < 0 ) {
      this.handleApex( previousPoint );
    }

    const newPoint = new DataPoint( previousPoint.time + cappedDeltaTime, newPosition, this.airDensityProperty.value,
      newVelocity, newAcceleration, newDragForce, this.gravityForce(), { reachedGround: this.reachedGround }
    );

    this.addDataPoint( newPoint );
    this.projectileDataPointProperty.set( newPoint );

    // make sure the data point is created before calling handleLanded and notifying any listeners
    this.reachedGround && this.handleLanded();
  }

  private handleLanded(): void {
    this.trajectoryLandedEmitter.emit( this );
    this.numberOfMovingProjectilesProperty.value--;
    const displacement = this.projectileDataPointProperty.get().position.x;

    // checkIfHitTarget calls back to the target in the common model, where the checking takes place
    this.hasHitTarget = this.checkIfHitTarget( displacement );
  }

  private handleApex( previousPoint: DataPoint ): void {
    // These are all approximations if there is air resistance
    const dtToApex = Math.abs( previousPoint.velocity.y / previousPoint.acceleration.y );
    const apexX = nextPosition( previousPoint.position.x, previousPoint.velocity.x, previousPoint.acceleration.x, dtToApex );
    const apexY = nextPosition( previousPoint.position.y, previousPoint.velocity.y, previousPoint.acceleration.y, dtToApex );

    const apexVelocityX = previousPoint.velocity.x + previousPoint.acceleration.x * dtToApex;
    const apexVelocityY = 0; // by definition this is what makes it the apex
    const apexVelocity = Vector2.pool.fetch().setXY( apexVelocityX, apexVelocityY );

    const apexDragForce = this.dragForceForVelocity( apexVelocity );
    const apexAcceleration = this.accelerationForDragForce( apexDragForce );

    const apexPoint = new DataPoint( previousPoint.time + dtToApex, Vector2.pool.fetch().setXY( apexX, apexY ),
      this.airDensityProperty.value, apexVelocity, apexAcceleration, apexDragForce, this.gravityForce(),
      { apex: true }
    );

    assert && assert( this.apexPoint === null, 'already have an apex point' );
    this.apexPoint = apexPoint; // save apex point
    this.addDataPoint( apexPoint );
  }

  private addDataPoint( dataPoint: DataPoint ): void {
    this.dataPoints.push( dataPoint );

    // update data probe if apex point is within range
    this.getDataProbe() && this.getDataProbe()?.updateDataIfWithinRange( dataPoint );
  }

  /**
   * Finds the dataPoint in this trajectory with the least euclidian distance to coordinates given,
   * or returns null if this trajectory has no datapoints
   * @param x - coordinate in model
   * @param y - coordinate in model
   */
  public getNearestPoint( x: number, y: number ): DataPoint | null {
    if ( this.dataPoints.length === 0 ) {
      return null;
    }

    // First, set the nearest point and corresponding distance to the first datapoint.
    let nearestPoint = this.dataPoints.get( 0 );
    let minDistance = nearestPoint.position.distanceXY( x, y );

    // Search through datapoints for the smallest distance. If there are two datapoints with equal distance, the one
    // with more time is chosen.
    for ( let i = 0; i < this.dataPoints.length; i++ ) {
      const currentPoint = this.dataPoints.get( i );
      const currentDistance = currentPoint.position.distanceXY( x, y );

      if ( currentDistance <= minDistance ) {
        nearestPoint = currentPoint;
        minDistance = currentDistance;
      }
    }
    return nearestPoint;
  }

  /**
   * Create a PhetioGroup for the trajectories
   * @param model
   * @param tandem
   */
  public static createGroup( model: ProjectileMotionModel, tandem: Tandem ): PhetioGroup<Trajectory, TrajectoryGroupCreateElementArguments> {
    const checkIfHitTarget = model.target.checkIfHitTarget.bind( model.target );

    return new PhetioGroup<Trajectory, TrajectoryGroupCreateElementArguments>(
      ( tandem, projectileObjectType, projectileMass, projectileDiameter, projectileDragCoefficient,
        initialSpeed, initialHeight, initialAngle ) => {
        return new Trajectory( projectileObjectType, projectileMass, projectileDiameter, projectileDragCoefficient,
          initialSpeed, initialHeight, initialAngle, model.airDensityProperty, model.gravityProperty,
          model.updateTrajectoryRanksEmitter, model.numberOfMovingProjectilesProperty, checkIfHitTarget,
          () => {
            return model.dataProbe;
          },
          { tandem: tandem } );
      },
      [ model.selectedProjectileObjectTypeProperty.value,
        model.projectileMassProperty.value, model.projectileDiameterProperty.value,
        model.projectileDragCoefficientProperty.value, model.initialSpeedProperty.value,
        model.cannonHeightProperty.value, model.cannonAngleProperty.value ],
      {
        tandem: tandem,
        phetioType: PhetioGroup.PhetioGroupIO( Trajectory.TrajectoryIO ),
        phetioDocumentation: 'The container for any trajectory that is created when a projectile is fired.'
      }
    );
  }

  /**
   * Dispose this Trajectory, for memory management
   */
  public override dispose(): void {
    this.disposeTrajectory();
    super.dispose();
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType for details.
   */
  public static get STATE_SCHEMA(): CompositeSchema {
    return {
      mass: NumberIO,
      diameter: NumberIO,
      dragCoefficient: NumberIO,
      changedInMidAir: BooleanIO,
      reachedGround: BooleanIO,
      apexPoint: NullableIO( DataPoint.DataPointIO ),
      maxHeight: NumberIO,
      horizontalDisplacement: NumberIO,
      flightTime: NumberIO,
      hasHitTarget: BooleanIO,
      projectileObjectType: ReferenceIO(
        ProjectileObjectType.ProjectileObjectTypeIO
      ),
      initialSpeed: NumberIO,
      initialHeight: NumberIO,
      initialAngle: NumberIO
    };
  }

  /**
   * @returns map from state object to parameters being passed to createNextElement
   */
  public static stateObjectToCreateElementArguments( stateObject: TrajectoryStateObject ): TrajectoryGroupCreateElementArguments {
    return [
      ReferenceIO( ProjectileObjectType.ProjectileObjectTypeIO ).fromStateObject( stateObject.projectileObjectType ),
      stateObject.mass,
      stateObject.diameter,
      stateObject.dragCoefficient,
      stateObject.initialSpeed,
      stateObject.initialHeight,
      stateObject.initialAngle
    ];
  }

  // Name the types needed to serialize each field on the Trajectory so that it can be used in toStateObject, fromStateObject, and applyState.
  public static readonly TrajectoryIO = new IOType( 'TrajectoryIO', {
    valueType: Trajectory,

    documentation: 'A trajectory outlining the projectile\'s path. The following are passed into the state schema:' +
                   '<ul>' +
                   '<li>mass: the mass of the projectile' +
                   '<li>diameter: the diameter of the projectile' +
                   '<li>dragCoefficient: the drag coefficient of the projectile' +
                   '<li>initialSpeed: the initial speed of the projectile' +
                   '<li>initialHeight: the initial height of the projectile' +
                   '<li>initialAngle: the initial angle of the projectile' +
                   '</ul>',
    stateSchema: Trajectory.STATE_SCHEMA,
    stateObjectToCreateElementArguments: s => Trajectory.stateObjectToCreateElementArguments( s )
  } );
}

// Calculate the next 1-d position using the basic kinematic function.
const nextPosition = ( position: number, velocity: number, acceleration: number, time: number ) => {
  return position + velocity * time + 0.5 * acceleration * time * time;
};

const timeToGround = ( previousPoint: DataPoint ): number => {
  if ( previousPoint.acceleration.y === 0 ) {
    if ( previousPoint.velocity.y === 0 ) {
      assert && assert( false, 'How did newY reach <=0 if there was no velocity.y?' );
      return 0;
    }
    else {
      return -previousPoint.position.y / previousPoint.velocity.y;
    }
  }
  else {
    const squareRoot = -Math.sqrt( previousPoint.velocity.y * previousPoint.velocity.y -
                                   2 * previousPoint.acceleration.y * previousPoint.position.y );
    return ( squareRoot - previousPoint.velocity.y ) / previousPoint.acceleration.y;
  }
};

projectileMotion.register( 'Trajectory', Trajectory );
export default Trajectory;
