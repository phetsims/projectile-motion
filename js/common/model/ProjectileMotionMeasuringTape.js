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

    // @public
    this.basePositionProperty = new Vector2Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'basePositionProperty' ),
      phetioDocumentation: 'Base (start of tape from the container) position'
    } );

    // @public -
    this.tipPositionProperty = new Vector2Property( new Vector2( 1, 0 ), {
      tandem: tandem.createTandem( 'tipPositionProperty' ),
      phetioDocumentation: 'Tip (end of measuring tape) position'
    } );

    // @public
    this.isActiveProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isActiveProperty' ),
      phetioDocumentation: 'Whether the measuring tape is out in the play area (false when in the toolbox)'
    } );
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
