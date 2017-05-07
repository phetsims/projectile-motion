// Copyright 2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var IntroScreen = require( 'PROJECTILE_MOTION/intro/IntroScreen' );
  var DragScreen = require( 'PROJECTILE_MOTION/drag/DragScreen' );
  var LabScreen = require( 'PROJECTILE_MOTION/lab/LabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var projectileMotionTitleString = require( 'string!PROJECTILE_MOTION/projectile-motion.title' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: 'Amanda McGarry, Amy Rouinfar',
      softwareDevelopment: 'Andrea Lin, Mike Dubson',
      team: 'Ariel Paul, Kathy Perkins',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( projectileMotionTitleString, [
      new IntroScreen(),
      new DragScreen(),
      new LabScreen()
    ], simOptions );
    sim.start();
  } );
} );

