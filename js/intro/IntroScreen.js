// Copyright 2016, University of Colorado Boulder

/**
 * The 'Intro' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var IntroModel = require( 'PROJECTILE_MOTION/intro/model/IntroModel' );
  var IntroScreenView = require( 'PROJECTILE_MOTION/intro/view/IntroScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );

  // strings
  var introTitleString = require( 'string!PROJECTILE_MOTION/intro.title' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
      name: introTitleString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: ProjectileMotionConstants.RANDOM_ICON_FACTORY.createIcon()
    };

    Screen.call( this,
      function() { return new IntroModel(); },
      function( model ) { return new IntroScreenView( model ); },
      options
    );
  }

  projectileMotion.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );

