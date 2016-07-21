// Copyright 2016, University of Colorado Boulder

/**
 * The model for scoring algorithm, knows about the target. Landed projectiles give their x location to this model.
 * Each time a projectile hits the target, the score indicator appears after 0.2 seconds
 * Each time a projectile is fired, the score indicator disappears. The 0.05 s delay is so that 
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

  /**
   * @param {number} initialTargetX - x position of the target
   * @constructor
   */
  function Score( initialTargetX ) {

    // @public
    PropertySet.call( this, {
      scoreVisible: false, // indicates whether user has scored
      scoringAnimation: false, // whether scoring animation should be on
      timeBeforeVisible: 0, // indicates how long score visible
      targetX: initialTargetX
    } );

    // TODO: move functions to inherit

    // @param {number} projectileX - x location of the projectile, in meters
    // @returns {Boolean}
    this.checkforScored = function( projectileX ) {
      var distance = Math.abs( projectileX - this.targetX );
      if ( distance <= ProjectileMotionConstants.TARGET_LENGTH / 2 ) {
        this.score();
      }
    };

    // restarts time before visible and turns on animation
    this.score = function() {
      this.timeBeforeVisible = 0;
      this.scoringAnimation = true;
    };

    // turns off animation
    this.turnOffScore = function() {
      this.scoringAnimation = false;
    };
  }

  projectileMotion.register( 'Score', Score );

  return inherit( PropertySet, Score, {

    step: function( dt ) {

      // scoring animation on
      if ( this.scoringAnimation ) {

        // hasn't reached time to make score visible yet
        if ( this.timeBeforeVisible < 0.05 ) { 
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
    }

  } );
} );

