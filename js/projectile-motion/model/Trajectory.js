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
  }

  projectileMotion.register( 'Trajectory', Trajectory );

  return inherit( PropertySet, Trajectory, {

    // @public animate particle, changing direction at min/max x
    step: function( dt ) {
      console.log( 'stepping trajectory');
      var newXVelocity = this.xVelocity;
      var newYVelocity = this.yVelocity + this.yAcceleration * dt;

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
      console.log( this.x, this.y );
    }
  } );
} );