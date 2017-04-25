// Copyright 2016, University of Colorado Boulder

/**
 * A data point on a trajectory path. Subtype of Vector2. Contains time, x, y, and airDensity at the time.
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Vector2 = require( 'DOT/Vector2' );
 
  /**
   * @param {number} time - total time since fire at this point on the trajectory
   * @param {number} x - x position of the data point, also called range
   * @param {number} y - y position of the data point, also called height
   * @param {number} airDensity
   * @param {number} xVelocity
   * @param {number} yVelocity
   * @param {number} xAcceleration
   * @param {number} yAcceleration
   * @param {number} xDragForce
   * @param {number} yDragForce
   * @param {number} forceGravity
   * @constructor
   */
  function DataPoint( time, x, y, airDensity, xVelocity, yVelocity, xAcceleration, yAcceleration, xDragForce, yDragForce, forceGravity ) {
    Vector2.call( this, x, y );

    // @public
    this.time = time;
    this.airDensity = airDensity;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.xAcceleration = xAcceleration;
    this.yAcceleration = yAcceleration;
    this.xDragForce = xDragForce;
    this.yDragForce = yDragForce;
    this.forceGravity = forceGravity;
  }

  projectileMotion.register( 'DataPoint', DataPoint );

  return inherit( Vector2, DataPoint );
} );

