// Copyright 2016-2025, University of Colorado Boulder

/**
 * Model for the measuring tape in projectile motion.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectileMotion from '../../projectileMotion.js';

class ProjectileMotionMeasuringTape {
  public readonly basePositionProperty: Property<Vector2>;
  public readonly tipPositionProperty: Property<Vector2>;
  public readonly isActiveProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {
    this.basePositionProperty = new Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'basePositionProperty' ),
      units: 'm',
      phetioValueType: Vector2.Vector2IO,
      phetioDocumentation: 'Base (start of tape from the container) position'
    } );

    this.tipPositionProperty = new Property( new Vector2( 1, 0 ), {
      tandem: tandem.createTandem( 'tipPositionProperty' ),
      units: 'm',
      phetioValueType: Vector2.Vector2IO,
      phetioDocumentation: 'Tip (end of measuring tape) position'
    } );

    this.isActiveProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isActiveProperty' ),
      phetioDocumentation: 'Whether the measuring tape is out in the play area (false when in the toolbox)'
    } );
  }

  /**
   * Reset these Properties
   */
  public reset(): void {
    this.basePositionProperty.reset();
    this.tipPositionProperty.reset();
    this.isActiveProperty.reset();
  }
}

projectileMotion.register( 'ProjectileMotionMeasuringTape', ProjectileMotionMeasuringTape );

export default ProjectileMotionMeasuringTape;