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
 
  /**
   * @constructor
   */
  function ProjectileMotionDragModel() {
    var projectileMotionDragModel = this;
    ProjectileMotionModel.call( projectileMotionDragModel );
  }

  projectileMotion.register( 'ProjectileMotionDragModel', ProjectileMotionDragModel );

  return inherit( ProjectileMotionModel, ProjectileMotionDragModel);
} );

