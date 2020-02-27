// Copyright 2016-2020, University of Colorado Boulder

/**
 * Model for the 'Vectors' Screen.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import ProjectileMotionModel from '../../common/model/ProjectileMotionModel.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import projectileMotion from '../../projectileMotion.js';

/**
 * @param {Tandem} tandem
 * @constructor
 */
function VectorsModel( tandem ) {
  ProjectileMotionModel.call( this, ProjectileObjectType.COMPANIONLESS, true,
    [ ProjectileObjectType.COMPANIONLESS ], tandem, {
      phetioInstrumentAltitudeProperty: false
    } );
}

projectileMotion.register( 'VectorsModel', VectorsModel );

inherit( ProjectileMotionModel, VectorsModel );
export default VectorsModel;