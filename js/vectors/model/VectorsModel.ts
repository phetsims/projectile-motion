// Copyright 2016-2025, University of Colorado Boulder

/**
 * Model for the 'Vectors' Screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import ProjectileMotionModel from '../../common/model/ProjectileMotionModel.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import projectileMotion from '../../projectileMotion.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class VectorsModel extends ProjectileMotionModel {

  public constructor( tandem: Tandem ) {
    super( ProjectileObjectType.COMPANIONLESS, true,
      [ ProjectileObjectType.COMPANIONLESS ], tandem, {
        phetioInstrumentAltitudeProperty: false
      } );
  }
}

projectileMotion.register( 'VectorsModel', VectorsModel );

export default VectorsModel;