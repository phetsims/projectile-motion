// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the measuring tape.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   *
   * @param {Tandem} tandem
   */
  function ProjectileMotionMeasuringTape() {

    // @public - Base (start of tape from the container) position
    this.basePositionProperty = new Property( new Vector2( 0, 0 ) );

    // @public - Tip (end of measuring tape) position
    this.tipPositionProperty = new Property( new Vector2( 1, 0 ) );

    // @public - Whether the measuring tape is out in the play area (false when in the toolbox)
    this.isActiveProperty = new Property( false );

    // TODO: doc is this public or private
    this.resetProjectileMotionMeasuringTape = function() {
      this.basePositionProperty.reset();
      this.tipPositionProperty.reset();
      this.isActiveProperty.reset();
    };

  }

  projectileMotion.register( 'ProjectileMotionMeasuringTape', ProjectileMotionMeasuringTape );

  return inherit( Object, ProjectileMotionMeasuringTape, {

    // @public
    reset: function() {
      this.resetProjectileMotionMeasuringTape();
    }

  } );

} );
