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
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

class StatsModel extends ProjectileMotionModel {

  private objectTypes: ProjectileObjectType[];
  private timeSinceLastProjectile: number;
  public groupSizeProperty: Property<number>;
  public readonly fireMultipleEnabledProperty: TReadOnlyProperty<boolean>;

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

    super( objectTypes[ 0 ], false, objectTypes, tandem, {
      maxProjectiles: ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES_STATS,
      defaultCannonHeight: 2,
      defaultCannonAngle: 60,
      defaultInitialSpeed: 15,
      defaultSpeedStandardDeviation: 1,
      defaultAngleStandardDeviation: 2,
      targetX: ProjectileMotionConstants.TARGET_X_STATS,
      phetioInstrumentAltitudeProperty: false
    } );

    this.objectTypes = objectTypes;
    this.timeSinceLastProjectile = 0;

    this.groupSizeProperty = new NumberProperty(
      ProjectileMotionConstants.GROUP_SIZE_DEFAULT,
      {
        tandem: tandem.createTandem( 'groupSizeProperty' ),
        phetioDocumentation: 'Number of simultaneous projectiles launched',
        units: '',
        range: new Range( ProjectileMotionConstants.GROUP_SIZE_INCREMENT, ProjectileMotionConstants.GROUP_SIZE_MAX )
      }
    );

    this.fireMultipleEnabledProperty = new DerivedProperty(
      [ this.numberOfMovingProjectilesProperty, this.groupSizeProperty, this.rapidFireModeProperty ],
      ( numMoving, groupSize, rapidFireMode ) =>
        !rapidFireMode && numMoving + groupSize <= ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES_STATS,
      {
        tandem: tandem.createTandem( 'fireMultipleEnabledProperty' ),
        phetioDocumentation: `The fire-multi button is only enabled if the number of moving projectiles would not exceed ${ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES_STATS}.`,
        phetioValueType: BooleanIO
      }
    );
  }

  public fireMultipleProjectiles(): void {
    super.fireNumProjectiles( this.groupSizeProperty.value );
  }

  public override step( dt: number ): void {
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
   */
  public override reset() : void {
    this.timeSinceLastProjectile = 0;
    this.groupSizeProperty.reset();
    super.reset();
  }
}

projectileMotion.register( 'StatsModel', StatsModel );

export default StatsModel;
