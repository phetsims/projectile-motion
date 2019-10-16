// Copyright 2019, University of Colorado Boulder

/**
 * IO type for Trajectory
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const validate = require( 'AXON/validate' );

  class TrajectoryIO extends ObjectIO {

    /**
     * @param {Trajectory} trajectory
     * @returns {Object}
     * @override
     */
    static toStateObject( trajectory ) {
      validate( trajectory, this.validator );
      return {
        mass: trajectory.mass,
        diameter: trajectory.diameter,
        dragCoefficient: trajectory.dragCoefficient
      };
    }
  }

  TrajectoryIO.documentation = 'A trajectory outlining the projectil\'s path';
  TrajectoryIO.validator = { isValidValue: v => v instanceof phet.projectileMotion.Trajectory };
  TrajectoryIO.typeName = 'TrajectoryIO';
  ObjectIO.validateSubtype( TrajectoryIO );

  return projectileMotion.register( 'TrajectoryIO', TrajectoryIO );
} );
