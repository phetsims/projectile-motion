// Copyright 2016-2022, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';

const accelerationVectorsString = ProjectileMotionStrings.accelerationVectors;
const componentsString = ProjectileMotionStrings.components;
const totalString = ProjectileMotionStrings.total;
const velocityVectorsString = ProjectileMotionStrings.velocityVectors;

// constants
const TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
const VELOCITY_VECTOR_ICON = ProjectileMotionConstants.VELOCITY_VECTOR_ICON;
const ACCELERATION_VECTOR_ICON = ProjectileMotionConstants.ACCELERATION_VECTOR_ICON;

class IntroVectorsControlPanel extends Panel {

  /**
   * @param {ProjectileMotionViewProperties} viewProperties - Properties that determine which vectors are shown
   * @param {Object} [options]
   */
  constructor( viewProperties, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
      align: 'left',
      tandem: Tandem.REQUIRED
    }, options );

    const velocityVectorsTandem = options.tandem.createTandem( 'velocityVectors' );
    const accelerationVectorsTandem = options.tandem.createTandem( 'accelerationVectors' );

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
      tandem: velocityVectorsTandem.createTandem( 'titleNode' )
    } );

    const checkboxOptions = { maxWidth: titleOptions.maxWidth, boxWidth: 18 };
    const totalVelocityLabel = new Text( totalString, LABEL_OPTIONS );
    const totalVelocityCheckbox = new Checkbox( viewProperties.totalVelocityVectorOnProperty, totalVelocityLabel, merge( { tandem: velocityVectorsTandem.createTandem( 'totalCheckbox' ) }, checkboxOptions ) );

    const componentsVelocityLabel = new Text( componentsString, LABEL_OPTIONS );
    const componentsVelocityCheckbox = new Checkbox( viewProperties.componentsVelocityVectorsOnProperty, componentsVelocityLabel, merge( { tandem: velocityVectorsTandem.createTandem( 'componentsCheckbox' ) }, checkboxOptions ) );

    const accelerationVectorsTitle = new Text( accelerationVectorsString, titleOptions );
    const accelerationTitleBox = new HBox( {
      spacing: options.xMargin,
      children: [
        accelerationVectorsTitle,
        new Node( { children: [ ACCELERATION_VECTOR_ICON ] } )
      ],
      tandem: accelerationVectorsTandem.createTandem( 'titleNode' )
    } );

    const totalAccelerationLabel = new Text( totalString, LABEL_OPTIONS );
    const totalAccelerationCheckbox = new Checkbox( viewProperties.totalAccelerationVectorOnProperty, totalAccelerationLabel, merge( { tandem: accelerationVectorsTandem.createTandem( 'totalCheckbox' ) }, checkboxOptions ) );

    const componentsAccelerationLabel = new Text( componentsString, LABEL_OPTIONS );
    const componentsAccelerationCheckbox = new Checkbox( viewProperties.componentsAccelerationVectorsOnProperty, componentsAccelerationLabel, merge( { tandem: accelerationVectorsTandem.createTandem( 'componentsCheckbox' ) }, checkboxOptions ) );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        new VBox( {
          spacing: options.controlsVerticalSpace,
          align: 'left',
          tandem: velocityVectorsTandem,
          children: [
            velocityTitleBox,
            totalVelocityCheckbox,
            componentsVelocityCheckbox
          ]
        } ),
        new VBox( {
          align: 'left',
          spacing: options.controlsVerticalSpace,
          tandem: accelerationVectorsTandem,
          children: [
            accelerationTitleBox,
            totalAccelerationCheckbox,
            componentsAccelerationCheckbox
          ]
        } )
      ]
    } );

    super( content, options );
  }
}

projectileMotion.register( 'IntroVectorsControlPanel', IntroVectorsControlPanel );
export default IntroVectorsControlPanel;