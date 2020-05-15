// Copyright 2016-2020, University of Colorado Boulder

/**
 * The model for scoring algorithm.
 * Landed projectiles give their x position to this model.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import inherit from '../../../../phet-core/js/inherit.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';

/**
 * @param {number} initialTargetX - initial x position of the target
 * @param {Tandem} tandem
 * @constructor
 */
function Score( initialTargetX, tandem ) {

  // @public {Property.<number>} x position of target
  const targetXPropertyTandem = tandem.createTandem( 'targetXProperty' );
  this.targetXProperty = new NumberProperty( initialTargetX, {
    tandem: targetXPropertyTandem,
    phetioDocumentation: 'The x position of the score target, in model coordinates',
    phetioFeatured: true,
    range: new Range( -100, 100 ),
    rangePropertyOptions: {
      tandem: targetXPropertyTandem.createTandem( 'rangeProperty' ),
      phetioDocumentation: 'The range for x position of the score. This changes based on the current zoom of the view. ' +
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

projectileMotion.register( 'Score', Score );

inherit( Object, Score, {

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

export default Score;
