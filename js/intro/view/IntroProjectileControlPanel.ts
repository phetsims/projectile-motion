// Copyright 2016-2025, University of Colorado Boulder

/**
 * Control panel that allows users to choose what kind of projectile to fire
 * and view the properties of this projectile.
 * Also includes a checkbox for air resistance.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import ProjectileMotionConstants, { ProjectileMotionUIOptions } from '../../common/ProjectileMotionConstants.js';
import AirResistanceControl from '../../common/view/AirResistanceControl.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import type ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

const diameterString = ProjectileMotionStrings.diameter;
const kgString = ProjectileMotionStrings.kg;
const massString = ProjectileMotionStrings.mass;
const mString = ProjectileMotionStrings.m;
const pattern0Value1UnitsWithSpaceString = ProjectileMotionStrings.pattern0Value1UnitsWithSpace;

// constants
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

type SelfOptions = EmptySelfOptions;
type IntroProjectileControlPanelOptions = SelfOptions & PanelOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class IntroProjectileControlPanel extends Panel {

  private projectileChoiceComboBox;

  public constructor( objectTypes: ProjectileObjectType[],
                      selectedProjectileObjectTypeProperty: Property<ProjectileObjectType>,
                      comboBoxListParent: Node,
                      projectileMassProperty: Property<number>,
                      projectileDiameterProperty: Property<number>,
                      projectileDragCoefficientProperty: Property<number>,
                      airResistanceOnProperty: BooleanProperty,
                      providedOptions: IntroProjectileControlPanelOptions ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    const options = optionize<IntroProjectileControlPanelOptions, SelfOptions, ProjectileMotionUIOptions>()(
      ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, providedOptions );

    // maxWidth of the labels within the dropdown empirically determined
    const itemNodeOptions = merge( {}, LABEL_OPTIONS, { maxWidth: 170 } );

    const firstItemNode = new VBox( {
      align: 'left',
      children: [
        new Text( objectTypes[ 0 ].name ?? '', itemNodeOptions )
      ]
    } );

    const comboBoxWidth = options.minWidth - 2 * options.xMargin;
    const itemXMargin = 6;
    const buttonXMargin = 10;
    const comboBoxLineWidth = 1;

    // first item contains horizontal strut that sets width of combo box
    const firstItemNodeWidth = comboBoxWidth -
                               itemXMargin -
                               0.5 * firstItemNode.height -
                               4 * buttonXMargin -
                               2 * itemXMargin -
                               2 * comboBoxLineWidth;
    firstItemNode.addChild( new HStrut( firstItemNodeWidth ) );

    const comboBoxItems = [];

    for ( let i = 0; i < objectTypes.length; i++ ) {
      const projectileType = objectTypes[ i ];
      assert && assert( projectileType.benchmark, 'benchmark needed for tandemName' );

      comboBoxItems[ i ] = {
        value: projectileType,
        createNode: () => ( i === 0 ) ? firstItemNode : new Text( projectileType.name ?? '', itemNodeOptions ),
        tandemName: `${projectileType.benchmark}Item`
      };
    }

    // create view for dropdown
    const projectileChoiceComboBox = new ComboBox( selectedProjectileObjectTypeProperty, comboBoxItems, comboBoxListParent, {
      xMargin: 12,
      yMargin: 7,
      cornerRadius: 4,
      buttonLineWidth: comboBoxLineWidth,
      listLineWidth: comboBoxLineWidth,
      tandem: options.tandem.createTandem( 'projectileChoiceComboBox' ),
      phetioDocumentation: 'Combo box that selects what projectile type to launch from the cannon'
    } );

    // local var for layout and formatting
    const parameterLabelOptions = merge( {}, LABEL_OPTIONS, { maxWidth: options.minWidth - 2 * options.xMargin } );

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     */
    function createReadout( labelString: string, unitsString: string, valueProperty: Property<number>, tandem: Tandem ): VBox {
      const parameterLabel = new Text( '', merge( {
        tandem: tandem,
        stringPropertyOptions: { phetioReadOnly: true }
      }, parameterLabelOptions ) );

      parameterLabel.setBoundsMethod( 'accurate' );

      valueProperty.link( value => {
        const valueReadout = unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
          value: value,
          units: unitsString
        } ) : toFixed( value, 2 );
        parameterLabel.setString( `${labelString}: ${valueReadout}` );
      } );

      return new VBox( {
        align: 'left',
        children: [ parameterLabel, new HStrut( parameterLabelOptions.maxWidth ) ]
      } );
    }

    const massText = createReadout(
      massString,
      kgString,
      projectileMassProperty,
      options.tandem.createTandem( 'massText' )
    );

    const diameterText = createReadout(
      diameterString,
      mString,
      projectileDiameterProperty,
      options.tandem.createTandem( 'diameterText' )
    );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        projectileChoiceComboBox,
        massText,
        diameterText,
        new HSeparator( { stroke: ProjectileMotionConstants.SEPARATOR_COLOR } ),
        new AirResistanceControl( airResistanceOnProperty, projectileDragCoefficientProperty, {
          labelOptions: LABEL_OPTIONS,
          minWidth: options.minWidth,
          xMargin: options.xMargin,
          spacing: options.controlsVerticalSpace,
          tandem: options.tandem.createTandem( 'airResistanceControl' )
        } )
      ]
    } );

    super( content, options );

    this.projectileChoiceComboBox = projectileChoiceComboBox;
  }

  public hideComboBoxList(): void {
    this.projectileChoiceComboBox.hideListBox();
  }
}

projectileMotion.register( 'IntroProjectileControlPanel', IntroProjectileControlPanel );
export default IntroProjectileControlPanel;