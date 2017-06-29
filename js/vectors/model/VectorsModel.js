// Copyright 2015, University of Colorado Boulder

/**
 * Model for the 'Vectors' Screen.
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
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function VectorsModel() {
    ProjectileMotionModel.call( this );
    
    // TODO: put these three as parameters into ProjectileMotionModel
    
    this.airResistanceOnProperty.set( true ); // since this screen explores vectors, always leave air resistance on
    
    this.selectedProjectileObjectTypeProperty = new Property( ProjectileObjectType.VECTORS_SCREEN );

    this.selectedProjectileObjectTypeProperty.link( this.setProjectileParameters.bind( this ) );
  }

  projectileMotion.register( 'VectorsModel', VectorsModel );

  return inherit( ProjectileMotionModel, VectorsModel, {

    // @private set mass, diameter, and drag coefficient based on the currently selected projectile object type
    setProjectileParameters: function( selectedProjectileObjectType ) {
      this.projectileMassProperty.set( selectedProjectileObjectType.mass );
      this.projectileDiameterProperty.set( selectedProjectileObjectType.diameter );
      this.projectileDragCoefficientProperty.set( selectedProjectileObjectType.dragCoefficient );
    },

    // @public resets all vector model elements, first calling the super class' reset
    reset: function() {
      ProjectileMotionModel.prototype.reset.call( this );
      this.airResistanceOnProperty.set( true );// since this screen explores vectors, always leave air resistance on
      this.selectedProjectileObjectTypeProperty.reset();
    }
  } );
} );

