// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroSecondPanel = require( 'PROJECTILE_MOTION/intro/view/IntroSecondPanel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );

  /**
   * @param {ProjectileMotionIntroModel} model
   * @constructor
   */
  function ProjectileMotionIntroScreenView( model, options ) {

    var thisScreenView = this;

    options = options || {};

    // second panel shows dropdown of projectiles, air resistance checkbox, and disabled parameters
    options = _.extend( {
      secondPanel: new IntroSecondPanel( model )
    }, options );

    ProjectileMotionScreenView.call( thisScreenView, model, options );

  }

  projectileMotion.register( 'ProjectileMotionIntroScreenView', ProjectileMotionIntroScreenView );

  return inherit( ProjectileMotionScreenView, ProjectileMotionIntroScreenView );
} );

