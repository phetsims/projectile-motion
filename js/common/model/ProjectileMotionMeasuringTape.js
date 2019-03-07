// Copyright 2016-2017, University of Colorado Boulder

/**
 * Model for the measuring tape in projectile motion.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @constructor
   */
  function ProjectileMotionMeasuringTape() {

    // @public - Base (start of tape from the container) position
    this.basePositionProperty = new Vector2Property( new Vector2( 0, 0 ) );

    // @public - Tip (end of measuring tape) position
    this.tipPositionProperty = new Vector2Property( new Vector2( 1, 0 ) );

    // @public - Whether the measuring tape is out in the play area (false when in the toolbox)
    this.isActiveProperty = new BooleanProperty( false );

  }

  projectileMotion.register( 'ProjectileMotionMeasuringTape', ProjectileMotionMeasuringTape );

  return inherit( Object, ProjectileMotionMeasuringTape, {

    /**
     * Reset these Properties
     * @public
     * @override
     */
    reset: function() {
      this.basePositionProperty.reset();
      this.tipPositionProperty.reset();
      this.isActiveProperty.reset();
    }

  } );

} );
