// Copyright 2019, University of Colorado Boulder

/**
 * IO type for ProjectileObject
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DataPointIO = require( 'PROJECTILE_MOTION/common/model/DataPointIO' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileObject = require( 'PROJECTILE_MOTION/common/model/ProjectileObject' );
  const validate = require( 'AXON/validate' );

  class ProjectileObjectIO extends ObjectIO {

    /**
     * @param {ProjectileObject} projectileObject
     * @returns {Object}
     * @override
     */
    static toStateObject( projectileObject ) {
      validate( projectileObject, this.validator );
      return {
        index: NumberIO.toStateObject( projectileObject.index ),

        // Even though this is a Property, serialize it via this IO type so that ProjectileObject uses data type instead
        // of reference type serialization. This works because the list of ProjectileObjects is within a PhetioGroup of
        // dynamic Trajectories, so the Property doesn't need to be instrumented to still keep proper links
        dataPoint: DataPointIO.toStateObject( projectileObject.dataPointProperty.value )
      };
    }

    /**
     * @param {Object} stateObject
     * @returns {Object}
     * @override
     */
    static fromStateObject( stateObject ) {
      return new ProjectileObject(
        NumberIO.fromStateObject( stateObject.index ),
        DataPointIO.fromStateObject( stateObject.dataPoint )
      );
    }
  }

  ProjectileObjectIO.documentation = 'A data type for a projectile object travelling on a projectile\'s trajectory';
  ProjectileObjectIO.validator = { isValidValue: v => v instanceof phet.projectileMotion.ProjectileObject };
  ProjectileObjectIO.typeName = 'ProjectileObjectIO';
  ObjectIO.validateSubtype( ProjectileObjectIO );

  return projectileMotion.register( 'ProjectileObjectIO', ProjectileObjectIO );
} );
