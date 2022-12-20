// Copyright 2016-2022, University of Colorado Boulder

/**
 * Model for the 'Intro' Screen.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */

import ProjectileMotionModel from '../../common/model/ProjectileMotionModel.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectileMotion from '../../projectileMotion.js';

class IntroModel extends ProjectileMotionModel {

  public objectTypes: ProjectileObjectType[];
  public constructor( tandem: Tandem ) {

    const objectTypes = [
      ProjectileObjectType.CANNONBALL,
      ProjectileObjectType.TANK_SHELL,
      ProjectileObjectType.GOLF_BALL,
      ProjectileObjectType.BASEBALL,
      ProjectileObjectType.FOOTBALL,
      ProjectileObjectType.PUMPKIN,
      ProjectileObjectType.HUMAN,
      ProjectileObjectType.PIANO,
      ProjectileObjectType.CAR
    ];

    super( objectTypes[ 5 ], false, objectTypes, tandem, {
      defaultCannonHeight: 10,
      defaultCannonAngle: 0,
      defaultInitialSpeed: 15,
      phetioInstrumentAltitudeProperty: false
    } );

    this.objectTypes = objectTypes;
  }
}

projectileMotion.register( 'IntroModel', IntroModel );

export default IntroModel;
