// Copyright 2015-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var IntroScreen = require( 'PROJECTILE_MOTION/intro/IntroScreen' );
  var DragScreen = require( 'PROJECTILE_MOTION/drag/DragScreen' );
  var LabScreen = require( 'PROJECTILE_MOTION/lab/LabScreen' );
  var VectorsScreen = require( 'PROJECTILE_MOTION/vectors/VectorsScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var projectileMotionTitleString = require( 'string!PROJECTILE_MOTION/projectile-motion.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar, Mike Dubson',
      softwareDevelopment: 'Andrea Lin',
      team: 'Ariel Paul, Kathy Perkins, Amanda McGarry, Wendy Adams, John Blanco',
      qualityAssurance: 'Steele Dalton, Alex Dornan, Ethan Johnson, Liam Mulhall',
      graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( projectileMotionTitleString, [
      new IntroScreen(),
      new VectorsScreen(),
      new DragScreen(),
      new LabScreen()
    ], simOptions );
    sim.start();
  } );
} );

