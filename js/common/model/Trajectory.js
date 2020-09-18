// Copyright 2016-2020, University of Colorado Boulder

/**
 * Model of a trajectory.
 * One trajectory can have multiple projectiles on its path.
 * Air resistance and altitude can immediately change the path of the projectiles in the air.
 * Velocity, angle, mass, diameter, dragcoefficient only affect the next projectile fired.
 * Units are meters, kilograms, and seconds (mks)
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';
import DataPoint from './DataPoint.js';
import DataPointIO from './DataPointIO.js';
import ProjectileObject from './ProjectileObject.js';
import ProjectileObjectIO from './ProjectileObjectIO.js';
import TrajectoryIO from './TrajectoryIO.js';

// constants
const MAX_NUMBER_OF_TRAJECTORIES = ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES;
const MAX_NUMBER_OF_FLYING_PROJECTILES = ProjectileMotionConstants.MAX_NUMBER_OF_FLYING_PROJECTILES;

class Trajectory extends PhetioObject {

  /**
   * @param {ProjectileMotionModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true,
      phetioType: TrajectoryIO
    }, options );

    super( options );

    // @private
    this.projectileMotionModel = model;

    // @private
    this.projectileObjectType = model.selectedProjectileObjectTypeProperty.get();

    // @private {number} mass of projectiles in kilograms
    this.mass = model.projectileMassProperty.get();

    // @private {number} diameter of projectiles in meters
    this.diameter = model.projectileDiameterProperty.get();

    // @private {number} drag coefficient of the projectiles
    this.dragCoefficient = model.projectileDragCoefficientProperty.get();

    // @public {Property.<number>}
    this.rankProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'rankProperty' ),
      phetioDocumentation: 'The count of how old this projectile trajectory is. Older trajectories have more ' +
                           'opacity until they are subsequently removed. The most recent trajectory fired has rank 0. ' +
                           'The second most recent has rank 1. The oldest still on screen has rank ' +
                           ( MAX_NUMBER_OF_TRAJECTORIES - 1 ),
      phetioReadOnly: true
    } );

    // @public did the trajectory path change in mid air due to air density change
    this.changedInMidAir = false;

    // @public (read-only) {ObservableArray.<DataPoint>} record points along the trajectory with critical information
    this.dataPoints = new ObservableArray( {
      phetioType: ObservableArray.ObservableArrayIO( DataPointIO ),
      tandem: options.tandem.createTandem( 'dataPoints' ),
      phetioDocumentation: 'An ordered list of all data points taken on this trajectory. The earliest data point ' +
                           'will be first'
    } );

    // @public (read-only) set by TrajectoryIO.js
    this.reachedGround = false;

    // Add one to the rank
    const incrementRank = () => {
      this.rankProperty.value++;
    };

    // Listen to whether this rank should be incremented
    model.updateTrajectoryRanksEmitter.addListener( incrementRank );

    const velocity = Vector2.dirtyFromPool().setPolar(
      model.initialSpeedProperty.value,
      model.cannonAngleProperty.value * Math.PI / 180
    );

    // fix large drag errors
    if ( velocity.x < 0 ) {
      velocity.setXY( 0, 0 );
    }

    // cross sectional area of the projectile
    const area = Math.PI * this.diameter * this.diameter / 4;
    const airDensity = this.projectileMotionModel.airDensityProperty.get();
    const gravity = this.projectileMotionModel.gravityProperty.get();

    const dragForce = Vector2.dirtyFromPool().set( velocity )
      .multiplyScalar( 0.5 * airDensity * area * this.dragCoefficient * velocity.magnitude );

    const initialPoint = new DataPoint(
      0, // total time elapsed
      Vector2.createFromPool( 0, model.cannonHeightProperty.get() ), // position
      model.airDensityProperty.get(), // air density
      velocity,
      Vector2.createFromPool( -dragForce.x / this.mass, -gravity - dragForce.y / this.mass ), // acceleration
      dragForce, // drag force
      -model.gravityProperty.get() * this.mass // force gravity
    );
    this.dataPoints.push( initialPoint );

    // @public {DataPoint||null} - contains reference to the apex point, or null if apex point doesn't exist/has been recorded
    this.apexPoint = null;

    // It is not gauranteed that the dataProbe exists
    model.dataProbe && model.dataProbe.updateDataIfWithinRange( initialPoint );

    // @public {ObservableArray.<ProjectileObject>}
    this.projectileObjects = new ObservableArray( {
      tandem: options.tandem.createTandem( 'projectileObjects' ),
      phetioType: ObservableArray.ObservableArrayIO( ProjectileObjectIO ),
      phetioDocumentation: 'A list of the current projectile objects on this trajectory. At most there can only be ' +
                           MAX_NUMBER_OF_FLYING_PROJECTILES + ' projectiles flying on any trajectory at one time.'
    } );

    // add first projectile object
    this.addProjectileObject();

    // @private
    this.disposeTrajectory = () => {
      this.apexPoint = null; // remove reference

      this.dataPoints.dispose();
      this.projectileObjects.dispose();
      this.rankProperty.dispose();
      model.updateTrajectoryRanksEmitter.removeListener( incrementRank );
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

      let newX = previousPoint.position.x + previousPoint.velocity.x * dt + 0.5 * previousPoint.acceleration.x * dt * dt;
      let newY = previousPoint.position.y + previousPoint.velocity.y * dt + 0.5 * previousPoint.acceleration.y * dt * dt;

      const newVelocity = Vector2.dirtyFromPool().setXY(
        previousPoint.velocity.x + previousPoint.acceleration.x * dt,
        previousPoint.velocity.y + previousPoint.acceleration.y * dt
      );

      // fix large drag errors by making it free fall
      if ( newVelocity.x < 0 ) {
        newVelocity.setXY( 0, 0 );
        apexExists = false;
      }

      if ( newX < previousPoint.position.x ) {
        newX = previousPoint.position.x;
        newY = previousPoint.position.y;
        apexExists = false;
      }

      // cross sectional area of the projectile
      const area = Math.PI * this.diameter * this.diameter / 4;
      const airDensity = this.projectileMotionModel.airDensityProperty.get();
      const gravity = this.projectileMotionModel.gravityProperty.get();

      const newDragForce = Vector2.dirtyFromPool().set( newVelocity ).multiplyScalar( 0.5 * airDensity * area * this.dragCoefficient * newVelocity.magnitude );

      if ( previousPoint.velocity.y > 0 && newVelocity.y < 0 && apexExists ) { // passed apex
        const dtToApex = Utils.linear( previousPoint.velocity.y, newVelocity.y, 0, dt, 0 );
        const apexX = Utils.linear( 0, dt, previousPoint.position.x, newX, dtToApex );
        const apexY = Utils.linear( 0, dt, previousPoint.position.y, newY, dtToApex );
        const apexVelocityX = Utils.linear( 0, dt, previousPoint.velocity.x, newVelocity.x, dtToApex );
        const apexVelocityY = Utils.linear( 0, dt, previousPoint.velocity.y, newVelocity.y, dtToApex );
        const apexDragX = Utils.linear( 0, dt, previousPoint.dragForce.x, newDragForce.x, dtToApex );
        const apexDragY = Utils.linear( 0, dt, previousPoint.dragForce.y, newDragForce.y, dtToApex );

        const apexPoint = new DataPoint(
          previousPoint.time + dtToApex,
          Vector2.createFromPool( apexX, apexY ),
          airDensity,
          Vector2.createFromPool( apexVelocityX, apexVelocityY ), // velocity
          Vector2.createFromPool( -apexDragX / this.mass, -gravity - apexDragY / this.mass ), // acceleration
          Vector2.createFromPool( apexDragX, apexDragY ), // drag force
          -gravity * this.mass, {
            apex: true
          }
        );

        this.dataPoints.push( apexPoint );

        assert && assert( this.apexPoint === null, 'already have an apex point' );

        this.apexPoint = apexPoint; // save apex point

        this.projectileMotionModel.dataProbe.updateDataIfWithinRange( apexPoint );
      }

      // Has reached ground or below
      if ( newY <= 0 ) {
        this.reachedGround = true; // store the information that it has reached the ground

        // TODO: just a debug tool to help me catch https://github.com/phetsims/projectile-motion/issues/215
        let fromIf = true;

        // recalculate by hand, the time it takes for projectile to reach the ground, within the next dt
        let timeToGround = null;
        if ( previousPoint.acceleration.y === 0 ) {
          timeToGround = -previousPoint.position.y / previousPoint.velocity.y;
        }
        else {
          fromIf = false;
          const squareRoot = -Math.sqrt( previousPoint.velocity.y * previousPoint.velocity.y -
                                         2 * previousPoint.acceleration.y * previousPoint.position.y );
          timeToGround = ( squareRoot - previousPoint.velocity.y ) / previousPoint.acceleration.y;
        }

        // TODO: just a debug tool to help me catch https://github.com/phetsims/projectile-motion/issues/215
        assert && assert( !isNaN( timeToGround ),
          `timeToGround: ${timeToGround}, previousPoint.velocity: ${previousPoint.velocity}, previousPoint.acceleration: ${previousPoint.acceleration}, fromIf: ${fromIf}` );

        newX = previousPoint.position.x +
               previousPoint.velocity.x * timeToGround +
               0.5 * previousPoint.acceleration.x * timeToGround * timeToGround;
        newY = 0;

        var newPoint = new DataPoint(
          previousPoint.time + timeToGround,
          Vector2.createFromPool( newX, newY ),
          airDensity,
          Vector2.createFromPool( 0, 0 ), // velocity
          Vector2.createFromPool( 0, 0 ), // acceleration
          Vector2.createFromPool( 0, 0 ), // drag force
          -gravity * this.mass, {

            // add this special property to just the last datapoint collected for a trajectory
            reachedGround: true
          }
        );
        this.dataPoints.push( newPoint );
      }

      // Still in the air
      else {
        newPoint = new DataPoint(
          previousPoint.time + dt,
          Vector2.createFromPool( newX, newY ),
          airDensity,
          newVelocity,
          Vector2.createFromPool( -newDragForce.x / this.mass, -gravity - newDragForce.y / this.mass ), // acceleration
          newDragForce,
          -gravity * this.mass
        );
        this.dataPoints.push( newPoint );
      }

      // and update dataProbe tool and David
      this.projectileMotionModel.dataProbe.updateDataIfWithinRange( newPoint );
    }

    // keep track of old objects that need to be removed
    const projectileObjectsToRemove = [];

    // increment position of projectile objects, unless it has reached the end
    for ( let i = 0; i < this.projectileObjects.length; i++ ) {
      const projectileObject = this.projectileObjects.get( i );
      if ( projectileObject.index < this.dataPoints.length - 1 ) {
        projectileObject.index++;
        const currentDataPoint = this.dataPoints.get( projectileObject.index );
        projectileObject.dataPointProperty.set( currentDataPoint );
        if ( projectileObject.dataPointProperty.get().apex ) { // if on apex, increment to the next point to maintain true time step
          projectileObject.index++;
          projectileObject.dataPointProperty.set( currentDataPoint );
        }
      }

      // if it has just reached the end, check if landed on target and remove the last projectile
      else if ( !projectileObject.checkedScore ) {
        this.projectileMotionModel.numberOfMovingProjectilesProperty.value--;
        this.projectileMotionModel.score.scoreIfWithinTarget( projectileObject.dataPointProperty.get().position.x );
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
   * @param {ProjectileObjectType} projectileObject - provides the index and data points.
   * @returns {Trajectory}
   */
  copyFromProjectileObject( projectileObject ) {

    // create a brand new trajectory
    const newTrajectory = this.projectileMotionModel.trajectoryGroup.createNextElement( this.projectileMotionModel );

    // clear all the data points and then add up to where the current flying projectile is
    newTrajectory.dataPoints.clear();
    for ( let i = 0; i <= projectileObject.index; i++ ) {

      assert && assert(
        this.dataPoints.get( 0 ).position.x === 0,
        `Initial point x is not zero but ${this.dataPoints.get( 0 ).position.x}`
      );

      // add one to the number of trajectories using this datapoint
      newTrajectory.addDataPointFromClone( this.dataPoints.get( i ) );
    }

    // set the datapoint that indicates the position of the projectile object
    projectileObject.dataPointProperty.set( newTrajectory.dataPoints.get( projectileObject.index ) );

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
    this.dataPoints.push( new DataPoint(
      dataPoint.time,
      dataPoint.position,
      dataPoint.airDensity,
      dataPoint.velocity,
      dataPoint.acceleration,
      dataPoint.dragForce,
      dataPoint.forceGravity
    ) );
  }

  /**
   * Whether this trajectory is equal to the one given
   * @public
   *
   * @param {Trajectory} trajectory
   * @returns {boolean}
   */
  equals( trajectory ) {
    const thisInitialPoint = this.dataPoints.get( 0 );
    const trajectoryInitialPoint = trajectory.dataPoints.get( 0 );
    return !this.changedInMidAir
           && !trajectory.changedInMidAir
           && this.projectileObjectType === trajectory.projectileObjectType
           && this.diameter === trajectory.diameter
           && this.mass === trajectory.mass
           && this.dragCoefficient === trajectory.dragCoefficient
           && thisInitialPoint.equals( trajectoryInitialPoint );
  }

  /**
   * Create a PhetioGroup for the trajectories
   * @param {ProjectileMotionModel} model
   * @param {Tandem} tandem
   * @public
   */
  static createGroup( model, tandem ) {
    return new PhetioGroup( tandem => {
      return new Trajectory( model, {
        tandem: tandem
      } );
    }, [], {
      tandem: tandem,
      phetioType: PhetioGroupIO( TrajectoryIO ),
      phetioDocumentation: 'The container for any trajectory that is created when a projectile is fired.'
    } );
  }

  /**
   * Dispose this Trajectory, for memory management
   * @public
   */
  dispose() {
    this.disposeTrajectory();
    super.dispose();
  }
}

projectileMotion.register( 'Trajectory', Trajectory );
export default Trajectory;
