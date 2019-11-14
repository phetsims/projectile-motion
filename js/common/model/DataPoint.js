// Copyright 2016-2019, University of Colorado Boulder

/**
 * A subtype of Vector2 that contains information about a data point on a trajectory.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DataPointIO = require( 'PROJECTILE_MOTION/common/model/DataPointIO' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetioGroup = require( 'TANDEM/PhetioGroup' );
  const PhetioGroupIO = require( 'TANDEM/PhetioGroupIO' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );

  class DataPoint extends PhetioObject {

    /**
     * @param {number} time - total time since fire at this point on the trajectory, in s
     * @param {Vector2} position - position of the data point, with x and y, also called range and height, in m
     * @param {number} airDensity - air density of the atmosphere at this point, in kg/cu m
     * @param {Vector2} velocity - velocity at this point, magnitude in m/s
     * @param {Vector2} acceleration - acceleration at this point, magnitude in m/s^2
     * @param {Vector2} dragForce - drag force at this point, magnitude in N
     * @param {number} forceGravity - force of gravity, in N
     * @param {Object} [options]
     */
    constructor( time, position, airDensity, velocity, acceleration, dragForce, forceGravity, options ) {

      assert && assert( !isNaN( time ), 'DataPoint time is ' + time );
      assert && assert( time !== 0 || position.x === 0, 'Time is ' + time + 'but x is ' + position.x );

      options = merge( {
        tandem: Tandem.required,
        phetioType: DataPointIO,
        phetioDynamicElement: true
      }, options );

      super( options );

      // @public (read-only) - set by DataPointIO
      this.time = time;
      this.position = position;
      this.airDensity = airDensity;
      this.velocity = velocity;
      this.acceleration = acceleration;
      this.dragForce = dragForce;
      this.forceGravity = forceGravity;

      // @public - if this point is at the apex of a Trajectory, set by Trajectory.js
      this.apex = false;

      // @public - just the last datapoint collected for a trajectory, set by Trajectory.js
      this.reachedGround = false;
    }

    /**
     * Whether this dataPoint is equal to given dataPoint
     * @public
     *
     * @returns {boolean}
     */
    equals( dataPoint ) {
      return this.position.equals( dataPoint.position )
             && this.time === dataPoint.time
             && this.airDensity === dataPoint.airDensity
             && this.velocity.equals( dataPoint.velocity )
             && this.acceleration.equals( dataPoint.acceleration )
             && this.dragForce.equals( dataPoint.dragForce )
             && this.forceGravity === dataPoint.forceGravity;
    }

    /**
     * @public
     */
    dispose() {
      this.position.freeToPool();
      this.velocity.freeToPool();
      this.acceleration.freeToPool();
      this.dragForce.freeToPool();
      super.dispose();
    }

    /**
     * Create a PhetioGroup for the trajectories
     * @param {Tandem} tandem
     */
    static createGroup( tandem ) {
      const scrap = new Vector2( 0, 0 );
      return new PhetioGroup( 'dataPoint',
        ( tandem, time, position, airDensity, velocity, acceleration, dragForce, forceGravity ) => {
          return new DataPoint( time, position, airDensity, velocity, acceleration, dragForce, forceGravity, {
            tandem: tandem
          } );
        }, [ 12, scrap, 2, scrap, scrap, scrap, 3 ], {
          tandem: tandem,
          phetioType: PhetioGroupIO( DataPointIO )
        } );
    }
  }

  return projectileMotion.register( 'DataPoint', DataPoint );
} );

