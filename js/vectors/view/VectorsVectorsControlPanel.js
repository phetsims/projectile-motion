// Copyright 2016-2020, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import VectorsDisplayEnumeration from '../../common/view/VectorsDisplayEnumeration.js';
import projectileMotionStrings from '../../projectileMotionStrings.js';
import projectileMotion from '../../projectileMotion.js';

const accelerationVectorsString = projectileMotionStrings.accelerationVectors;
const componentsString = projectileMotionStrings.components;
const forceVectorsString = projectileMotionStrings.forceVectors;
const totalString = projectileMotionStrings.total;
const velocityVectorsString = projectileMotionStrings.velocityVectors;

// constants
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
const VELOCITY_VECTOR_ICON = ProjectileMotionConstants.VELOCITY_VECTOR_ICON;
const ACCELERATION_VECTOR_ICON = ProjectileMotionConstants.ACCELERATION_VECTOR_ICON;
const FORCE_VECTOR_ICON = ProjectileMotionConstants.FORCE_VECTOR_ICON;

/**
 * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown
 * @param {Object} [options]
 * @constructor
 */
function VectorsVectorsControlPanel( vectorVisibilityProperties, options ) {

  // The first object is a placeholder so none of the others get mutated
  // The second object is the default, in the constants files
  // The third object is options specific to this panel, which overrides the defaults
  // The fourth object is options given at time of construction, which overrides all the others
  options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
    align: 'left',
    tandem: Tandem.REQUIRED
  }, options );

  const checkboxOptions = {
    maxWidth: options.minWidth - 3 * options.xMargin - VELOCITY_VECTOR_ICON.width,
    boxWidth: 18
  };

  const totalLabel = new Text( totalString, LABEL_OPTIONS );
  const componentsLabel = new Text( componentsString, LABEL_OPTIONS );

  const totalOrComponentsRadioButtonGroup = new VerticalAquaRadioButtonGroup( vectorVisibilityProperties.vectorsDisplayProperty, [ {
    node: totalLabel,
    tandemName: 'totalRadioButton',
    value: VectorsDisplayEnumeration.TOTAL
  }, {
    node: componentsLabel,
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
  const velocityCheckbox = new Checkbox( velocityCheckboxContent, vectorVisibilityProperties.velocityVectorsOnProperty,
    merge( { tandem: options.tandem.createTandem( 'velocityCheckbox' ) }, checkboxOptions )
  );

  const accelerationLabel = new Text( accelerationVectorsString, LABEL_OPTIONS );
  const accelerationCheckboxContent = new HBox( {
    spacing: options.xMargin,
    children: [
      accelerationLabel,
      new Node( { children: [ ACCELERATION_VECTOR_ICON ] } ) // so that HBox transforms the intermediary Node
    ]
  } );
  const accelerationCheckbox = new Checkbox( accelerationCheckboxContent,
    vectorVisibilityProperties.accelerationVectorsOnProperty,
    merge( { tandem: options.tandem.createTandem( 'accelerationCheckbox' ) }, checkboxOptions )
  );

  const forceLabel = new Text( forceVectorsString, LABEL_OPTIONS );
  const forceCheckboxContent = new HBox( {
    spacing: options.xMargin,
    children: [
      forceLabel,
      new Node( { children: [ FORCE_VECTOR_ICON ] } ) // so that HBox transforms the intermediary Node
    ]
  } );
  const forceCheckbox = new Checkbox( forceCheckboxContent, vectorVisibilityProperties.forceVectorsOnProperty,
    merge( { tandem: options.tandem.createTandem( 'forceCheckbox' ) }, checkboxOptions )
  );

  // The contents of the control panel
  const content = new VBox( {
    align: 'left',
    spacing: options.controlsVerticalSpace,
    children: [
      totalOrComponentsRadioButtonGroup,
      velocityCheckbox,
      accelerationCheckbox,
      forceCheckbox
    ]
  } );

  Panel.call( this, content, options );
}

projectileMotion.register( 'VectorsVectorsControlPanel', VectorsVectorsControlPanel );

inherit( Panel, VectorsVectorsControlPanel );
export default VectorsVectorsControlPanel;