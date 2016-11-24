// Copyright 2016, University of Colorado Boulder

/**
 * View for the 'Intro' screen. A subtype of the common screen view, ProjectileMotionScreenView
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ProjectileMotionIntroModel = require( 'PROJECTILE_MOTION/intro/model/ProjectileMotionIntroModel' );
  var ProjectileMotionIntroScreenView = require( 'PROJECTILE_MOTION/intro/view/ProjectileMotionIntroScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var introTitleString = require( 'string!PROJECTILE_MOTION/intro.title' );

  /**
   * @constructor
   */
  function ProjectileMotionIntroScreen() {

    var options = {
      name: introTitleString,
      backgroundColorProperty: new Property( Color.toColor( 'white' ) ),
      homeScreenIcon: ProjectileMotionConstants.RANDOM_ICON_FACTORY.createIcon()
    };

    Screen.call( this,
      function() { return new ProjectileMotionIntroModel(); },
      function( model ) { return new ProjectileMotionIntroScreenView( model ); },
      options
    );
  }

  projectileMotion.register( 'ProjectileMotionIntroScreen', ProjectileMotionIntroScreen );

  return inherit( Screen, ProjectileMotionIntroScreen );
} );

