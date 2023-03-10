// Copyright 2016-2023, University of Colorado Boulder

/**
 * Model for the measuring tape in projectile motion.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectileMotion from '../../projectileMotion.js';

class ProjectileMotionMeasuringTape {

  public readonly basePositionProperty: Vector2Property;
  public readonly tipPositionProperty: Vector2Property;
  public readonly isActiveProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {
    this.basePositionProperty = new Vector2Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'basePositionProperty' ),
      units: 'm',
      phetioDocumentation: 'Base (start of tape from the container) position'
    } );

    this.tipPositionProperty = new Vector2Property( new Vector2( 1, 0 ), {
      tandem: tandem.createTandem( 'tipPositionProperty' ),
      units: 'm',
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