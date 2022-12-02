// Copyright 2019-2022, University of Colorado Boulder

/**
 * A data type for the projectile on a Trajectory
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import projectileMotion from '../../projectileMotion.js';
import DataPoint from './DataPoint.js';

class ProjectileObject {

  /**
   * @param {DataPoint} currentDataPoint - the data point that this projectile object is currently at on its trajectory.
   */
  constructor( currentDataPoint ) {
    // Doesn't need PhET-iO instrumentation because it is redundant with Trajectory.dataPoints.
    this.dataPointProperty = new Property( currentDataPoint, {
      phetioValueType: DataPoint.DataPointIO
    } );
  }
}

projectileMotion.register( 'ProjectileObject', ProjectileObject );
export default ProjectileObject;