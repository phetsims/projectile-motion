// Copyright 2022, University of Colorado Boulder

/**
 * Model for the 'Stats' Screen.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import ProjectileMotionModel from '../../common/model/ProjectileMotionModel.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
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
    this.timeSinceLastProjectile = 0;

    // @public {Property.<number>}
    this.groupSizeProperty = new NumberProperty(
      ProjectileMotionConstants.GROUP_SIZE_DEFAULT,
      {
        tandem: tandem.createTandem( 'groupSizeProperty' ),
        phetioDocumentation: 'Number of simultaneous projectiles launched',
        units: '',
        range: new Range( ProjectileMotionConstants.GROUP_SIZE_INCREMENT, ProjectileMotionConstants.GROUP_SIZE_MAX )
      }
    );

    // @public {DerivedProperty.<boolean>}
    this.fireMultipleEnabledProperty = new DerivedProperty(
      [ this.numberOfMovingProjectilesProperty, this.groupSizeProperty, this.rapidFireModeProperty ],
      ( numMoving, groupSize, rapidFireMode ) =>
        !rapidFireMode && numMoving + groupSize <= ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES,
      {
        tandem: tandem.createTandem( 'fireMultipleEnabledProperty' ),
        phetioDocumentation: `The fire-multi button is only enabled if the number of moving projectiles would not exceed ${ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES}.`,
        phetioValueType: BooleanIO
      }
    );
  }

  /**
   * @public
   */
  fireMultipleProjectiles() {
    super.fireNumProjectiles( this.groupSizeProperty.value );
  }

  /**
   * Steps the model forward in time using the created eventTimer
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
    super.step( dt );

    if ( this.isPlayingProperty.value && this.rapidFireModeProperty.value ) {
      const timeFactor =
        this.timeSpeedProperty.value === TimeSpeed.SLOW ? 0.33 : 1;
      this.timeSinceLastProjectile += timeFactor * dt;

      if ( this.timeSinceLastProjectile >= ProjectileMotionConstants.RAPID_FIRE_DELTA_TIME ) {
        super.fireNumProjectiles( 1 );
        this.timeSinceLastProjectile = 0;
      }
    }
  }

  /**
   * Reset these Properties
   * @public
   */
  reset() {
    this.timeSinceLastProjectile = 0;
    this.groupSizeProperty.reset();
    super.reset();
  }
}

projectileMotion.register( 'StatsModel', StatsModel );

export default StatsModel;
