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
   * {number} time - total time since fire at this point on the trajectory
   * {number} x - x position of the data point, also called range
   * {number} y - y position of the data point, also called height
   * @constructor
   */
  function DataPoint( time, x, y, airDensity, xVelocity, yVelocity ) {
    Vector2.call( this, x, y );

    // @public
    this.time = time;
    this.airDensity = airDensity;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
  }

  projectileMotion.register( 'DataPoint', DataPoint );

  return inherit( Vector2, DataPoint );
} );

