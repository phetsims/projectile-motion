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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
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
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import DataPoint from './DataPoint.js';
import ProjectileObject from './ProjectileObject.js';
import ProjectileObjectType from './ProjectileObjectType.js';

// constants
const MAX_NUMBER_OF_TRAJECTORIES =
  ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES;

// TODO: This constant does not need to exist if there is always one projectile per trajectory, https://github.com/phetsims/projectile-motion/issues/291
const MAX_NUMBER_OF_FLYING_PROJECTILES =
  ProjectileMotionConstants.MAX_NUMBER_OF_FLYING_PROJECTILES;

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
   * @param {Target} target
   * @param {function():DataProbe|null} getDataProbe
   * @param {Object} [options]
   */
  constructor( projectileObjectType, projectileMass, projectileDiameter,
               projectileDragCoefficient, initialSpeed, initialHeight, initialAngle,
               airDensityProperty, gravityProperty,
               updateTrajectoryRanksEmitter, numberOfMovingProjectilesProperty, target, getDataProbe, options ) {
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

    // @private {Emitter} emitter to update the ranks of the trajectories
    this.updateTrajectoryRanksEmitter = updateTrajectoryRanksEmitter;

    // @private {Target} the Target component
    this.target = target;

    // @public {DataPoint|null} - contains reference to the apex point, or null if apex point doesn't exist/has been recorded
    this.apexPoint = null;

    // TODO: Add comments https://github.com/phetsims/projectile-motion/issues/291
    this.maxHeight = this.initialHeight;
    this.horizontalDisplacement = 0;
    this.flightTime = 0;
    this.hasHitTarget = false;

    // @private {function():DataProbe|null} accessor for DataProbe component
    this.getDataProbe = getDataProbe;

    // @private local reference to the dataProbe to updateDataIfWithinRange for initial point
    const dataProbe = this.getDataProbe();

    // @public {Property.<number>}
    this.rankProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'rankProperty' ),
      phetioDocumentation: `${
        'The count of how old this projectile trajectory is. Older trajectories have more ' +
        'opacity until they are subsequently removed. The most recent trajectory fired has rank 0. ' +
        'The second most recent has rank 1. The oldest still on screen has rank '
      }${MAX_NUMBER_OF_TRAJECTORIES - 1}`,
      phetioReadOnly: true
    } );

    // @public did the trajectory path change in mid air due to air density change
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

    // fix large drag errors
    if ( velocity.x < 0 ) {
      // velocity.setXY( 0, 0 );
    }

    // cross sectional area of the projectile
    const area = ( Math.PI * this.diameter * this.diameter ) / 4;

    const dragForce = Vector2.pool
      .fetch()
      .set( velocity )
      .multiplyScalar(
        0.5 * this.airDensityProperty.value * area * this.dragCoefficient * velocity.magnitude
      );

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
    this.dataPoints.push( initialPoint );

    // It is not guaranteed that the dataProbe exists
    dataProbe && dataProbe.updateDataIfWithinRange( initialPoint );

    // TODO: Do we need this if there is only one projectile per trajectory? https://github.com/phetsims/projectile-motion/issues/291
    // @public {ObservableArrayDef.<ProjectileObject>}
    this.projectileObjects = createObservableArray( {
      tandem: options.tandem.createTandem( 'projectileObjects' ),
      phetioType: createObservableArray.ObservableArrayIO(
        ProjectileObject.ProjectileObjectIO
      ),
      phetioDocumentation: `A list of the current projectile objects on this trajectory. At most there can only be ${MAX_NUMBER_OF_FLYING_PROJECTILES} projectiles flying on any trajectory at one time.`
    } );

    assert && this.projectileObjects.elementAddedEmitter.addListener( () => {
      assert( this.projectileObjects.length === 1, 'Cannot have more than one projectile per trajectory' );
    } );

    this.trajectoryLandedEmitter = new Emitter( {
      tandem: options.tandem.createTandem( 'trajectoryLandedEmitter' ),
      parameters: [
        { name: 'trajectory', phetioType: Trajectory.TrajectoryIO }
      ]
    } );

    let landed = false;

    // The first ProjectileObject launched on this trajectory will cause data points to be created as it moves. Future
    // Projectiles will reuse these data points.
    this.dataPoints.elementAddedEmitter.addListener( addedDataPoint => {
      this.maxHeight = Math.max( addedDataPoint.position.y, this.maxHeight );
      this.horizontalDisplacement = addedDataPoint.position.x;
      this.flightTime = addedDataPoint.time;

      if ( addedDataPoint.reachedGround ) {
        assert && assert( this.projectileObjects.length > 0, 'there must be a projectile object' );
        assert && assert( !landed, 'a projectile should only land once!' );

        this.hasHitTarget = this.target.isWithinTarget( this.horizontalDisplacement );

        // TODO: Inline this listener into the right spot (when projectile has landed), https://github.com/phetsims/projectile-motion/issues/291
        this.trajectoryLandedEmitter.emit( this );
        landed = true;
      }
    } );

    // add projectile object
    this.addProjectileObject();

    // @private
    this.disposeTrajectory = () => {
      this.apexPoint = null; // remove reference
      this.dataPoints.dispose();
      this.trajectoryLandedEmitter.dispose();
      this.projectileObjects.dispose();
      this.rankProperty.dispose();
      this.updateTrajectoryRanksEmitter.removeListener( incrementRank );
    };
  }

  /**
   * Does calculations and steps the trajectory elements forward given a time step
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
    const previousPoint = this.dataPoints.get( this.dataPoints.length - 1 );

    // Haven't reached ground, so continue collecting datapoints
    if ( !this.reachedGround ) {
      let apexExists = true;

      let newX =
        previousPoint.position.x +
        previousPoint.velocity.x * dt +
        0.5 * previousPoint.acceleration.x * dt * dt;
      let newY =
        previousPoint.position.y +
        previousPoint.velocity.y * dt +
        0.5 * previousPoint.acceleration.y * dt * dt;

      const newVelocity = Vector2.pool
        .fetch()
        .setXY(
          previousPoint.velocity.x + previousPoint.acceleration.x * dt,
          previousPoint.velocity.y + previousPoint.acceleration.y * dt
        );

      // if the drag force is large enough to reverse the sign of vx, set vx to zero
      const vxChangedSign = ( previousPoint.velocity.x >= 0 && newVelocity.x < 0 ) ||
                            ( previousPoint.velocity.x <= 0 && newVelocity.x > 0 );

      if ( vxChangedSign ) {
        newVelocity.setXY( 0, 0 );

        //TODO: Examine this and add comments, https://github.com/phetsims/projectile-motion/issues/286
        const newDt = -1 * previousPoint.velocity.x / previousPoint.acceleration.x;
        newX = previousPoint.position.x + previousPoint.velocity.x * newDt + 0.5 * previousPoint.acceleration.x * newDt * newDt;
        newY = previousPoint.position.y;

        apexExists = false;
      }

      // cross-sectional area of the projectile
      const area = ( Math.PI * this.diameter * this.diameter ) / 4;

      const newDragForce = Vector2.pool
        .fetch()
        .set( newVelocity )
        .multiplyScalar(
          0.5 * this.airDensityProperty.value * area * this.dragCoefficient * newVelocity.magnitude
        );

      if ( previousPoint.velocity.y > 0 && newVelocity.y < 0 && apexExists ) {
        // passed apex
        const dtToApex = Utils.linear(
          previousPoint.velocity.y,
          newVelocity.y,
          0,
          dt,
          0
        );
        const apexX = Utils.linear(
          0,
          dt,
          previousPoint.position.x,
          newX,
          dtToApex
        );
        const apexY = Utils.linear(
          0,
          dt,
          previousPoint.position.y,
          newY,
          dtToApex
        );
        const apexVelocityX = Utils.linear(
          0,
          dt,
          previousPoint.velocity.x,
          newVelocity.x,
          dtToApex
        );
        const apexVelocityY = Utils.linear(
          0,
          dt,
          previousPoint.velocity.y,
          newVelocity.y,
          dtToApex
        );
        const apexDragX = Utils.linear(
          0,
          dt,
          previousPoint.dragForce.x,
          newDragForce.x,
          dtToApex
        );
        const apexDragY = Utils.linear(
          0,
          dt,
          previousPoint.dragForce.y,
          newDragForce.y,
          dtToApex
        );

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

        this.dataPoints.push( apexPoint );

        assert && assert( this.apexPoint === null, 'already have an apex point' );

        this.apexPoint = apexPoint; // save apex point

        this.getDataProbe().updateDataIfWithinRange( apexPoint ); //update data probe if apex point is within range
      }

      let newPoint;

      // Has reached ground or below
      if ( newY <= 0 ) {
        this.reachedGround = true; // store the information that it has reached the ground

        // TODO: just a debug tool to help me catch https://github.com/phetsims/projectile-motion/issues/215
        let fromIf = true;

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
          fromIf = false;
          const squareRoot = -Math.sqrt(
            previousPoint.velocity.y * previousPoint.velocity.y -
            2 * previousPoint.acceleration.y * previousPoint.position.y
          );
          timeToGround =
            ( squareRoot - previousPoint.velocity.y ) /
            previousPoint.acceleration.y;
        }

        // TODO: just a debug tool to help me catch https://github.com/phetsims/projectile-motion/issues/215
        assert && assert( !isNaN( timeToGround ), `
timeToGround: ${timeToGround}, 
previousPoint.position: ${previousPoint.position}, 
previousPoint.velocity: ${previousPoint.velocity}, 
previousPoint.acceleration: ${previousPoint.acceleration}, 
fromIf: ${fromIf},
number of dataPoints: ${this.dataPoints.length}
` );

        newX =
          previousPoint.position.x +
          previousPoint.velocity.x * timeToGround +
          0.5 * previousPoint.acceleration.x * timeToGround * timeToGround;
        newY = 0;

        newPoint = new DataPoint(
          previousPoint.time + timeToGround,
          Vector2.pool.create( newX, newY ),
          this.airDensityProperty.value,
          Vector2.pool.create( 0, 0 ), // velocity
          Vector2.pool.create( 0, 0 ), // acceleration
          Vector2.pool.create( 0, 0 ), // drag force
          -this.gravityProperty.value * this.mass,
          {
            // add this special property to just the last datapoint collected for a trajectory
            reachedGround: true
          }
        );
        this.dataPoints.push( newPoint );
      }
      else {
        // Still in the air
        newPoint = new DataPoint(
          previousPoint.time + dt,
          Vector2.pool.create( newX, newY ),
          this.airDensityProperty.value,
          newVelocity,
          Vector2.pool.create(
            -newDragForce.x / this.mass,
            -this.gravityProperty.value - newDragForce.y / this.mass
          ), // acceleration
          newDragForce,
          -this.gravityProperty.value * this.mass
        );
        this.dataPoints.push( newPoint );
      }

      assert && assert( newPoint, 'should be defined' );

      // and update dataProbe tool
      this.getDataProbe().updateDataIfWithinRange( newPoint );
    }

    // keep track of old objects that need to be removed
    const projectileObjectsToRemove = [];

    // increment position of projectile objects, unless it has reached the end
    for ( let i = 0; i < this.projectileObjects.length; i++ ) {
      const projectileObject = this.projectileObjects.get( i );
      if ( projectileObject.index < this.dataPoints.length - 1 ) {
        // if the next point in front of the projectile is the apex, increment an additional data point
        projectileObject.index += this.dataPoints.get( projectileObject.index + 1 ).apex ? 2 : 1;
        const currentDataPoint = this.dataPoints.get( projectileObject.index );
        assert && assert( currentDataPoint, 'Data point is out of array bounds' );
        projectileObject.dataPointProperty.set( currentDataPoint );
      }

      // if it has just reached the end, check if landed on target and remove the last projectile
      else if ( !projectileObject.checkedScore ) {
        this.numberOfMovingProjectilesProperty.value--;
        this.target.scoreIfWithinTarget(
          projectileObject.dataPointProperty.get().position.x
        );
        projectileObject.checkedScore = true;

        // to help with memory, if this projectileObject has just landed, remove the last one (if it exists)
        if ( i !== 0 ) {
          projectileObjectsToRemove.push( this.projectileObjects.get( i - 1 ) );
        }
      }
    }

    // remove the objects that need to be removed
    this.projectileObjects.removeAll( projectileObjectsToRemove );
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

    // First, set nearest point and corresponding distance to the first datapoint.
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
   * Add a projectile object that starts at the first data point
   * @public
   */
  addProjectileObject() {
    assert && assert( this.dataPoints.length >= 1, 'at least one data point should be in this trajectory' );
    this.projectileObjects.push( new ProjectileObject( 0, this.dataPoints.get( 0 ) ) );
  }

  /**
   * Creates a new trajectory that is a copy of this one, but with one projectile object
   * @public
   *
   * @param {PhetioGroup} trajectoryGroup - the group that is creating the trajectories
   * @param {ProjectileObjectType} projectileObject - provides the index and data points.
   * @returns {Trajectory}
   */
  copyFromProjectileObject( trajectoryGroup, projectileObject ) {
    // create a brand new trajectory
    const newTrajectory =
      trajectoryGroup.createNextElement(
        this.projectileObjectType, this.mass, this.diameter, this.dragCoefficient,
        this.initialSpeed, this.initialHeight, this.initialAngle
      );

    // clear all the data points and then add up to where the current flying projectile is
    newTrajectory.dataPoints.clear();
    for ( let i = 0; i <= projectileObject.index; i++ ) {
      assert && assert( this.dataPoints.get( 0 ).position.x === 0,
        `Initial point x is not zero but ${this.dataPoints.get( 0 ).position.x}` );

      // add one to the number of trajectories using this datapoint
      newTrajectory.addDataPointFromClone( this.dataPoints.get( i ) );
    }

    // set the datapoint that indicates the position of the projectile object
    projectileObject.dataPointProperty.set(
      newTrajectory.dataPoints.get( projectileObject.index )
    );

    // remove object from this trajectory, clear all the projectile objects in new trajectory and add just one
    newTrajectory.projectileObjects.clear();
    newTrajectory.projectileObjects.push( projectileObject );

    return newTrajectory;
  }

  /**
   * Given another DataPoint reference, create a new cloned data point in this Trajectory.
   * @param {DataPoint} dataPoint
   * @public
   */
  addDataPointFromClone( dataPoint ) {
    this.dataPoints.push(
      new DataPoint(
        dataPoint.time,
        dataPoint.position,
        dataPoint.airDensity,
        dataPoint.velocity,
        dataPoint.acceleration,
        dataPoint.dragForce,
        dataPoint.forceGravity
      )
    );
  }

  /**
   * Create a PhetioGroup for the trajectories
   * @param {ProjectileMotionModel} model
   * @param {Tandem} tandem
   * @public
   */
  static createGroup( model, tandem ) {
    return new PhetioGroup(
      ( tandem, projectileObjectType, projectileMass, projectileDiameter, projectileDragCoefficient,
        initialSpeed, initialHeight, initialAngle ) => {
        return new Trajectory( projectileObjectType, projectileMass, projectileDiameter, projectileDragCoefficient,
          initialSpeed, initialHeight, initialAngle, model.airDensityProperty, model.gravityProperty,
          model.updateTrajectoryRanksEmitter, model.numberOfMovingProjectilesProperty, model.target, () => {
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
      NumberIO.fromStateObject( stateObject.mass ),
      NumberIO.fromStateObject( stateObject.diameter ),
      NumberIO.fromStateObject( stateObject.dragCoefficient ),
      NumberIO.fromStateObject( stateObject.initialSpeed ),
      NumberIO.fromStateObject( stateObject.initialHeight ),
      NumberIO.fromStateObject( stateObject.initialAngle )
    ];
  }
}

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
