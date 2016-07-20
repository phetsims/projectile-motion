// Copyright 2016, University of Colorado Boulder

/**
 * Contains the scoring algorithm, involving the target and landed projectiles
 * Each time a projectile hits the target, the score indicator appears after 0.2 seconds
 * Each time a projectile is fired, the score indicator disappears. The delay is so that 
 * if multiple projectiles hit the target after the last fire, the score indicator seems to reappear
 * 
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Number} initialTargetX - x position of the target
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

    // @param {Number} projectileX - x location of the projectile, in meters
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
      if ( this.scoringAnimation ) { // scoring animation on
        if ( this.timeBeforeVisible < 0.05 ) { // hasn't reached time to make score visible yet
          this.scoreVisible = false;
          this.timeBeforeVisible += dt; // update time before making score visible
        } else { // time to make score visible
          this.scoreVisible = true;
        }
      } else { // no scoring animation
        this.scoreVisible = false;
      }
    }

  } );
} );

