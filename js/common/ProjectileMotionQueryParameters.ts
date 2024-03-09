// Copyright 2022-2024, University of Colorado Boulder

/**
 * Sim specific query parameters
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import projectileMotion from '../projectileMotion.js';

const SCHEMA_MAP = {
  stats: {
    type: 'flag',
    public: true
  }
} as const;

const ProjectileMotionQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );
export default ProjectileMotionQueryParameters;

projectileMotion.register( 'ProjectileMotionQueryParameters', ProjectileMotionQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.projectileMotion.ProjectileMotionQueryParameters' );