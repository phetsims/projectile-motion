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
import ComboBox from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import projectileMotion from '../../projectileMotion.js';

const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

class StatsControlPanel extends Panel {
  /**
   * @param {NumberProperty} groupSizeProperty - the property for the number of simultaneously launched projectiles
   * @param {Node} comboBoxListParent - node for containing the combo box
   * @param {Object} [options]
   */
  constructor( groupSizeProperty, comboBoxListParent, viewProperties, options ) {
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

    const groupSizeText = new Text(
      'Projectile group size:',
      merge(
        {
          tandem: options.tandem.createTandem( 'groupSizeText' ),
          stringPropertyOptions: { phetioReadOnly: true }
        },
        parameterLabelOptions
      )
    );

    const comboBoxLineWidth = 1;
    const comboBoxItems = [];
    const groupSizes = [ 5, 10, 20, 30, 40, 50 ];
    for ( let i = 0; i < groupSizes.length; i++ ) {
      const groupSize = groupSizes[ i ];
      comboBoxItems[ i ] = {
        value: groupSize,
        node:
          new Text( groupSize.toString(),
            merge(
              {
                tandem: options.tandem.createTandem( `groupSize${groupSize}BoxTextItem` ),
                stringPropertyOptions: { phetioReadOnly: true }
              },
              parameterLabelOptions
            )
          ),
        tandemName: `groupSize${groupSize}BoxItem`
      };
    }

    // create view for dropdown
    const groupSizeComboBox = new ComboBox(
      groupSizeProperty,
      comboBoxItems,
      comboBoxListParent,
      {
        xMargin: 12,
        yMargin: 7,
        cornerRadius: 4,
        buttonLineWidth: comboBoxLineWidth,
        listLineWidth: comboBoxLineWidth,
        tandem: options.tandem.createTandem( 'groupSizeComboBox' ),
        phetioDocumentation:
          'Combo box that selects number of simultaneously launched projectiles'
      }
    );

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
            groupSizeText,
            groupSizeComboBox
          ]
        } )
      ]
    } );

    super( content, options );

    this.groupSizeComboBox = groupSizeComboBox;
  }

  // @public for use by screen view
  hideComboBoxList() {
    this.groupSizeComboBox.hideListBox();
  }
}

projectileMotion.register( 'StatsControlPanel', StatsControlPanel );
export default StatsControlPanel;
