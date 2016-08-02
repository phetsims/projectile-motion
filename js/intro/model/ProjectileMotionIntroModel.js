// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  var Property = require( 'AXON/Property' );
  var ProjectileObject = require( 'PROJECTILE_MOTION/common/model/ProjectileObject' );

  /**
   * @constructor
   */
  function ProjectileMotionIntroModel() {
    var self = this;
    ProjectileMotionModel.call( self );

    this.projectileObjectChoices = [
      ProjectileObject.TANKSHELL,
      ProjectileObject.PUMPKIN
    ];

    this.selectedProjectileObjectProperty = new Property( this.projectileObjectChoices[ 0 ] );

    this.selectedProjectileObjectProperty.link( function( selectedProjectileObject ) {
      self.projectileMassProperty.set( selectedProjectileObject.mass );
      self.projectileDiameterProperty.set( selectedProjectileObject.diameter );
      self.projectileDragCoefficientProperty.set( selectedProjectileObject.dragCoefficient );
    } );
  }

  projectileMotion.register( 'ProjectileMotionIntroModel', ProjectileMotionIntroModel );

  return inherit( ProjectileMotionModel, ProjectileMotionIntroModel );
} );

