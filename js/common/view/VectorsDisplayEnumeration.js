// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration for the two ways to view vectors in the sim
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );

  return projectileMotion.register( 'VectorsDisplayEnumeration', Enumeration.byKeys( [
    'TOTAL',
    'COMPONENTS'
  ] ) );
} );