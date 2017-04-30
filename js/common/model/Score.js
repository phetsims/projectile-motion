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
  var Property = require( 'AXON/Property' );

  // constants
  var APPEARANCE_DELAY = 0.05; // seconds

  /**
   * @param {number} initialTargetX - initial x position of the target
   * @constructor
   */
  function Score( initialTargetX ) {

    // @public {Property.<boolean>} whether user has scored
    this.scoreVisibleProperty = new Property( false );

    // @public {Property.<boolean>} whether scoring animation should be on
    this.scoringAnimationProperty = new Property( false );
    
    // @public {Property.<number>} how long before score indicator should be made visible
    this.timeBeforeVisibleProperty = new Property( 0 );
    
    // @public {Property.<number>} x position of target
    this.targetXProperty = new Property( initialTargetX );

  }

  projectileMotion.register( 'Score', Score );

  return inherit( Object, Score, {

    // @public
    reset: function() {
      this.scoreVisibleProperty.reset();
      this.scoringAnimationProperty.reset();
      this.timeBeforeVisibleProperty.reset();
      this.targetXProperty.reset();
    },

    // @public
    step: function( dt ) {

      // scoring animation on
      if ( this.scoringAnimationProperty.get() ) {

        // hasn't reached time to make score visible yet
        if ( this.timeBeforeVisibleProperty.get() < APPEARANCE_DELAY ) { 
          this.scoreVisibleProperty.set( false );
          this.timeBeforeVisibleProperty.set( this.timeBeforeVisibleProperty.get() + dt ); // update time before making score visible
        }

        // It is time to make score visible.
        else {
          this.scoreVisibleProperty.set( true );
        }
      }

      // scoring animation off
      else {
        this.scoreVisibleProperty.set( false );
      }
    },


    // @public Determines {boolean} whether projectile has scored based on {number} x position of the landed projectile
    checkforScored: function( projectileX ) {
      var distance = Math.abs( projectileX - this.targetXProperty.get() );
      if ( distance <= ProjectileMotionConstants.TARGET_LENGTH / 2 ) {
        this.score();
      }
    },

    // @public restarts time before visible and turns on animation
    score: function() {
      this.timeBeforeVisibleProperty.set( 0 );
      this.scoringAnimationProperty.set( true );
    },

    // @public turns off animation
    turnOffScore: function() {
      this.scoringAnimationProperty.set( false );
    }

  } );
} );

