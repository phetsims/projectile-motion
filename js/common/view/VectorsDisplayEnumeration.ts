// Copyright 2019-2022, University of Colorado Boulder

/**
 * Enumeration for the two ways to view vectors in the sim
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import projectileMotion from '../../projectileMotion.js';

const VectorsDisplayEnumeration = EnumerationDeprecated.byKeys( [
  'TOTAL',
  'COMPONENTS'
] );
projectileMotion.register( 'VectorsDisplayEnumeration', VectorsDisplayEnumeration );
export default VectorsDisplayEnumeration;