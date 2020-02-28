// Copyright 2019-2020, University of Colorado Boulder

/**
 * Enumeration for the two ways to view vectors in the sim
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import projectileMotion from '../../projectileMotion.js';

export default projectileMotion.register( 'VectorsDisplayEnumeration', Enumeration.byKeys( [
  'TOTAL',
  'COMPONENTS'
] ) );