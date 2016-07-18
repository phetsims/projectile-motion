// Copyright 2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var ProjectileMotionLabScreen = require( 'PROJECTILE_MOTION/lab/ProjectileMotionLabScreen' );
  var ProjectileMotionIntroScreen = require( 'PROJECTILE_MOTION/intro/ProjectileMotionIntroScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var projectileMotionTitleString = require( 'string!PROJECTILE_MOTION/projectile-motion.title' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( projectileMotionTitleString, [ new ProjectileMotionLabScreen(), new ProjectileMotionIntroScreen() ], simOptions );
    sim.start();
  } );
} );