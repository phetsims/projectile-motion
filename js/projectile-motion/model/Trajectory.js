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

  // constants
  var ACCELERATION_DUE_TO_GRAVITY = 9.8; // m/s^2

  /**
   * @constructor
   */
  function Trajectory( initialVelocity, initialAngle ) {

    // @public
    PropertySet.call( this, {
      x: 0,
      y: 0,
      xVelocity: initialVelocity * Math.cos( initialAngle * Math.PI / 180 ),
      yVelocity: initialVelocity * Math.sin( initialAngle * Math.PI / 180 )
    } );
  
    this.xAcceleration = 0;
    this.yAcceleration = -ACCELERATION_DUE_TO_GRAVITY;

    // mutators
    this.setVelocityAndAngle = function( velocity, angle ) {
      this.xVelocity = velocity * Math.cos( angle * Math.PI / 180 );
      this.yVelocity = velocity * Math.sin( angle * Math.PI / 180 );
    };

    this.resetPosition = function() {
      this.xProperty.reset();
      this.yProperty.reset();
    };
  }

  projectileMotion.register( 'Trajectory', Trajectory );

  return inherit( PropertySet, Trajectory, {

    // @public animate trajectory, not taking into account air resistance
    step: function( dt ) {
      var newXVelocity = this.xVelocity;
      var newYVelocity = this.yVelocity + this.yAcceleration * dt;

      // TODO: check for x is in the bounds
      if ( this.y < 0 ) {
        newXVelocity = 0;
        newYVelocity = 0;
      }

      var newX = this.x + this.xVelocity * dt;
      var newY = this.y + this.yVelocity * dt + 0.5 * this.yAcceleration * dt * dt;

      this.x = newX;
      this.y = newY;
      this.xVelocity = newXVelocity;
      this.yVelocity = newYVelocity;
    }
  } );
} );