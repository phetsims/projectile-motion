// Copyright 2015-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import DragScreen from './drag/DragScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import projectileMotionStrings from './projectileMotionStrings.js';
import VectorsScreen from './vectors/VectorsScreen.js';

const projectileMotionTitleString = projectileMotionStrings[ 'projectile-motion' ].title;

const simOptions = {
  credits: {
    leadDesign: 'Amy Rouinfar, Mike Dubson',
    softwareDevelopment: 'Andrea Lin',
    team: 'Ariel Paul, Kathy Perkins, Amanda McGarry, Wendy Adams, John Blanco',
    qualityAssurance: 'Steele Dalton, Alex Dornan, Ethan Johnson, Liam Mulhall',
    graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan'
  }
};

simLauncher.launch( () => {
  const sim = new Sim( projectileMotionTitleString, [
    new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
    new VectorsScreen( Tandem.ROOT.createTandem( 'vectorsScreen' ) ),
    new DragScreen( Tandem.ROOT.createTandem( 'dragScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
  ], simOptions );
  sim.start();
} );