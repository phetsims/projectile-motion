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
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  var ProjectilePanel = require( 'PROJECTILE_MOTION/intro/view/ProjectilePanel' );
 
  /**
   * @param {ProjectileMotionIntroModel} model
   * @constructor
   */
  function ProjectileMotionIntroScreenView( model, options ) {

    var thisScreenView = this;

    options = options || {};

    // second panel shows dropdown of projectiles, air resistance checkbox, and disabled parameters
    options = _.extend( { secondPanel: new ProjectilePanel( model ) }, options );

    ProjectileMotionScreenView.call( thisScreenView, model, options );

  }

  projectileMotion.register( 'ProjectileMotionIntroScreenView', ProjectileMotionIntroScreenView );

  return inherit( ProjectileMotionScreenView, ProjectileMotionIntroScreenView );
} );

