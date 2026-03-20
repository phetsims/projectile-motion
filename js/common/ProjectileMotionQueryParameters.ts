// Copyright 2022-2026, University of Colorado Boulder

/**
 * Sim specific query parameters
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';

const ProjectileMotionQueryParameters = QueryStringMachine.getAll( {
  stats: {
    type: 'flag',
    public: true
  }
} );

export default ProjectileMotionQueryParameters;

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
phet.log && phet.log( `ProjectileMotionQueryParameters: ${JSON.stringify( ProjectileMotionQueryParameters, null, 2 )}` );
