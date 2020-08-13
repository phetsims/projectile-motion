// Copyright 2016-2020, University of Colorado Boulder

/**
 * Control panel that allows users to choose what kind of projectile to fire
 * and view the properties of this projectile.
 * Also includes a checkbox for turning on and off air resistance.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import AirResistanceControl from '../../common/view/AirResistanceControl.js';
import projectileMotion from '../../projectileMotion.js';
import projectileMotionStrings from '../../projectileMotionStrings.js';

const diameterString = projectileMotionStrings.diameter;
const kgString = projectileMotionStrings.kg;
const massString = projectileMotionStrings.mass;
const mString = projectileMotionStrings.m;
const pattern0Value1UnitsWithSpaceString = projectileMotionStrings.pattern0Value1UnitsWithSpace;

// constants
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

/**
 * @param {Array.<ProjectileObjectType>} objectTypes - types of objects available for the dropdown model
 * @param {Property.<ProjectileObjectType>} selectedProjectileObjectTypeProperty - currently selected type of object
 * @param {Node} comboBoxListParent - node for containing the combo box
 * @param {Property.<number>} projectileMassProperty
 * @param {Property.<number>} projectileDiameterProperty
 * @param {Property.<number>} projectileDragCoefficientProperty
 * @param {Property.<boolean>} airResistanceOnProperty - whether air resistance is on
 * @param {Object} [options]
 * @constructor
 */
function IntroProjectileControlPanel( objectTypes,
                                      selectedProjectileObjectTypeProperty,
                                      comboBoxListParent,
                                      projectileMassProperty,
                                      projectileDiameterProperty,
                                      projectileDragCoefficientProperty,
                                      airResistanceOnProperty,
                                      options ) {

  // The first object is a placeholder so none of the others get mutated
  // The second object is the default, in the constants files
  // The third object is options specific to this panel, which overrides the defaults
  // The fourth object is options given at time of construction, which overrides all the others
  options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
    tandem: Tandem.REQUIRED
  }, options );

  // maxWidth of the labels within the dropdown empirically determined
  const itemNodeOptions = merge( {}, LABEL_OPTIONS, { maxWidth: 170 } );

  const firstItemNode = new VBox( {
    align: 'left',
    children: [
      new Text( objectTypes[ 0 ].name, itemNodeOptions )
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

    comboBoxItems[ i ] = new ComboBoxItem( i === 0 ? firstItemNode : new Text( projectileType.name, itemNodeOptions ),
      projectileType, {
        tandemName: projectileType.benchmark + 'Item'
      } );
  }

  // create view for dropdown
  const projectileChoiceComboBox = new ComboBox(
    comboBoxItems,
    selectedProjectileObjectTypeProperty,
    comboBoxListParent, {
      xMargin: 12,
      yMargin: 7,
      cornerRadius: 4,
      buttonLineWidth: comboBoxLineWidth,
      listLineWidth: comboBoxLineWidth,
      tandem: options.tandem.createTandem( 'projectileChoiceComboBox' ),
      phetioDocumentation: 'Combo box that selects what projectile type to launch from the cannon'
    }
  );

  // @private make visible to methods
  this.projectileChoiceComboBox = projectileChoiceComboBox;

  // local var for layout and formatting
  const parameterLabelOptions = merge( {}, LABEL_OPTIONS, { maxWidth: options.minWidth - 2 * options.xMargin } );

  /**
   * Auxiliary function that creates vbox for a parameter label and readouts
   * @private
   *
   * @param {string} labelString - label for the parameter
   * @param {string} unitsString - units
   * @param {Property.<number>} valueProperty - the Property that is set and linked to
   * @param {Tandem} tandem
   * @returns {VBox}
   */
  function createReadout( labelString, unitsString, valueProperty, tandem ) {
    const parameterLabel = new Text( '', merge( {
      tandem: tandem,
      phetioComponentOptions: { textProperty: { phetioReadOnly: true } }
    }, parameterLabelOptions ) );

    parameterLabel.setBoundsMethod( 'accurate' );

    valueProperty.link( value => {
      const valueReadout = unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        value: value,
        units: unitsString
      } ) : Utils.toFixed( value, 2 );
      parameterLabel.setText( labelString + ': ' + valueReadout );
    } );

    return new VBox( {
      align: 'left',
      children: [ parameterLabel, new HStrut( parameterLabelOptions.maxWidth ) ]
    } );
  }

  const massReadout = createReadout(
    massString,
    kgString,
    projectileMassProperty,
    options.tandem.createTandem( 'massReadout' )
  );

  const diameterReadout = createReadout(
    diameterString,
    mString,
    projectileDiameterProperty,
    options.tandem.createTandem( 'diameterReadout' )
  );

  // The contents of the control panel
  const content = new VBox( {
    align: 'left',
    spacing: options.controlsVerticalSpace,
    children: [
      projectileChoiceComboBox,
      massReadout,
      diameterReadout,
      new Line( 0, 0, options.minWidth - 2 * options.xMargin, 0, { stroke: 'gray' } ),
      new AirResistanceControl( airResistanceOnProperty, projectileDragCoefficientProperty, {
        labelOptions: LABEL_OPTIONS,
        minWidth: options.minWidth,
        xMargin: options.xMargin,
        spacing: options.controlsVerticalSpace,
        tandem: options.tandem.createTandem( 'airResistanceControl' )
      } )
    ]
  } );

  Panel.call( this, content, options );
}

projectileMotion.register( 'IntroProjectileControlPanel', IntroProjectileControlPanel );

inherit( Panel, IntroProjectileControlPanel, {

  // @public for use by screen view
  hideComboBoxList: function() {
    this.projectileChoiceComboBox.hideListBox();
  }
} );

export default IntroProjectileControlPanel;