// Copyright 2016, University of Colorado Boulder

/**
 * Model of a projectile
 * Notes: air resistance and altitude can immediately change the path of the trajectory, whereas other parameters
 * like velocity, angle, mass, diameter, dragcoefficient only affect the next projectile fired
 * Units are meters, kilograms, and seconds (mks)
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  // var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PropertySet = require( 'AXON/PropertySet' );


  /**
   * @param {ObservableArray} trajectories
   * @constructor
   */
  function Tracer( trajectories, tracerX, tracerY ) {
    // @public
    PropertySet.call( this, {
      x: tracerX,
      y: tracerY,
      point: null
    } );
    

  }

  projectileMotion.register( 'Tracer', Tracer );

  return inherit( PropertySet, Tracer );

} );

