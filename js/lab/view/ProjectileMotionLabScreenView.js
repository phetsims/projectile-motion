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
  // var ScreenView = require( 'JOIST/ScreenView' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
 
  /**
   * @param {ProjectileMotionLabModel} model
   * @constructor
   */
  function ProjectileMotionLabScreenView( model ) {

    var thisScreenView = this;

    ProjectileMotionScreenView.call( thisScreenView, model );

  }

  projectileMotion.register( 'ProjectileMotionLabScreenView', ProjectileMotionLabScreenView );

  return inherit( ProjectileMotionScreenView, ProjectileMotionLabScreenView );
} );

