// Copyright 2022, University of Colorado Boulder

/**
 * Model for the 'Stats' Screen.
 *
 * @author Matthew Blackman(PhET Interactive Simulations)
 */

import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import ProjectileMotionModel from '../../common/model/ProjectileMotionModel.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import projectileMotion from '../../projectileMotion.js';

// const MULTI_LAUNCH_DELTA_TIME = 0.01;

class StatsModel extends ProjectileMotionModel {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    // @public
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

    super( objectTypes[ 0 ], false, objectTypes, tandem, {
      defaultCannonHeight: 2,
      defaultCannonAngle: 60,
      defaultInitialSpeed: 15,
      phetioInstrumentAltitudeProperty: false,
      statsScreen: true
    } );

    this.objectTypes = objectTypes;
    this.projectilesLeftToFire = 0;
    this.timeSinceLastProjectile = 0;
  }

  /**
   *
   * @param {number} numTimesToFire - the number of consecutive projectiles that the cannon will fire
   * @private
   */
  startFiringMultiple( numTimesToFire ) {
    this.projectilesLeftToFire = numTimesToFire;
    while ( this.projectilesLeftToFire > 0 ) {
      this.fireNextOfMultiple();
    }
  }

  /**
   * @private
   */
  fireNextOfMultiple() {
    this.projectilesLeftToFire--;
    this.timeSinceLastProjectile = 0;
    super.cannonFired();
  }

  /**
   * Steps the model forward in time using the created eventTimer
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
    super.step( dt );

    if ( this.projectilesLeftToFire > 0 && this.isPlayingProperty.value ) {
      const timeFactor =
        this.timeSpeedProperty.value === TimeSpeed.SLOW ? 0.33 : 1;
      this.timeSinceLastProjectile += timeFactor * dt;

      // if ( this.timeSinceLastProjectile >= MULTI_LAUNCH_DELTA_TIME ) {
      //   this.fireNextOfMultiple();
      // }
    }
  }

  /**
   * Reset these Properties
   * @public
   */
  reset() {
    this.projectilesLeftToFire = 0;
    this.timeSinceLastProjectile = 0;
    super.reset();
  }
}

projectileMotion.register( 'StatsModel', StatsModel );

export default StatsModel;
