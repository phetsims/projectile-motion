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
import Checkbox from '../../../../sun/js/Checkbox.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import ArrowlessNumberControl from '../../common/view/ArrowlessNumberControl.js';
import projectileMotion from '../../projectileMotion.js';

class StatsControlPanel extends Panel {
  /**
   * @param {NumberProperty} groupSizeProperty - the property for the number of simultaneously launched projectiles
   * @param {Object} [options]
   */
  constructor( groupSizeProperty, rapidFireModeProperty, viewProperties, options ) {
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

    // create group size number control
    const groupSizeNumberControl = new ArrowlessNumberControl(
      ProjectileMotionStrings.projectileGroupSize, '', groupSizeProperty,
      new Range( ProjectileMotionConstants.GROUP_SIZE_INCREMENT, ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES ),
      ProjectileMotionConstants.GROUP_SIZE_INCREMENT,
      {
        containerWidth: options.minWidth,
        xMargin: options.xMargin,
        numberDisplayMaxWidth: options.numberDisplayMaxWidth,
        tandem: options.tandem.createTandem( 'groupSizeNumberControl' ),
        phetioDocumentation: 'UI control to adjust the number of simultaneously launched projectiles'
      }
    );

    const titleOptions = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
    const checkboxOptions = { maxWidth: titleOptions.maxWidth, boxWidth: 18 };
    const rapidFireModeLabel = new Text( 'Rapid fire', ProjectileMotionConstants.LABEL_TEXT_OPTIONS );
    const rapidFireModeCheckbox = new Checkbox( rapidFireModeProperty, rapidFireModeLabel,
      merge( { tandem: options.tandem.createTandem( 'totalCheckbox' ) }, checkboxOptions )
    );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        new VBox( {
          align: 'left',
          spacing: options.controlsVerticalSpace,
          children: [
            groupSizeNumberControl,
            rapidFireModeCheckbox
          ]
        } )
      ]
    } );

    super( content, options );
  }
}

projectileMotion.register( 'StatsControlPanel', StatsControlPanel );
export default StatsControlPanel;
