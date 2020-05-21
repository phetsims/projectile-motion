// Copyright 2019-2020, University of Colorado Boulder

/**
 * IO type for ProjectileObject
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import projectileMotion from '../../projectileMotion.js';
import DataPointIO from './DataPointIO.js';
import ProjectileObject from './ProjectileObject.js';

class ProjectileObjectIO extends ObjectIO {

  /**
   * @param {ProjectileObject} projectileObject
   * @returns {Object}
   * @override
   * @public
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
   * @public
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

projectileMotion.register( 'ProjectileObjectIO', ProjectileObjectIO );
export default ProjectileObjectIO;