// Copyright 2016-2020, University of Colorado Boulder

/**
 * Model for the 'Drag' Screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import ProjectileMotionModel from '../../common/model/ProjectileMotionModel.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import projectileMotion from '../../projectileMotion.js';

/**
 * @param {Tandem} tandem
 * @constructor
 */
function DragModel( tandem ) {
  ProjectileMotionModel.call( this, ProjectileObjectType.COMPANIONLESS, true,
    [ ProjectileObjectType.COMPANIONLESS ], tandem );
}

projectileMotion.register( 'DragModel', DragModel );

inherit( ProjectileMotionModel, DragModel );
export default DragModel;