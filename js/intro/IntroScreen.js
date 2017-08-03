// Copyright 2016-2017, University of Colorado Boulder

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
  var IntroIconNode = require( 'PROJECTILE_MOTION/intro/view/IntroIconNode' );
  var IntroModel = require( 'PROJECTILE_MOTION/intro/model/IntroModel' );
  var IntroScreenView = require( 'PROJECTILE_MOTION/intro/view/IntroScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );

  // strings
  var screenIntroString = require( 'string!PROJECTILE_MOTION/screen.intro' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
      name: screenIntroString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new IntroIconNode( 'screen' ),
      navigationBarIcon: new IntroIconNode( 'nav' )
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

