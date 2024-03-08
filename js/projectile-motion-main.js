// Copyright 2015-2024, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import ProjectileMotionQueryParameters from './common/ProjectileMotionQueryParameters.js';
import DragScreen from './drag/DragScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import StatsScreen from './stats/StatsScreen.js';
import ProjectileMotionStrings from './ProjectileMotionStrings.js';
import VectorsScreen from './vectors/VectorsScreen.js';

const projectileMotionTitleString =
  ProjectileMotionStrings[ 'projectile-motion' ].titleStringProperty;

const simOptions = {
  credits: {
    leadDesign: 'Amy Rouinfar, Mike Dubson',
    softwareDevelopment: 'Andrea Lin, Matthew Blackman',
    team: 'Ariel Paul, Kathy Perkins, Amanda McGarry, Wendy Adams, John Blanco',
    qualityAssurance: 'Steele Dalton, Alex Dornan, Ethan Johnson, Liam Mulhall',
    graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan'
  }
};

const screens = [
  new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
  new VectorsScreen( Tandem.ROOT.createTandem( 'vectorsScreen' ) ),
  new DragScreen( Tandem.ROOT.createTandem( 'dragScreen' ) ),
  new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
];

if ( ProjectileMotionQueryParameters.stats ) {
  screens.push( new StatsScreen( Tandem.ROOT.createTandem( 'stats' ) ) );
}

simLauncher.launch( () => {
  const sim = new Sim(
    projectileMotionTitleString,
    screens,
    simOptions
  );
  sim.start();
} );
