// Copyright 2016-2022, University of Colorado Boulder

/**
 * Model for the 'Drag' Screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionModel from '../../common/model/ProjectileMotionModel.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import projectileMotion from '../../projectileMotion.js';

class DragModel extends ProjectileMotionModel {
  public constructor( tandem: Tandem ) {

    super( ProjectileObjectType.COMPANIONLESS, true, [ ProjectileObjectType.COMPANIONLESS ], tandem );
  }
}

projectileMotion.register( 'DragModel', DragModel );

export default DragModel;