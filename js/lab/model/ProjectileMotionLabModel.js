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
  function ProjectileMotionLabModel() {
    var self = this;
    ProjectileMotionModel.call( self, {

      // This Property indicates whether the CustomizeDialog is visible
      customizeDialogVisible: false
    } );
  }

  projectileMotion.register( 'ProjectileMotionLabModel', ProjectileMotionLabModel );

  return inherit( ProjectileMotionModel, ProjectileMotionLabModel );
} );

