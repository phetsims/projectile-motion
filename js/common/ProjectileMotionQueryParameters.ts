// Copyright 2022-2025, University of Colorado Boulder

/**
 * Sim specific query parameters
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import projectileMotion from '../projectileMotion.js';

const ProjectileMotionQueryParameters = QueryStringMachine.getAll( {
  stats: {
    type: 'flag',
    public: true
  }
} );

export default ProjectileMotionQueryParameters;

projectileMotion.register( 'ProjectileMotionQueryParameters', ProjectileMotionQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.projectileMotion.ProjectileMotionQueryParameters' );