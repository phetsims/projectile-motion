// Copyright 2016, University of Colorado Boulder

/**
 * The model for scoring algorithm, knows about the target. Landed projectiles give their x location to this model.
 * Each time a projectile hits the target, the score indicator appears after a small delay time
 * Each time a projectile is fired, the score indicator disappears. The appearance delay of 0.05 is so that 
 * if multiple projectiles hit the target after the last fire, the score indicator seems to reappear
 * 
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PropertySet = require( 'AXON/PropertySet' );

  // constants
  var APPEARANCE_DELAY = 0.05; // seconds

  /**
   * @param {number} initialTargetX - x position of the target
   * @constructor
   */
  function Score( initialTargetX ) {
    // @public
    PropertySet.call( this, {
      scoreVisible: false, // indicates whether user has scored
      scoringAnimation: false, // whether scoring animation should be on
      timeBeforeVisible: 0, // indicates how before score indicator should be made visible
      targetX: initialTargetX
    } );

  }

  projectileMotion.register( 'Score', Score );

  return inherit( PropertySet, Score, {

    //@ public
    step: function( dt ) {

      // scoring animation on
      if ( this.scoringAnimation ) {

        // hasn't reached time to make score visible yet
        if ( this.timeBeforeVisible < APPEARANCE_DELAY ) { 
          this.scoreVisible = false;
          this.timeBeforeVisible += dt; // update time before making score visible
        }

        // It is time to make score visible.
        else {
          this.scoreVisible = true;
        }
      }

      // scoring animation off
      else {
        this.scoreVisible = false;
      }
    },


    // @public Determines {boolean} whether projectile has scored based on {number} x position of the landed projectile
    checkforScored: function( projectileX ) {
      var distance = Math.abs( projectileX - this.targetX );
      if ( distance <= ProjectileMotionConstants.TARGET_LENGTH / 2 ) {
        this.score();
      }
    },

    // @public restarts time before visible and turns on animation
    score: function() {
      this.timeBeforeVisible = 0;
      this.scoringAnimation = true;
    },

    // @public turns off animation
    turnOffScore: function() {
      this.scoringAnimation = false;
    }

  } );
} );

