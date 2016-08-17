// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the measuring tape.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   *
   * @param {Tandem} tandem
   */
  function ProjectileMotionMeasuringTape() {

    PropertySet.call( this, {
      // @public - Base (start of tape from the container) position
      basePosition: new Vector2( 0, 0 ),

      // @public - Tip (end of measuring tape) position
      tipPosition: new Vector2( 1, 0 ),

      // @public - Whether the measuring tape is out in the play area (false when in the toolbox)
      isActive: false
    } );
  }

  projectileMotion.register( 'ProjectileMotionMeasuringTape', ProjectileMotionMeasuringTape );

  return inherit( PropertySet, ProjectileMotionMeasuringTape );
} );
