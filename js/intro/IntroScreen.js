// Copyright 2016-2019, University of Colorado Boulder

/**
 * The 'Intro' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const IntroIconNode = require( 'PROJECTILE_MOTION/intro/view/IntroIconNode' );
  const IntroModel = require( 'PROJECTILE_MOTION/intro/model/IntroModel' );
  const IntroScreenView = require( 'PROJECTILE_MOTION/intro/view/IntroScreenView' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenIntroString = require( 'string!PROJECTILE_MOTION/screen.intro' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function IntroScreen( tandem ) {

    const options = {
      name: screenIntroString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new IntroIconNode( 'screen' ),
      navigationBarIcon: new IntroIconNode( 'nav' ),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new IntroModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new IntroScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  projectileMotion.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );

