// Copyright 2022-2024, University of Colorado Boulder

/**
 * Statistics utilities for the projectile motion sim.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import dotRandom from '../../../dot/js/dotRandom.js';

const StatUtils = {

  randomFromNormal: function( mean: number, standardDeviation: number ): number {
    let u = 0;
    let v = 0;
    while ( u === 0 ) {
      u = dotRandom.nextDouble();
    } //Converting [0,1) to (0,1)
    while ( v === 0 ) {
      v = dotRandom.nextDouble();
    }
    return (
      mean +
      standardDeviation *
      Math.sqrt( -2.0 * Math.log( u ) ) *
      Math.cos( 2.0 * Math.PI * v )
    );
  }
};

// projectileMotion.register("StatUtils", StatUtils);

export default StatUtils;