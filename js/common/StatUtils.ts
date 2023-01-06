// Copyright 2022-2023, University of Colorado Boulder

// import projectileMotion from "../projectileMotion";

import dotRandom from '../../../dot/js/dotRandom.js';

const StatUtils = {

  randomFromNormal: function( mean: number, stardardDeviation: number ): number {
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
      stardardDeviation *
      Math.sqrt( -2.0 * Math.log( u ) ) *
      Math.cos( 2.0 * Math.PI * v )
    );
  }
};

// projectileMotion.register("StatUtils", StatUtils);

export default StatUtils;
