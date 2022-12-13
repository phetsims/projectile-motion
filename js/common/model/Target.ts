// Copyright 2016-2022, University of Colorado Boulder

/**
 * The model for scoring algorithm.
 * Landed projectiles give their x position to this model.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';

class Target {

  /**
   * @param {number} initialXPosition - initial x position of the target
   * @param {Tandem} tandem
   */
  constructor( initialXPosition, tandem ) {

    const targetXPropertyTandem = tandem.createTandem( 'positionProperty' );

    // @public {Property.<number>} x position of target
    this.positionProperty = new NumberProperty( initialXPosition, {
      tandem: targetXPropertyTandem,
      phetioDocumentation: 'The x position of the target, in model coordinates',
      phetioFeatured: true,
      units: 'm',
      range: new Range( -100, 100 ),
      rangePropertyOptions: {
        tandem: targetXPropertyTandem.createTandem( 'rangeProperty' ),
        phetioDocumentation: 'The range for x position of the target. This changes based on the current zoom of the view. ' +
                             'The initial value is only temporary, and is overwritten in the view on startup.'
      }
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


  /**
   * Reset these Properties
   * @public
   * @override
   */
  reset() {
    this.positionProperty.reset();
  }

  /**
   * @public
   * @returns {bool} is projectileX within the target
   * @param {number} projectileX - x coordinate of projectile in model coordinates
   */
  checkIfHitTarget( projectileX ) {
    const distance = Math.abs( projectileX - this.positionProperty.get() );
    const hasHitTarget = distance <= ProjectileMotionConstants.TARGET_WIDTH / 2;

    if ( distance <= ProjectileMotionConstants.TARGET_WIDTH / 6 ) { // center circle
      this.scoredEmitter.emit( 3 );
    }
    else if ( distance <= ProjectileMotionConstants.TARGET_WIDTH / 3 ) { // middle circle
      this.scoredEmitter.emit( 2 );
    }
    else if ( distance <= ProjectileMotionConstants.TARGET_WIDTH / 2 ) { // just on the target
      this.scoredEmitter.emit( 1 );
    }
    return hasHitTarget;
  }
}

projectileMotion.register( 'Target', Target );

export default Target;
