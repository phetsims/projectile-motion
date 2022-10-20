// Copyright 2022, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 * @author Matthew Blackman(PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import projectileMotion from '../../projectileMotion.js';
import ClusterSizeSpinner from './ClusterSizeSpinner.js';

const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

class StatsControlPanel extends Panel {
  /**
   * @param {NumberProperty} clusterSizeProperty - the property for the number of simultaneously launched projectiles
   * @param {Object} [options]
   */
  constructor( clusterSizeProperty, viewProperties, options ) {
    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge(
      {},
      ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS,
      {
        align: 'left',
        tandem: Tandem.REQUIRED
      },
      options
    );

    // local var for layout and formatting
    const parameterLabelOptions = merge( {}, LABEL_OPTIONS, {
      maxWidth: options.minWidth - 2 * options.xMargin
    } );

    const clusterSizeText = new Text(
      'Cluster size:',
      merge(
        {
          tandem: options.tandem.createTandem( 'clusterSizeText' ),
          stringPropertyOptions: { phetioReadOnly: true }
        },
        parameterLabelOptions
      )
    );

    const clusterSizeSpinner = new ClusterSizeSpinner( clusterSizeProperty, {
      tandem: options.tandem.createTandem( 'projectileClusterSizeSpinner' ),
      phetioDocumentation:
        'Number spinner that selects how many projectiles are launched at the same time'
    } );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        new VBox( {
          spacing: options.controlsVerticalSpace,
          align: 'left',
          tandem: null,
          children: [
            clusterSizeText,
            clusterSizeSpinner
          ]
        } )
      ]
    } );

    super( content, options );
  }
}

projectileMotion.register( 'StatsControlPanel', StatsControlPanel );
export default StatsControlPanel;
