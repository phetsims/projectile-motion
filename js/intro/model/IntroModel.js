// Copyright 2015, University of Colorado Boulder

/**
 * Model for the 'Intro' Screen.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  var ProjectileObjectType = require( 'PROJECTILE_MOTION/intro/model/ProjectileObjectType' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function IntroModel() {
    ProjectileMotionModel.call( this );

    this.objectTypes = [
      ProjectileObjectType.CANNONBALL,
      ProjectileObjectType.TANK_SHELL,
      ProjectileObjectType.PUMPKIN,
      ProjectileObjectType.BASEBALL,
      ProjectileObjectType.BUICK,
      ProjectileObjectType.FOOTBALL,
      ProjectileObjectType.HUMAN,
      ProjectileObjectType.PIANO,
      ProjectileObjectType.GOLF_BALL,      
    ];

    this.selectedProjectileObjectTypeProperty = new Property( this.objectTypes[ 0 ] );

    this.selectedProjectileObjectTypeProperty.link( this.setProjectileParameters.bind( this ) );
  }

  projectileMotion.register( 'IntroModel', IntroModel );

  return inherit( ProjectileMotionModel, IntroModel, {

    // @private set mass, diameter, and drag coefficient based on the currently selected projectile object type
    setProjectileParameters: function( selectedProjectileObjectType ) {
      this.projectileMassProperty.set( selectedProjectileObjectType.mass );
      this.projectileDiameterProperty.set( selectedProjectileObjectType.diameter );
      this.projectileDragCoefficientProperty.set( selectedProjectileObjectType.dragCoefficient );
    }
  } );
} );

