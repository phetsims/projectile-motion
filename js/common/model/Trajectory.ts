// Copyright 2016-2022, University of Colorado Boulder

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

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import projectileMotion from '../../projectileMotion.js';
import DataPoint from './DataPoint.js';
import ProjectileObjectType from './ProjectileObjectType.js';

class Trajectory extends PhetioObject {

  /**
   * @param {ProjectileObjectType} projectileObjectType
   * @param {number} projectileMass
   * @param {number} projectileDiameter
   * @param {number} projectileDragCoefficient
   * @param {number} initialSpeed
   * @param {number} initialHeight
   * @param {number} initialAngle
   * @param {NumberProperty} airDensityProperty
   * @param {NumberProperty} gravityProperty
   * @param {Emitter<[]>} updateTrajectoryRanksEmitter
   * @param {NumberProperty} numberOfMovingProjectilesProperty
   * @param {function(number):boolean} checkIfHitTarget
   * @param {function():DataProbe|null} getDataProbe
   * @param {Object} [options]
   */
  constructor( projectileObjectType, projectileMass, projectileDiameter,
               projectileDragCoefficient, initialSpeed, initialHeight, initialAngle,
               airDensityProperty, gravityProperty,
               updateTrajectoryRanksEmitter, numberOfMovingProjectilesProperty,
               checkIfHitTarget, getDataProbe, options ) {
    options = merge(
      {
        tandem: Tandem.REQUIRED,
        phetioDynamicElement: true,
        phetioType: Trajectory.TrajectoryIO
      },
      options
    );

    super( options );

    // @private {ProjectileObjectType} the type of projectile being launched
    this.projectileObjectType = projectileObjectType;

    // @private {number} mass of projectiles in kilograms
    this.mass = projectileMass;

    // @private {number} diameter of projectiles in meters
    this.diameter = projectileDiameter;

    // @private {number} drag coefficient of the projectiles
    this.dragCoefficient = projectileDragCoefficient;

    // @private {number} launch speed of the projectiles
    this.initialSpeed = initialSpeed;

    // @private {number} initial height of the projectiles
    this.initialHeight = initialHeight;

    // @private {number} cannon launch angle
    this.initialAngle = initialAngle;

    // @private {number} world gravity
    this.gravityProperty = gravityProperty;

    // @private {number} air density
    this.airDensityProperty = airDensityProperty;

    // @private {number} the number of projectiles that are currently in flight
    this.numberOfMovingProjectilesProperty = numberOfMovingProjectilesProperty;

    //increment the value of numberOfMovingProjectilesProperty in the model
    this.numberOfMovingProjectilesProperty.value++;

    // @private {Emitter} emitter to update the ranks of the trajectories
    this.updateTrajectoryRanksEmitter = updateTrajectoryRanksEmitter;

    // @public {DataPoint|null} - contains reference to the apex point, or null if apex point doesn't exist/has been recorded
    this.apexPoint = null;

    // @public {number} the maximum height reached by the projectile
    this.maxHeight = this.initialHeight;

    // @public {number} the horizontal displacement of the projectile from its launch point
    this.horizontalDisplacement = 0;

    // @public {number} the horizontal displacement of the projectile from its launch point
    this.flightTime = 0;

    // @private {boolean} the callback from the common Target to check and return if the projectile hit the target
    this.checkIfHitTarget = checkIfHitTarget;

    // @public {boolean} whether the projectile has hit the target
    this.hasHitTarget = false;

    // @private {function():DataProbe|null} accessor for DataProbe component
    this.getDataProbe = getDataProbe;

    // @public {Property.<number>}
    this.rankProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'rankProperty' ),
      phetioDocumentation: `${
        'The count of how old this projectile trajectory is. Older trajectories have more ' +
        'opacity until they are subsequently removed. The most recent trajectory fired has rank 0. ' +
        'The second most recent has rank 1.'
      }`,
      phetioReadOnly: true
    } );

    // @public did the trajectory path change in midair due to air density change
    this.changedInMidAir = false;

    // @public (read-only) {ObservableArrayDef.<DataPoint>} record points along the trajectory with critical information
    this.dataPoints = createObservableArray( {
      phetioType: createObservableArray.ObservableArrayIO(
        DataPoint.DataPointIO
      ),
      tandem: options.tandem.createTandem( 'dataPoints' ),
      phetioDocumentation:
        'An ordered list of all data points taken on this trajectory. The earliest data point ' +
        'will be first'
    } );

    // @public (read-only) set by TrajectoryIO.js
    this.reachedGround = false;

    // Add one to the rank
    const incrementRank = () => {
      this.rankProperty.value++;
    };

    // Listen to whether this rank should be incremented
    this.updateTrajectoryRanksEmitter.addListener( incrementRank );

    // Set the initial velocity based on the initial speed and angle
    const velocity = Vector2.pool
      .fetch()
      .setPolar( this.initialSpeed, ( this.initialAngle * Math.PI ) / 180 );

    const dragForce = this.dragForceForVelocity( velocity );

    const initialPoint = new DataPoint(
      0, // total time elapsed
      Vector2.pool.create( 0, this.initialHeight ), // position
      this.airDensityProperty.value,
      velocity,
      Vector2.pool.create(
        -dragForce.x / this.mass,
        -this.gravityProperty.value - dragForce.y / this.mass
      ), // acceleration
      dragForce, // drag force
      -this.gravityProperty.value * this.mass // force gravity
    );

    this.addDataPoint( initialPoint );

    // The "projectile object" is really just what data point the projectile is currently at.
    this.projectileDataPointProperty = new Property( initialPoint, {
      phetioValueType: DataPoint.DataPointIO
    } );

    this.trajectoryLandedEmitter = new Emitter( {
      tandem: options.tandem.createTandem( 'trajectoryLandedEmitter' ),
      parameters: [
        { name: 'trajectory', phetioType: Trajectory.TrajectoryIO }
      ]
    } );

    // TODO: move this logic into the step(), https://github.com/phetsims/projectile-motion/issues/308
    this.dataPoints.elementAddedEmitter.addListener( addedDataPoint => {
      this.maxHeight = Math.max( addedDataPoint.position.y, this.maxHeight );
      this.horizontalDisplacement = addedDataPoint.position.x;
      this.flightTime = addedDataPoint.time;

      if ( addedDataPoint.reachedGround ) {
        this.trajectoryLandedEmitter.emit( this );
      }
    } );

    // @private
    this.disposeTrajectory = () => {
      this.apexPoint = null; // remove reference
      this.dataPoints.dispose();
      this.trajectoryLandedEmitter.dispose();
      this.rankProperty.dispose();
      this.updateTrajectoryRanksEmitter.removeListener( incrementRank );
    };
  }

  /**
   * @private
   * @param {Vector2} velocity - the velocity of the projectile
   * @returns {Vector2} - the drag force on the projectile
   */
  dragForceForVelocity( velocity ) {
    // cross-sectional area of the projectile
    const area = ( Math.PI * this.diameter * this.diameter ) / 4;
    return Vector2.pool.fetch().set( velocity ).multiplyScalar(
      0.5 * this.airDensityProperty.value * area * this.dragCoefficient * velocity.magnitude
    );
  }

  /**
   * Does calculations and steps the trajectory elements forward given a time step
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
    assert && assert( !this.reachedGround, 'Trajectories should not step after reaching ground' );

    const previousPoint = this.dataPoints.get( this.dataPoints.length - 1 );

    let newX = nextPosition( previousPoint.position.x, previousPoint.velocity.x, previousPoint.acceleration.x, dt );
    const newY = nextPosition( previousPoint.position.y, previousPoint.velocity.y, previousPoint.acceleration.y, dt );

    let newVx = previousPoint.velocity.x + previousPoint.acceleration.x * dt;
    const newVy = previousPoint.velocity.y + previousPoint.acceleration.y * dt;

    // if drag force reverses the x-velocity in this step, set vx to zero to better approximate reality
    // We do not need to do this adjustment for the y direction because gravity is already resulting in a change in
    // direction, and because our air-resistance model cuts corners already (via linear interpolation).
    if ( Math.sign( newVx ) !== Math.sign( previousPoint.velocity.x ) ) {
      newVx = 0;

      const newDt = -1 * previousPoint.velocity.x / previousPoint.acceleration.x;
      newX = nextPosition( previousPoint.position.x, previousPoint.velocity.x, previousPoint.acceleration.x, newDt );
    }

    const newPosition = Vector2.pool.create( newX, newY );
    const newVelocity = Vector2.pool.fetch().setXY( newVx, newVy );
    const newDragForce = this.dragForceForVelocity( newVelocity );

    //if the apex has been reached
    if ( previousPoint.velocity.y > 0 && newVelocity.y < 0 ) {
      this.handleApex( previousPoint, newPosition, newVelocity, newDragForce, dt );
    }

    let newPoint;

    // Still in flight
    if ( newY > 0 ) {
      newPoint = new DataPoint(
        previousPoint.time + dt,
        newPosition,
        this.airDensityProperty.value,
        newVelocity,
        Vector2.pool.create(
          -newDragForce.x / this.mass,
          -this.gravityProperty.value - newDragForce.y / this.mass
        ), // acceleration
        newDragForce,
        -this.gravityProperty.value * this.mass
      );
    }
    else { // Has reached ground or below

      this.reachedGround = true; // store the information that it has reached the ground

      // recalculate by hand, the time it takes for projectile to reach the ground, within the next dt
      let timeToGround = null;
      if ( previousPoint.acceleration.y === 0 ) {
        if ( previousPoint.position.y === 0 ) {
          // We are already on the ground.
          timeToGround = 0;
        }
        else if ( previousPoint.velocity.y === 0 ) {
          assert && assert( false, 'How did newY reach <=0 if there was no velocity.y?' );
        }
        else {
          timeToGround = -previousPoint.position.y / previousPoint.velocity.y;
        }
      }
      else {
        const squareRoot = -Math.sqrt(
          previousPoint.velocity.y * previousPoint.velocity.y -
          2 * previousPoint.acceleration.y * previousPoint.position.y
        );
        timeToGround =
          ( squareRoot - previousPoint.velocity.y ) /
          previousPoint.acceleration.y;
      }

      newX =
        previousPoint.position.x +
        previousPoint.velocity.x * timeToGround +
        0.5 * previousPoint.acceleration.x * timeToGround * timeToGround;

      const newPosition = Vector2.pool.create( newX, 0 );

      const impactVx = previousPoint.velocity.x + previousPoint.acceleration.x * timeToGround;
      const impactVy = previousPoint.velocity.y + previousPoint.acceleration.y * timeToGround;
      const impactVelocity = Vector2.pool.fetch().setXY( impactVx, impactVy );
      const impactDragForce = this.dragForceForVelocity( impactVelocity );

      newPoint = new DataPoint(
        previousPoint.time + timeToGround,
        newPosition,
        this.airDensityProperty.value,
        impactVelocity,
        Vector2.pool.create(
          -impactDragForce.x / this.mass,
          -this.gravityProperty.value - impactDragForce.y / this.mass
        ), // acceleration
        impactDragForce, // drag force
        -this.gravityProperty.value * this.mass, // force gravity
        {
          // add this special property to just the last datapoint collected for a trajectory
          reachedGround: true
        }
      );
    }

    assert && assert( newPoint, 'new data point should be defined' );

    this.addDataPoint( newPoint );

    this.projectileDataPointProperty.set( newPoint );

    if ( this.reachedGround ) {
      this.trajectoryLandedEmitter.emit( this );

      this.numberOfMovingProjectilesProperty.value--;
      const displacement = this.projectileDataPointProperty.get().position.x;

      // checkIfHitTarget calls back to the target in the common model, where the checking takes place
      this.hasHitTarget = this.checkIfHitTarget( displacement );
    }
  }

  /**
   * @private
   * @param {DataPoint} previousPoint
   * @param {Vector2} newPosition
   * @param {Vector2} newVelocity
   * @param {Vector2} newDragForce
   * @param {number} dt
   */
  handleApex( previousPoint, newPosition, newVelocity, newDragForce, dt ) {
    // These are all approximations if there is air resistance
    const dtToApex = Utils.linear( previousPoint.velocity.y, newVelocity.y, 0, dt, 0 );
    const apexX = Utils.linear( 0, dt, previousPoint.position.x, newPosition.x, dtToApex );
    const apexY =
      previousPoint.position.y +
      previousPoint.velocity.y * dtToApex +
      0.5 * previousPoint.acceleration.y * dtToApex * dtToApex;

    const apexVelocityX = Utils.linear( 0, dt, previousPoint.velocity.x, newVelocity.x, dtToApex );
    const apexVelocityY = Utils.linear( 0, dt, previousPoint.velocity.y, newVelocity.y, dtToApex );
    const apexDragX = Utils.linear( 0, dt, previousPoint.dragForce.x, newDragForce.x, dtToApex );
    const apexDragY = Utils.linear( 0, dt, previousPoint.dragForce.y, newDragForce.y, dtToApex );

    const apexPoint = new DataPoint(
      previousPoint.time + dtToApex,
      Vector2.pool.create( apexX, apexY ),
      this.airDensityProperty.value,
      Vector2.pool.create( apexVelocityX, apexVelocityY ), // velocity
      Vector2.pool.create(
        -apexDragX / this.mass,
        -this.gravityProperty.value - apexDragY / this.mass
      ), // acceleration
      Vector2.pool.create( apexDragX, apexDragY ), // drag force
      -this.gravityProperty.value * this.mass, {
        apex: true
      }
    );

    assert && assert( this.apexPoint === null, 'already have an apex point' );
    this.apexPoint = apexPoint; // save apex point
    this.addDataPoint( apexPoint );
  }

  /**
   * @private
   * @param {DataPoint} dataPoint
   */
  addDataPoint( dataPoint ) {
    this.dataPoints.push( dataPoint );

    // update data probe if apex point is within range
    this.getDataProbe() && this.getDataProbe().updateDataIfWithinRange( dataPoint );
  }

  /**
   * Finds the dataPoint in this trajectory with the least euclidian distance to coordinates given,
   * or returns null if this trajectory has no datapoints
   * @public
   *
   * @param {number} x - coordinate in model
   * @param {number} y - coordinate in model
   * @returns {DataPoint|null}
   */
  getNearestPoint( x, y ) {
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
   * @param {ProjectileMotionModel} model
   * @param {Tandem} tandem
   * @public
   */
  static createGroup( model, tandem ) {
    const checkIfHitTarget = model.target.checkIfHitTarget.bind( model.target );
    return new PhetioGroup(
      ( tandem, projectileObjectType, projectileMass, projectileDiameter, projectileDragCoefficient,
        initialSpeed, initialHeight, initialAngle ) => {
        return new Trajectory( projectileObjectType, projectileMass, projectileDiameter, projectileDragCoefficient,
          initialSpeed, initialHeight, initialAngle, model.airDensityProperty, model.gravityProperty,
          model.updateTrajectoryRanksEmitter, model.numberOfMovingProjectilesProperty, checkIfHitTarget,
          () => {
            return model.dataProbe;
          },
          {
            tandem: tandem
          } );
      },
      [ model.selectedProjectileObjectTypeProperty.value,
        model.projectileMassProperty.value, model.projectileDiameterProperty.value,
        model.projectileDragCoefficientProperty.value, model.initialSpeedProperty.value,
        model.cannonHeightProperty.value, model.cannonAngleProperty.value ],
      {
        tandem: tandem,
        phetioType: PhetioGroup.PhetioGroupIO( Trajectory.TrajectoryIO ),
        phetioDocumentation:
          'The container for any trajectory that is created when a projectile is fired.'
      }
    );
  }

  /**
   * Dispose this Trajectory, for memory management
   * @public
   */
  dispose() {
    this.disposeTrajectory();
    super.dispose();
  }

  /**
   * Returns a map of state keys and their associated IOTypes, see IOType for details.
   * @returns {Object.<string,IOType>}
   * @public
   */
  static get STATE_SCHEMA() {
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
   * @returns {Array} - map from state object to parameters being passed to createNextElement
   * @public
   */
  static stateToArgsForConstructor( stateObject ) {
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
}

// Calculate the next 1-d position using the basic kinematic function.
const nextPosition = ( position, velocity, acceleration, time ) => {
  return position + velocity * time + 0.5 * acceleration * time * time;
};

// Name the types needed to serialize each field on the Trajectory so that it can be used in
// toStateObject, fromStateObject, and applyState.
Trajectory.TrajectoryIO = new IOType( 'TrajectoryIO', {
  valueType: Trajectory,

  // TODO: Add explanation about every state key in STATE_SCHEMA (can be html ul), https://github.com/phetsims/phet-io-sim-specific/issues/7
  documentation: 'A trajectory outlining the projectile\'s path',
  stateSchema: Trajectory.STATE_SCHEMA,
  stateToArgsForConstructor: s => Trajectory.stateToArgsForConstructor( s )
} );

projectileMotion.register( 'Trajectory', Trajectory );
export default Trajectory;