// Copyright 2016-2020, University of Colorado Boulder

/**
 * Model for the 'Intro' Screen.
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
function IntroModel( tandem ) {

  // @public
  this.objectTypes = [
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

  ProjectileMotionModel.call( this, this.objectTypes[ 5 ], false, this.objectTypes, tandem, {
    defaultCannonHeight: 10,
    defaultCannonAngle: 0,
    defaultInitialSpeed: 15,
    phetioInstrumentAltitudeProperty: false
  } );
}

projectileMotion.register( 'IntroModel', IntroModel );

inherit( ProjectileMotionModel, IntroModel );
export default IntroModel;