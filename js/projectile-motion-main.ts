// Copyright 2015-2025, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import DragScreen from './drag/DragScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import ProjectileMotionStrings from './ProjectileMotionStrings.js';
import VectorsScreen from './vectors/VectorsScreen.js';

const projectileMotionTitleStringProperty = ProjectileMotionStrings[ 'projectile-motion' ].titleStringProperty;

simLauncher.launch( () => {
  const sim = new Sim(
    projectileMotionTitleStringProperty,
    [
      new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
      new VectorsScreen( Tandem.ROOT.createTandem( 'vectorsScreen' ) ),
      new DragScreen( Tandem.ROOT.createTandem( 'dragScreen' ) ),
      new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
    ],
    {
      credits: {
        leadDesign: 'Amy Rouinfar, Mike Dubson',
        softwareDevelopment: 'Andrea Lin, Matthew Blackman, Michael Kauzmann',
        team: 'Ariel Paul, Kathy Perkins, Amanda McGarry, Wendy Adams, John Blanco',
        qualityAssurance: 'Steele Dalton, Alex Dornan, Ethan Johnson, Liam Mulhall',
        graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan'
      }
    }
  );
  sim.start();
} );