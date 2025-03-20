// Copyright 2019-2025, University of Colorado Boulder

/**
 * Enumeration for the two ways to view vectors in the sim
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import projectileMotion from '../../projectileMotion.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';


export default class VectorsDisplayEnumeration extends EnumerationValue {
  public static readonly TOTAL = new VectorsDisplayEnumeration();
  public static readonly COMPONENTS = new VectorsDisplayEnumeration();

  private static readonly enumeration = new Enumeration( VectorsDisplayEnumeration );
}

projectileMotion.register( 'VectorsDisplayEnumeration', VectorsDisplayEnumeration );