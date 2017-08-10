// Copyright 2016-2017, University of Colorado Boulder

/**
 * Model for the 'Intro' Screen.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  var ProjectileObjectType = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectType' );

  /**
   * @constructor
   */
  function IntroModel() {

    // @public
    this.objectTypes = [
      ProjectileObjectType.CANNONBALL,
      ProjectileObjectType.TANK_SHELL,
      ProjectileObjectType.GOLF_BALL,
      ProjectileObjectType.BASEBALL,
      ProjectileObjectType.FOOTBALL,
      ProjectileObjectType.PUMPKIN,
      ProjectileObjectType.HUMAN,
      ProjectileObjectType.PIANO,
      ProjectileObjectType.CAR
    ];

    ProjectileMotionModel.call( this, this.objectTypes[ 5 ], false, 10, 0, 15 );
  }

  projectileMotion.register( 'IntroModel', IntroModel );

  return inherit( ProjectileMotionModel, IntroModel );
} );

