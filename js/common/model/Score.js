// Copyright 2016-2017, University of Colorado Boulder

/**
 * The model for scoring algorithm.
 * Landed projectiles give their x location to this model.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @param {number} initialTargetX - initial x position of the target
   * @constructor
   */
  function Score( initialTargetX ) {

    // @public {Property.<number>} x position of target
    this.targetXProperty = new NumberProperty( initialTargetX );

    // @public {Emitter} if projectile has scored
    this.scoredEmitter = new Emitter();

    // @public {number} number of stars
    this.numberOfStars = 0;

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
      var distance = Math.abs( projectileX - this.targetXProperty.get() );
      if ( distance <= ProjectileMotionConstants.TARGET_WIDTH / 6 ) { // center circle
        this.numberOfStars = 3;
        this.scoredEmitter.emit();
      }
      else if ( distance <= ProjectileMotionConstants.TARGET_WIDTH / 3 ) { // middle circle
        this.numberOfStars = 2;
        this.scoredEmitter.emit();
      }
      else if ( distance <= ProjectileMotionConstants.TARGET_WIDTH / 2 ) { // just on the target
        this.numberOfStars = 1;
        this.scoredEmitter.emit();
      }
      else {
        this.numberOfStars = 0;
      }
    }

  } );
} );

