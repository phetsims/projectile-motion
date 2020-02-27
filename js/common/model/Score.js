// Copyright 2016-2019, University of Colorado Boulder

/**
 * The model for scoring algorithm.
 * Landed projectiles give their x location to this model.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Emitter = require( 'AXON/Emitter' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Range = require( 'DOT/Range' );
  const RangeIO = require( 'DOT/RangeIO' );

  /**
   * @param {number} initialTargetX - initial x position of the target
   * @param {Tandem} tandem
   * @constructor
   */
  function Score( initialTargetX, tandem ) {

    // @public {Property.<number>} x position of target
    this.targetXProperty = new NumberProperty( initialTargetX, {
      tandem: tandem.createTandem( 'targetXProperty' ),
      phetioDocumentation: 'The x position of the score target, in model coordinates',
      phetioFeatured: true,
      range: new Property( new Range( -100, 100 ), {
        tandem: tandem.createTandem( 'targetXRangeProperty' ),
        phetioDocumentation: 'The range for x position of the score. This changes based on the current zoom of the view. ' +
                             'The initial value is only temporary, and is overwritten in the view.',
        phetioReadOnly: true,
        phetioType: PropertyIO( RangeIO )
      } )
    } );

    // @public {Emitter} if projectile has scored
    this.scoredEmitter = new Emitter( {
      tandem: tandem.createTandem( 'scoredEmitter' ),
      phetioDocumentation: 'Emits when a projectile hits the target, indicating a "score." More stars are given ' +
                           'depending on how close to the bullseye the projectile lands.',
      parameters: [ {
        name: 'numberOfStars',
        phetioType: NumberIO
      } ]
    } );
  }

  projectileMotion.register( 'Score', Score );

  return inherit( Object, Score, {

    /**
     * Reset these Properties
     * @public
     * @override
     */
    reset: function() {
      this.targetXProperty.reset();
    },

    /**
     * Scores if projectile has scored based on {number} x position of the landed projectile
     * @public
     *
     * @param {number} projectileX - x coordinate in model coordinates
     */
    scoreIfWithinTarget: function( projectileX ) {
      const distance = Math.abs( projectileX - this.targetXProperty.get() );
      if ( distance <= ProjectileMotionConstants.TARGET_WIDTH / 6 ) { // center circle
        this.scoredEmitter.emit( 3 );
      }
      else if ( distance <= ProjectileMotionConstants.TARGET_WIDTH / 3 ) { // middle circle
        this.scoredEmitter.emit( 2 );
      }
      else if ( distance <= ProjectileMotionConstants.TARGET_WIDTH / 2 ) { // just on the target
        this.scoredEmitter.emit( 1 );
      }
    }
  } );
} );

