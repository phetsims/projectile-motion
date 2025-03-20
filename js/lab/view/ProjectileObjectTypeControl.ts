// Copyright 2019-2025, University of Colorado Boulder

/**
 * Object that holds individual control Nodes, one for each variable that can be adjusted for each customizable object
 * type. Since this is just a data structure, subtypes can call super and then set items after the fact, as long as
 * every control is set to be a Node before construction is complete.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import projectileMotion from '../../projectileMotion.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';

type SelfOptions = EmptySelfOptions;
export type ProjectileObjectTypeControlOptions = SelfOptions;

class ProjectileObjectTypeControl {

  public massControl;
  public diameterControl;
  public gravityControl;
  public altitudeControl;
  public dragCoefficientControl;

  public constructor( massControl: Node | null,
                      diameterControl: Node | null,
                      gravityControl: Node | null,
                      altitudeControl: Node | null,
                      dragCoefficientControl: Node | null,
                      providedOptions: ProjectileObjectTypeControlOptions ) {
    this.massControl = massControl;
    this.diameterControl = diameterControl;
    this.gravityControl = gravityControl;
    this.altitudeControl = altitudeControl;
    this.dragCoefficientControl = dragCoefficientControl;
  }
}

projectileMotion.register( 'ProjectileObjectTypeControl', ProjectileObjectTypeControl );

export default ProjectileObjectTypeControl;