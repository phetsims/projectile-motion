// Copyright 2016-2025, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants, { ProjectileMotionUIOptions } from '../../common/ProjectileMotionConstants.js';
import VectorsDisplayEnumeration from '../../common/view/VectorsDisplayEnumeration.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VectorsViewProperties from './VectorsViewProperties.js';

const accelerationVectorsString = ProjectileMotionStrings.accelerationVectors;
const componentsString = ProjectileMotionStrings.components;
const forceVectorsString = ProjectileMotionStrings.forceVectors;
const totalString = ProjectileMotionStrings.total;
const velocityVectorsString = ProjectileMotionStrings.velocityVectors;

// constants
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
const VELOCITY_VECTOR_ICON = ProjectileMotionConstants.VELOCITY_VECTOR_ICON;
const ACCELERATION_VECTOR_ICON = ProjectileMotionConstants.ACCELERATION_VECTOR_ICON;
const FORCE_VECTOR_ICON = ProjectileMotionConstants.FORCE_VECTOR_ICON;

type SelfOptions = EmptySelfOptions;
type VectorsVectorsControlPanelOptions = SelfOptions & ProjectileMotionUIOptions;

class VectorsVectorsControlPanel extends Panel {

  public constructor( viewProperties: VectorsViewProperties, providedOptions: VectorsVectorsControlPanelOptions ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    const options = optionize<VectorsVectorsControlPanelOptions, SelfOptions, PanelOptions>()(
      combineOptions<VectorsVectorsControlPanelOptions>( ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
        align: 'left',
        tandem: Tandem.REQUIRED
      } ), providedOptions );

    const checkboxOptions = {
      maxWidth: options.minWidth - 3 * options.xMargin - VELOCITY_VECTOR_ICON.width,
      boxWidth: 18
    };

    const vectorsDisplayRadioButtonGroup = new VerticalAquaRadioButtonGroup( viewProperties.vectorsDisplayProperty, [ {
      createNode: () => new Text( totalString, LABEL_OPTIONS ),
      tandemName: 'totalRadioButton',
      value: VectorsDisplayEnumeration.TOTAL
    }, {
      createNode: () => new Text( componentsString, LABEL_OPTIONS ),
      tandemName: 'componentsRadioButton',
      value: VectorsDisplayEnumeration.COMPONENTS
    } ], {
      radioButtonOptions: { radius: 8 },
      spacing: 10,     // vertical spacing between each radio button
      touchAreaXDilation: 5,
      maxWidth: checkboxOptions.maxWidth,
      tandem: options.tandem.createTandem( 'vectorsDisplayRadioButtonGroup' ),
      phetioDocumentation: 'Radio button group to select what type of vectors are displayed with a flying projectile'
    } );

    const velocityLabel = new Text( velocityVectorsString, LABEL_OPTIONS );
    const velocityCheckboxContent = new HBox( {
      spacing: options.xMargin,
      children: [
        velocityLabel,
        new Node( { children: [ VELOCITY_VECTOR_ICON ] } ) // so that HBox transforms the intermediary Node
      ]
    } );
    const velocityCheckbox = new Checkbox( viewProperties.velocityVectorsOnProperty, velocityCheckboxContent, combineOptions<CheckboxOptions>( { tandem: options.tandem.createTandem( 'velocityCheckbox' ) }, checkboxOptions ) );

    const accelerationLabel = new Text( accelerationVectorsString, LABEL_OPTIONS );
    const accelerationCheckboxContent = new HBox( {
      spacing: options.xMargin,
      children: [
        accelerationLabel,
        new Node( { children: [ ACCELERATION_VECTOR_ICON ] } ) // so that HBox transforms the intermediary Node
      ]
    } );
    const accelerationCheckbox = new Checkbox( viewProperties.accelerationVectorsOnProperty, accelerationCheckboxContent, combineOptions<CheckboxOptions>( { tandem: options.tandem.createTandem( 'accelerationCheckbox' ) }, checkboxOptions ) );

    const forceLabel = new Text( forceVectorsString, LABEL_OPTIONS );
    const forceCheckboxContent = new HBox( {
      spacing: options.xMargin,
      children: [
        forceLabel,
        new Node( { children: [ FORCE_VECTOR_ICON ] } ) // so that HBox transforms the intermediary Node
      ]
    } );
    const forceCheckbox = new Checkbox( viewProperties.forceVectorsOnProperty, forceCheckboxContent, combineOptions<CheckboxOptions>( { tandem: options.tandem.createTandem( 'forceCheckbox' ) }, checkboxOptions ) );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        vectorsDisplayRadioButtonGroup,
        velocityCheckbox,
        accelerationCheckbox,
        forceCheckbox
      ]
    } );

    super( content, options );
  }
}

projectileMotion.register( 'VectorsVectorsControlPanel', VectorsVectorsControlPanel );
export default VectorsVectorsControlPanel;