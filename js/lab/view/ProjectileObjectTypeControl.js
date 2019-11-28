// Copyright 2019, University of Colorado Boulder

/**
 * Object that holds individual control Nodes, one for each variable that can be adjusted for each customizable object
 * type. Since this is just a data structure, subtypes can call super and then set items after the fact, as long as
 * every control is set to be a Node before construction is complete.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );

  class ProjectileObjectTypeControl {

    /**
     * @param {Node} massControl
     * @param {Node} diameterControl
     * @param {Node} gravityControl
     * @param {Node} altitudeControl
     * @param {Node} dragCoefficientControl
     */
    constructor( massControl, diameterControl, gravityControl, altitudeControl, dragCoefficientControl ) {

      // @public (read-only) {Node} - settable by subtypes
      this.massControl = massControl;
      this.diameterControl = diameterControl;
      this.gravityControl = gravityControl;
      this.altitudeControl = altitudeControl;
      this.dragCoefficientControl = dragCoefficientControl;
    }
  }

  projectileMotion.register( 'ProjectileObjectTypeControl', ProjectileObjectTypeControl );

  return ProjectileObjectTypeControl;
} );

