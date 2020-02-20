// Copyright 2016-2020, University of Colorado Boulder

/**
 * Model for the tracer tool.
 * Knows about trajectories, which contain arrays of points on their paths
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DataPointIO = require( 'PROJECTILE_MOTION/common/model/DataPointIO' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NullableIO = require( 'TANDEM/types/NullableIO' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  // constants
  const SENSING_RADIUS = 0.2; // meters, will change to view units. How close the tracer needs to get to a datapoint
  const TIME_PER_MINOR_DOT = ProjectileMotionConstants.TIME_PER_MINOR_DOT; // milliseconds

  /**
   * @param {PhetioGroup.<Trajectory>} trajectories
   * @param {number} tracerX - x initial position of the tracer
   * @param {number} tracerY - y initial position of the tracer
   * @param {Tandem} tandem
   * @constructor
   */
  function Tracer( trajectories, tracerX, tracerY, tandem ) {

    // @public
    this.positionProperty = new Vector2Property( new Vector2( tracerX, tracerY ), {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioDocumentation: 'The position of the tracer in model coordinates, in meters.'
    } );

    // @public {Property.<DataPoint|null>}
    this.dataPointProperty = new Property( null, {
      tandem: tandem.createTandem( 'dataPointProperty' ),
      phetioDocumentation: 'Data point that the tracer is displaying information about, or null if no info displayed. ' +
                           'See DataPointIO for more information about the data point value.',
      phetioType: PropertyIO( NullableIO( DataPointIO ) )
    } );

    // @public
    this.isActiveProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isActiveProperty' ),
      phetioDocumentation: 'Whether the tracer is out in the play area (false when in toolbox)'
    } );

    // @public {PhetioGroup.<Trajectory>} group of trajectories in the model
    this.trajectories = trajectories;

    this.trajectories.addMemberDisposedListener( this.updateData.bind( this ) );
  }

  projectileMotion.register( 'Tracer', Tracer );

  return inherit( Object, Tracer, {

    /**
     * Reset these Properties
     * @public
     * @override
     */
    reset: function() {
      this.positionProperty.reset();
      this.dataPointProperty.reset();
      this.isActiveProperty.reset();
    },

    /**
     * Checks for if there is a point the tracer is close to. If so, updates dataPointProperty
     * @public
     */
    updateData: function() {
      for ( let i = this.trajectories.length - 1; i >= 0; i-- ) {
        const currentTrajectory = this.trajectories.get( i );
        if ( currentTrajectory.apexPoint && currentTrajectory.apexPoint.position.distance( this.positionProperty.get() ) <= SENSING_RADIUS ) { // current point shown is apex and it is still within sensing radius
          this.dataPointProperty.set( currentTrajectory.apexPoint );
          return;
        }
        const point = currentTrajectory.getNearestPoint( this.positionProperty.get().x, this.positionProperty.get().y );
        const pointIsReadable = point &&
                                ( point.apex || point.position.y === 0 || Utils.toFixedNumber( point.time * 1000, 0 ) % TIME_PER_MINOR_DOT === 0 );
        if ( pointIsReadable && point.position.distance( this.positionProperty.get() ) <= SENSING_RADIUS ) {
          this.dataPointProperty.set( point );
          return;
        }
      }
      this.dataPointProperty.set( null );
    },

    /**
     * Checks if the given point is close enough to the tracer and updates information if so
     * @public
     *
     * @param {DataPoint} point
     */
    updateDataIfWithinRange: function( point ) {

      // point can be read by tracer if it exists, it is on the ground, or it is the right timestep
      const pointIsReadable = point &&
                              ( point.apex || point.position.y === 0 || Utils.toFixedNumber( point.time * 1000, 0 ) % TIME_PER_MINOR_DOT === 0 );
      if ( pointIsReadable && point.position.distance( this.positionProperty.get() ) <= SENSING_RADIUS ) {
        this.dataPointProperty.set( point );
      }
    }
  } );

} );

