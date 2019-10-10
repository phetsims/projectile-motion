// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the measuring tape in projectile motion.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function ProjectileMotionMeasuringTape( tandem ) {

    // @public - Base (start of tape from the container) position
    this.basePositionProperty = new Vector2Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'basePositionProperty' )
    } );

    // @public - Tip (end of measuring tape) position
    this.tipPositionProperty = new Vector2Property( new Vector2( 1, 0 ), { tandem: tandem.createTandem( 'tipPositionProperty' ) } );

    // @public - Whether the measuring tape is out in the play area (false when in the toolbox)
    this.isActiveProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'isActiveProperty' ) } );
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
