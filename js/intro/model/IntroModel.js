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
  var ProjectileObjectType = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectType' );

  /**
   * @constructor
   */
  function IntroModel() {

    this.objectTypes = [
      ProjectileObjectType.CANNONBALL,
      ProjectileObjectType.PUMPKIN,
      ProjectileObjectType.BASEBALL,
      ProjectileObjectType.BUICK,
      ProjectileObjectType.FOOTBALL,
      ProjectileObjectType.HUMAN,
      ProjectileObjectType.PIANO,
      ProjectileObjectType.GOLF_BALL,  
      ProjectileObjectType.TANK_SHELL    
    ];

    ProjectileMotionModel.call( this, this.objectTypes[ 0 ], false );
  }

  projectileMotion.register( 'IntroModel', IntroModel );

  return inherit( ProjectileMotionModel, IntroModel );
} );

