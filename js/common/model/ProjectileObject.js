// Copyright 2019-2022, University of Colorado Boulder

/**
 * A data type for the projectile on a Trajectory
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import projectileMotion from '../../projectileMotion.js';
import DataPoint from './DataPoint.js';

class ProjectileObject {

  /**
   * @param {number} index - incremented as more projectiles are added to the Trajectory this projectile object is on.
   * @param {DataPoint} currentDataPoint - the data point that this projectile object is currently at on its trajectory.
   */
  constructor( index, currentDataPoint ) {

    // @public
    this.index = index;

    // Doesn't need PhET-iO instrumentation. Note, that all monitoring of this Property
    // should recognize that this data type is destroyed each time PhET-iO state is set for its Trajectory. see notes
    // in ProjectileObjectIO.toStateObject()
    this.dataPointProperty = new Property( currentDataPoint, {
      phetioValueType: DataPoint.DataPointIO,
      phetioDocumentation: 'Data point that the ProjectileObject is currently at. ' +
                           'See DataPointIO for more information about the data point value.'

    } );
  }
}

ProjectileObject.ProjectileObjectIO = new IOType( 'ProjectileObjectIO', {
  valueType: ProjectileObject,
  documentation: 'A data type for a projectile object travelling on a projectile\'s trajectory',
  stateSchema: {
    index: NumberIO,
    dataPoint: DataPoint.DataPointIO
  },
  toStateObject: projectileObject => ( {
    index: projectileObject.index,

    // Even though this is a Property, serialize it via this IO Type so that ProjectileObject uses data type instead
    // of reference type serialization. This works because the list of ProjectileObjects is within a PhetioGroup of
    // dynamic Trajectories, so the Property doesn't need to be instrumented to still keep proper links
    dataPoint: DataPoint.DataPointIO.toStateObject( projectileObject.dataPointProperty.value )
  } ),
  fromStateObject: stateObject => new ProjectileObject(
    stateObject.index,
    DataPoint.DataPointIO.fromStateObject( stateObject.dataPoint )
  )
} );

projectileMotion.register( 'ProjectileObject', ProjectileObject );
export default ProjectileObject;