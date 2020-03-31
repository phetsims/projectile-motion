// Copyright 2016-2020, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import projectileMotionStrings from '../../projectileMotionStrings.js';
import projectileMotion from '../../projectileMotion.js';

const accelerationVectorsString = projectileMotionStrings.accelerationVectors;
const componentsString = projectileMotionStrings.components;
const totalString = projectileMotionStrings.total;
const velocityVectorsString = projectileMotionStrings.velocityVectors;

// constants
const TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
const VELOCITY_VECTOR_ICON = ProjectileMotionConstants.VELOCITY_VECTOR_ICON;
const ACCELERATION_VECTOR_ICON = ProjectileMotionConstants.ACCELERATION_VECTOR_ICON;

/**
 * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown
 * @param {Object} [options]
 * @constructor
 */
function IntroVectorsControlPanel( vectorVisibilityProperties, options ) {

  // The first object is a placeholder so none of the others get mutated
  // The second object is the default, in the constants files
  // The third object is options specific to this panel, which overrides the defaults
  // The fourth object is options given at time of construction, which overrides all the others
  options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
    align: 'left',
    tandem: Tandem.REQUIRED
  }, options );

  const titleOptions = merge( {}, TITLE_OPTIONS, {
    maxWidth: options.minWidth - 3 * options.xMargin - VELOCITY_VECTOR_ICON.width
  } );
  const velocityVectorsTitle = new Text( velocityVectorsString, titleOptions );
  const velocityTitleBox = new HBox( {
    spacing: options.xMargin,
    children: [
      velocityVectorsTitle,
      new Node( { children: [ VELOCITY_VECTOR_ICON ] } )
    ],
    tandem: options.tandem.createTandem( 'velocityVectorsTitleNode' )
  } );

  const checkboxOptions = { maxWidth: titleOptions.maxWidth, boxWidth: 18 };
  const totalVelocityLabel = new Text( totalString, LABEL_OPTIONS );
  const totalVelocityCheckbox = new Checkbox(
    totalVelocityLabel,
    vectorVisibilityProperties.totalVelocityVectorOnProperty,
    merge( { tandem: options.tandem.createTandem( 'totalVelocityCheckbox' ) }, checkboxOptions )
  );

  const componentsVelocityLabel = new Text( componentsString, LABEL_OPTIONS );
  const componentsVelocityCheckbox = new Checkbox(
    componentsVelocityLabel,
    vectorVisibilityProperties.componentsVelocityVectorsOnProperty,
    merge( { tandem: options.tandem.createTandem( 'componentsVelocityCheckbox' ) }, checkboxOptions )
  );

  const accelerationVectorsTitle = new Text( accelerationVectorsString, titleOptions );
  const accelerationTitleBox = new HBox( {
    spacing: options.xMargin,
    children: [
      accelerationVectorsTitle,
      new Node( { children: [ ACCELERATION_VECTOR_ICON ] } )
    ],
    tandem: options.tandem.createTandem( 'accelerationVectorsTitleNode' )
  } );

  const totalAccelerationLabel = new Text( totalString, LABEL_OPTIONS );
  const totalAccelerationCheckbox = new Checkbox(
    totalAccelerationLabel,
    vectorVisibilityProperties.totalAccelerationVectorOnProperty,
    merge( { tandem: options.tandem.createTandem( 'totalAccelerationCheckbox' ) }, checkboxOptions )
  );

  const componentsAccelerationLabel = new Text( componentsString, LABEL_OPTIONS );
  const componentsAccelerationCheckbox = new Checkbox(
    componentsAccelerationLabel,
    vectorVisibilityProperties.componentsAccelerationVectorsOnProperty,
    merge( { tandem: options.tandem.createTandem( 'componentsAccelerationCheckbox' ) }, checkboxOptions )
  );

  // The contents of the control panel
  const content = new VBox( {
    align: 'left',
    spacing: options.controlsVerticalSpace,
    children: [
      velocityTitleBox,
      totalVelocityCheckbox,
      componentsVelocityCheckbox,
      accelerationTitleBox,
      totalAccelerationCheckbox,
      componentsAccelerationCheckbox
    ]
  } );

  Panel.call( this, content, options );
}

projectileMotion.register( 'IntroVectorsControlPanel', IntroVectorsControlPanel );

inherit( Panel, IntroVectorsControlPanel );
export default IntroVectorsControlPanel;