// Copyright 2019-2020, University of Colorado Boulder

/**
 * Object that holds individual control Nodes, one for each variable that can be adjusted for each customizable object
 * type. Since this is just a data structure, subtypes can call super and then set items after the fact, as long as
 * every control is set to be a Node before construction is complete.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import projectileMotion from '../../projectileMotion.js';

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

export default ProjectileObjectTypeControl;