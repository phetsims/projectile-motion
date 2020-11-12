// Copyright 2016-2020, University of Colorado Boulder

/**
 * Model for the 'Vectors' Screen.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */

import ProjectileMotionModel from '../../common/model/ProjectileMotionModel.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import projectileMotion from '../../projectileMotion.js';

class VectorsModel extends ProjectileMotionModel {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( ProjectileObjectType.COMPANIONLESS, true,
      [ ProjectileObjectType.COMPANIONLESS ], tandem, {
        phetioInstrumentAltitudeProperty: false
      } );
  }
}

projectileMotion.register( 'VectorsModel', VectorsModel );

export default VectorsModel;