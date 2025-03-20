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
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants, { ProjectileMotionUIOptions } from '../../common/ProjectileMotionConstants.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileMotionViewProperties from '../../common/view/ProjectileMotionViewProperties.js';

const accelerationVectorsString = ProjectileMotionStrings.accelerationVectors;
const componentsString = ProjectileMotionStrings.components;
const totalString = ProjectileMotionStrings.total;
const velocityVectorsString = ProjectileMotionStrings.velocityVectors;

// constants
const TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
const VELOCITY_VECTOR_ICON = ProjectileMotionConstants.VELOCITY_VECTOR_ICON;
const ACCELERATION_VECTOR_ICON = ProjectileMotionConstants.ACCELERATION_VECTOR_ICON;

type SelfOptions = EmptySelfOptions;
type IntroVectorsControlPanelOptions = SelfOptions & PanelOptions;

class IntroVectorsControlPanel extends Panel {

  public constructor( viewProperties: ProjectileMotionViewProperties, providedOptions: IntroVectorsControlPanelOptions ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    const options = optionize<IntroVectorsControlPanelOptions, SelfOptions, ProjectileMotionUIOptions>()(
      combineOptions<ProjectileMotionUIOptions>( ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
        align: 'left',
        tandem: Tandem.REQUIRED
      } ), providedOptions );

    const velocityVectorsTandem = options.tandem.createTandem( 'velocityVectors' );
    const accelerationVectorsTandem = options.tandem.createTandem( 'accelerationVectors' );

    const titleOptions = combineOptions<TextOptions>( TITLE_OPTIONS, {
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
    const totalVelocityCheckbox = new Checkbox( viewProperties.totalVelocityVectorOnProperty, totalVelocityLabel, combineOptions<CheckboxOptions>( { tandem: velocityVectorsTandem.createTandem( 'totalCheckbox' ) }, checkboxOptions ) );

    const componentsVelocityLabel = new Text( componentsString, LABEL_OPTIONS );
    const componentsVelocityCheckbox = new Checkbox( viewProperties.componentsVelocityVectorsOnProperty, componentsVelocityLabel, combineOptions<CheckboxOptions>( { tandem: velocityVectorsTandem.createTandem( 'componentsCheckbox' ) }, checkboxOptions ) );

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
    const totalAccelerationCheckbox = viewProperties.totalAccelerationVectorOnProperty ?
                                      new Checkbox( viewProperties.totalAccelerationVectorOnProperty, totalAccelerationLabel, combineOptions<CheckboxOptions>( { tandem: accelerationVectorsTandem.createTandem( 'totalCheckbox' ) }, checkboxOptions ) )
                                                                                       : null;

    const componentsAccelerationLabel = new Text( componentsString, LABEL_OPTIONS );
    const componentsAccelerationCheckbox = viewProperties.componentsAccelerationVectorsOnProperty ?
                                           new Checkbox( viewProperties.componentsAccelerationVectorsOnProperty, componentsAccelerationLabel, combineOptions<CheckboxOptions>( { tandem: accelerationVectorsTandem.createTandem( 'componentsCheckbox' ) }, checkboxOptions ) )
                                                                                                  : null;

    const accelerationControlsChildren: Node[] = [ accelerationTitleBox ];

    if ( totalAccelerationCheckbox !== null ) {
      accelerationControlsChildren.push( totalAccelerationCheckbox );
    }

    if ( componentsAccelerationCheckbox !== null ) {
      accelerationControlsChildren.push( componentsAccelerationCheckbox );
    }

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
          children: accelerationControlsChildren
        } )
      ]
    } );

    super( content, options );
  }
}

projectileMotion.register( 'IntroVectorsControlPanel', IntroVectorsControlPanel );
export default IntroVectorsControlPanel;