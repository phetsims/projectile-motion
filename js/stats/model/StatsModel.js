// Copyright 2022, University of Colorado Boulder

/**
 * Model for the 'Stats' Screen.
 *
 * @author Matthew Blackman(PhET Interactive Simulations)
 */

import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import ProjectileMotionModel from '../../common/model/ProjectileMotionModel.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import projectileMotion from '../../projectileMotion.js';

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

    // @public {Property.<number>}
    this.clusterSizeProperty = new NumberProperty(
      20,
      {
        tandem: tandem.createTandem( 'clusterSizeProperty' ),
        phetioDocumentation: 'Number of simultaneous projectiles launched',
        units: '',
        range: new Range( 1, 50 )
      }
    );
  }

  /**
   *
   * @private
   */
  startFiringMultiple( ) {
    this.projectilesLeftToFire = this.clusterSizeProperty.value;
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
    this.clusterSizeProperty.reset();
    super.reset();
  }
}

projectileMotion.register( 'StatsModel', StatsModel );

export default StatsModel;
