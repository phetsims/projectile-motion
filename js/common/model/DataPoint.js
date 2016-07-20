// Copyright 2016, University of Colorado Boulder

/**
 * a data point on a trajectory path. Contains time, x, and y
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Vector2 = require( 'DOT/Vector2' );
 
  /**
   * @constructor
   */
  function DataPoint( time, x, y ) {
    Vector2.call( this, x, y );
    this.time = time;
  }

  projectileMotion.register( 'DataPoint', DataPoint );

  return inherit( Vector2, DataPoint );
} );

