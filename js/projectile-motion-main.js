// Copyright 2015-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragScreen = require( 'PROJECTILE_MOTION/drag/DragScreen' );
  const IntroScreen = require( 'PROJECTILE_MOTION/intro/IntroScreen' );
  const LabScreen = require( 'PROJECTILE_MOTION/lab/LabScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );
  const VectorsScreen = require( 'PROJECTILE_MOTION/vectors/VectorsScreen' );

  // strings
  const projectileMotionTitleString = require( 'string!PROJECTILE_MOTION/projectile-motion.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar, Mike Dubson',
      softwareDevelopment: 'Andrea Lin',
      team: 'Ariel Paul, Kathy Perkins, Amanda McGarry, Wendy Adams, John Blanco',
      qualityAssurance: 'Steele Dalton, Alex Dornan, Ethan Johnson, Liam Mulhall',
      graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan'
    }
  };

  SimLauncher.launch( function() {
    const sim = new Sim( projectileMotionTitleString, [
      new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
      new VectorsScreen( Tandem.ROOT.createTandem( 'vectorsScreen' ) ),
      new DragScreen( Tandem.ROOT.createTandem( 'dragScreen' ) ),
      new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
    ], simOptions );
    sim.start();
  } );
} );

