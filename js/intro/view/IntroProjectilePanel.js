// Copyright 2016-2019, University of Colorado Boulder

/**
 * Control panel that allows users to choose what kind of projectile to fire
 * and view the properties of this projectile.
 * Also includes a checkbox for turning on and off air resistance.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Panel = require( 'SUN/Panel' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const airResistanceString = require( 'string!PROJECTILE_MOTION/airResistance' );
  const diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  const dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  const kgString = require( 'string!PROJECTILE_MOTION/kg' );
  const massString = require( 'string!PROJECTILE_MOTION/mass' );
  const mString = require( 'string!PROJECTILE_MOTION/m' );
  const pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );

  // constants
  const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  const AIR_RESISTANCE_ICON = ProjectileMotionConstants.AIR_RESISTANCE_ICON;

  /**
   * @param {Array.<ProjectileObjectType>} objectTypes - types of objects available for the dropdown model
   * @param {Property.<ProjectileObjectType>} selectedProjectileObjectTypeProperty - currently selected type of object
   * @param {Node} comboBoxListParent - node for containing the combo box
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Property.<boolean>} airResistanceOnProperty - whether air resistance is on
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function IntroProjectilePanel( objectTypes,
                                 selectedProjectileObjectTypeProperty,
                                 comboBoxListParent,
                                 projectileMassProperty,
                                 projectileDiameterProperty,
                                 projectileDragCoefficientProperty,
                                 airResistanceOnProperty,
                                 tandem,
                                 options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    // maxWidth of the labels within the dropdown empirically determined
    const itemNodeOptions = _.defaults( { maxWidth: 170 }, LABEL_OPTIONS );

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
    assert && assert( objectTypes[ 0 ].benchmark, 'benchmark needed for tandemName' );
    comboBoxItems[ 0 ] = new ComboBoxItem( firstItemNode, objectTypes[ 0 ], {
      tandemName: objectTypes[ 0 ].benchmark
    } );

    for ( let i = 1; i < objectTypes.length; i++ ) {
      const projectileObject = objectTypes[ i ];
      assert && assert( projectileObject.benchmark, 'benchmark needed for tandemName' );
      comboBoxItems[ i ] = new ComboBoxItem( new Text( projectileObject.name, itemNodeOptions ), projectileObject, {
        tandemName: projectileObject.benchmark
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
        tandem: tandem.createTandem( 'projectileChoiceComboBox' )
      }
    );

    // @private make visible to methods
    this.projectileChoiceComboBox = projectileChoiceComboBox;

    // local var for layout and formatting
    const parameterLabelOptions = _.defaults( { maxWidth: options.minWidth - 2 * options.xMargin }, LABEL_OPTIONS );

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
    function createParameterControlBox( labelString, unitsString, valueProperty, tandem ) {
      const parameterLabel = new Text( '', parameterLabelOptions );

      parameterLabel.setBoundsMethod( 'accurate' );

      valueProperty.link( function( value ) {
        const valueReadout = unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
          value: value,
          units: unitsString
        } ) : Util.toFixed( value, 2 );
        parameterLabel.setText( labelString + ': ' + valueReadout );
      } );

      return new VBox( {
        align: 'left',
        children: [ parameterLabel, new HStrut( parameterLabelOptions.maxWidth ) ],
        tandem: tandem // TODO: I'm not sure about this one, https://github.com/phetsims/projectile-motion/issues/177
      } );
    }

    const massBox = createParameterControlBox(
      massString,
      kgString,
      projectileMassProperty,
      tandem.createTandem( 'massControlBox' )
    );

    const diameterBox = createParameterControlBox(
      diameterString,
      mString,
      projectileDiameterProperty,
      tandem.createTandem( 'diameterControlBox' )
    );

    const dragCoefficientBox = createParameterControlBox(
      dragCoefficientString,
      null,
      projectileDragCoefficientProperty,
      tandem.createTandem( 'dragCoefficientControlBox' )
    );

    // air resistance
    const airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    const airResistanceCheckbox = new Checkbox( airResistanceLabel, airResistanceOnProperty, {
      maxWidth: parameterLabelOptions.maxWidth - AIR_RESISTANCE_ICON.width - options.xMargin,
      boxWidth: 18,
      tandem: tandem.createTandem( 'airResistanceCheckbox' )
    } );
    const airResistanceCheckboxAndIcon = new HBox( {
      spacing: options.xMargin,
      children: [ airResistanceCheckbox, AIR_RESISTANCE_ICON ]
    } );

    // disabling and enabling drag and altitude controls depending on whether air resistance is on
    airResistanceOnProperty.link( function( airResistanceOn ) {
      const opacity = airResistanceOn ? 1 : 0.5;
      dragCoefficientBox.setOpacity( opacity );
    } );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        projectileChoiceComboBox,
        massBox,
        diameterBox,
        new Line( 0, 0, options.minWidth - 2 * options.xMargin, 0, { stroke: 'gray' } ),
        airResistanceCheckboxAndIcon,
        dragCoefficientBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'IntroProjectilePanel', IntroProjectilePanel );

  return inherit( Panel, IntroProjectilePanel, {

    // @public for use by screen view
    hideComboBoxList: function() {
      this.projectileChoiceComboBox.hideListBox();
    }
  } );
} );

