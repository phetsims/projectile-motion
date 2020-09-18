// Copyright 2019-2020, University of Colorado Boulder

/**
 * IO Type for ProjectileObject
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import projectileMotion from '../../projectileMotion.js';
import DataPointIO from './DataPointIO.js';
import ProjectileObject from './ProjectileObject.js';

const ProjectileObjectIO = new IOType( 'ProjectileObjectIO', {
  isValidValue: v => v instanceof phet.projectileMotion.ProjectileObject,
  documentation: 'A data type for a projectile object travelling on a projectile\'s trajectory',

  toStateObject: projectileObject => ( {
    index: NumberIO.toStateObject( projectileObject.index ),

    // Even though this is a Property, serialize it via this IO Type so that ProjectileObject uses data type instead
    // of reference type serialization. This works because the list of ProjectileObjects is within a PhetioGroup of
    // dynamic Trajectories, so the Property doesn't need to be instrumented to still keep proper links
    dataPoint: DataPointIO.toStateObject( projectileObject.dataPointProperty.value )
  } ),

  /**
   * @param {Object} stateObject
   * @returns {Object}
   * @override
   * @public
   */
  fromStateObject( stateObject ) {
    return new ProjectileObject(
      NumberIO.fromStateObject( stateObject.index ),
      DataPointIO.fromStateObject( stateObject.dataPoint )
    );
  }
} );

projectileMotion.register( 'ProjectileObjectIO', ProjectileObjectIO );
export default ProjectileObjectIO;