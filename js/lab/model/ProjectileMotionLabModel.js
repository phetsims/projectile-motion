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
  // var PropertySet = require( 'AXON/PropertySet' );
 
  /**
   * @constructor
   */
  function ProjectileMotionLabModel() {
    var projectileMotionLabModel = this;
    ProjectileMotionModel.call( projectileMotionLabModel, {

      // This Property indicates whether the CustomizePanel is visible
      customizeDialogVisible: false
    } );
  }

  projectileMotion.register( 'ProjectileMotionLabModel', ProjectileMotionLabModel );

  return inherit( ProjectileMotionModel, ProjectileMotionLabModel );
} );

