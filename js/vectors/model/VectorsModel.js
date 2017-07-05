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

  /**
   * @constructor
   */
  function VectorsModel() {
    ProjectileMotionModel.call( this, ProjectileObjectType.VECTORS_SCREEN, true );
  }

  projectileMotion.register( 'VectorsModel', VectorsModel );

  return inherit( ProjectileMotionModel, VectorsModel );
} );

