// Copyright 2022, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 * @author Matthew Blackman(PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import ArrowlessNumberControl from '../../common/view/ArrowlessNumberControl.js';
import projectileMotion from '../../projectileMotion.js';

class StatsControlPanel extends Panel {
  /**
   * @param {NumberProperty} groupSizeProperty - the property for the number of simultaneously launched projectiles
   * @param {Object} [options]
   */
  constructor( groupSizeProperty, viewProperties, options ) {
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

    const groupSizeIncrement = 5;

    // create group size number control
    const groupSizeNumberControl = new ArrowlessNumberControl(
      'Projectile group size:', '', groupSizeProperty,
      new Range( groupSizeIncrement, ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES ),
      groupSizeIncrement,
      {
        containerWidth: options.minWidth,
        xMargin: options.xMargin,
        numberDisplayMaxWidth: options.numberDisplayMaxWidth,
        tandem: options.tandem.createTandem( 'groupSizeNumberControl' ),
        phetioDocumentation: 'UI control to adjust the number of simultaneously launched projectiles'
      }
    );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        new VBox( {
          align: 'center',
          spacing: options.controlsVerticalSpace,
          children: [
            groupSizeNumberControl
          ]
        } )
      ]
    } );

    super( content, options );
  }
}

projectileMotion.register( 'StatsControlPanel', StatsControlPanel );
export default StatsControlPanel;
