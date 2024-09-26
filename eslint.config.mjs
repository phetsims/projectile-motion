// Copyright 2024, University of Colorado Boulder

/**
 * ESlint configuration for projectile-motion.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import parent from '../chipper/eslint/sim.eslint.config.mjs';

export default [
  ...parent,
  {
    rules: {
      'phet/no-view-imported-from-model': 'off'
    }
  }
];