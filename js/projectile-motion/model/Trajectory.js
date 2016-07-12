// Copyright 2016, University of Colorado Boulder

/**
 * Model of a projectile
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/projectile-motion/ProjectileMotionConstants' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var ACCELERATION_DUE_TO_GRAVITY = 9.8; // m/s^2

  /**
   * @constructor
   */
  function Trajectory( initialVelocity, initialAngle ) {

    // @public
    PropertySet.call( this, {
      position: new Vector2(
        ProjectileMotionConstants.INITIAL_TRAJECTORY_X,
        ProjectileMotionConstants.INITIAL_TRAJECTORY_Y
      ),
      showPaths: true // if it is set to false, the paths are erased
    } );

    this.xVelocity = initialVelocity * Math.cos( initialAngle * Math.PI / 180 ),
      this.yVelocity = initialVelocity * Math.sin( initialAngle * Math.PI / 180 ),
      this.xAcceleration = 0;
    this.yAcceleration = -ACCELERATION_DUE_TO_GRAVITY;

    // given the new velocity and angle, mutates the velocity components
    this.setVelocityAndAngle = function( velocity, angle ) {
      this.xVelocity = velocity * Math.cos( angle * Math.PI / 180 );
      this.yVelocity = velocity * Math.sin( angle * Math.PI / 180 );
    };

    // resets the projectile at origin and deletes all of its paths
    this.resetPosition = function() {
      this.positionProperty.reset();

      // the following removes paths
      this.showPaths = false;
      this.showPaths = true;
    };
  }

  projectileMotion.register( 'Trajectory', Trajectory );

  return inherit( PropertySet, Trajectory, {

    // @public animate trajectory, not taking into account air resistance
    step: function( dt ) {
      // TODO: make it stop at edge of bounds

      var newXVelocity = this.xVelocity;
      var newYVelocity = this.yVelocity + this.yAcceleration * dt;

      this.xVelocity = newXVelocity;
      this.yVelocity = newYVelocity;

      var newX = this.position.x + this.xVelocity * dt;
      var newY = this.position.y + this.yVelocity * dt + 0.5 * this.yAcceleration * dt * dt;

      this.position.x = newX;
      this.position.y = newY;

      console.log( this.position );
    }
  } );
} );

