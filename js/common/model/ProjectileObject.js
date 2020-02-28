// Copyright 2019-2020, University of Colorado Boulder

/**
 * A data type for the projectile on a Trajectory
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import projectileMotion from '../../projectileMotion.js';
import DataPointIO from './DataPointIO.js';

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
      phetioType: PropertyIO( DataPointIO )
    } );
  }
}

projectileMotion.register( 'ProjectileObject', ProjectileObject );
export default ProjectileObject;