// Copyright 2020-2021, University of Colorado Boulder

/**
 * ClusterSizeSpinner is the spinner used to set the number of simultaneous projectiles launched in the projectile motion.
 * It appears in the 'Stats' screen's control panel.
 *
 * @author Matthew Blackman
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import projectileMotion from '../../projectileMotion.js';

class ClusterSizeSpinner extends NumberSpinner {

  /**
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {Object} [options]
   */
  constructor( clusterSizeProperty, options ) {

    assert && assert( clusterSizeProperty instanceof NumberProperty );

    options = merge( {

      // NumberSpinner options
      arrowsPosition: 'leftRight',
      numberDisplayOptions: {
        align: 'center',
        xMargin: 8,
        yMargin: 2,
        cornerRadius: 3,
        textOptions: {
          font: new PhetFont( 14 )
        }
      },
      touchAreaXDilation: 25,
      touchAreaYDilation: 12,
      mouseAreaXDilation: 5,
      mouseAreaYDilation: 5
    }, options );

    super( clusterSizeProperty, clusterSizeProperty.rangeProperty, options );
  }
}

projectileMotion.register( 'ClusterSizeSpinner', ClusterSizeSpinner );
export default ClusterSizeSpinner;