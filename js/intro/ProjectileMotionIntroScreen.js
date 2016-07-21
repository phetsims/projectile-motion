// Copyright 2016, University of Colorado Boulder

/**
 * View for the 'Intro' screen. A subtype of the common screen view, ProjectileMotionScreenView
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionIntroModel = require( 'PROJECTILE_MOTION/intro/model/ProjectileMotionIntroModel' );
  var ProjectileMotionIntroScreenView = require( 'PROJECTILE_MOTION/intro/view/ProjectileMotionIntroScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var introTitleString = require( 'string!PROJECTILE_MOTION/intro.title' );

  // images
  var screenIcon = require( 'image!PROJECTILE_MOTION/PlumPuddingAtom-screen-icon.png' );

  /**
   * @constructor
   */
  function ProjectileMotionIntroScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = new Image( screenIcon );

    Screen.call( this, introTitleString, icon,
      function() {
        return new ProjectileMotionIntroModel(); },
      function( model ) {
        return new ProjectileMotionIntroScreenView( model ); }, { backgroundColor: 'white' }
    );
  }

  projectileMotion.register( 'ProjectileMotionIntroScreen', ProjectileMotionIntroScreen );

  return inherit( Screen, ProjectileMotionIntroScreen );
} );

