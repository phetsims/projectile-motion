// Copyright 2016-2017, University of Colorado Boulder

/**
 * Control panel that allows users to choose what kind of projectile to fire
 * and view the properties of this projectile.
 * Also includes a checkbox for turning on and off air resistance.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var ComboBox = require( 'SUN/ComboBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var Util = require( 'DOT/Util' );
  var Line = require( 'SCENERY/nodes/Line' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var massString = require( 'string!PROJECTILE_MOTION/mass' );
  var kgString = require( 'string!PROJECTILE_MOTION/kg' );
  var diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  var airResistanceString = require( 'string!PROJECTILE_MOTION/airResistance' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var AIR_RESISTANCE_ICON = ProjectileMotionConstants.AIR_RESISTANCE_ICON;

  /**
   * @param {Array.<ProjectileObjectType>} objectTypes - types of objects available for the dropdown model
   * @param {Property.<ProjectileObjectType>} selectedProjectileObjectTypeProperty - currently selected type of object
   * @param {Node} comboBoxListParent - node for containing the combobox
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Property.<boolean>} airResistanceOnProperty - whether air resistance is on
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
                                 options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    // maxWidth of the labels within the dropdown empirically determined
    var itemNodeOptions = _.defaults( { maxWidth: 170 }, LABEL_OPTIONS );

    var firstItemNode = new VBox( {
      align: 'left',
      children: [
        new Text( objectTypes[ 0 ].name, itemNodeOptions )
      ]
    } );

    var comboBoxWidth = options.minWidth - 2 * options.xMargin;
    var itemXMargin = 6;
    var buttonXMargin = 10;
    var comboBoxLineWidth = 1;

    // first item contains horizontal strut that sets width of combobox
    var firstItemNodeWidth = comboBoxWidth -
      itemXMargin -
      0.5 * firstItemNode.height -
      4 * buttonXMargin -
      2 * itemXMargin -
      2 * comboBoxLineWidth
    ;
    firstItemNode.addChild( new HStrut( firstItemNodeWidth ) );

    var comboBoxItems = [];
    comboBoxItems[ 0 ] = ComboBox.createItem( firstItemNode, objectTypes[ 0 ] );

    for ( var i = 1; i < objectTypes.length; i++ ) {
      var projectileObject = objectTypes[ i ];
      comboBoxItems[ i ] = ComboBox.createItem( new Text( projectileObject.name, itemNodeOptions ), projectileObject );
    }

    // create view for dropdown
    var projectileChoiceComboBox = new ComboBox(
      comboBoxItems,
      selectedProjectileObjectTypeProperty,
      comboBoxListParent, {
        itemXMargin: itemXMargin,
        buttonXMargin: buttonXMargin,
        buttonLineWidth: comboBoxLineWidth,
        listLineWidth: comboBoxLineWidth,
        itemHighlightLineWidth: comboBoxLineWidth,
        buttonYMargin: 0
      }
    );

    // and add it to its appropriate parent
    comboBoxListParent.addChild( projectileChoiceComboBox );

    // local var for layout and formatting
    var parameterLabelOptions = _.defaults( { maxWidth: options.minWidth - 2 * options.xMargin }, LABEL_OPTIONS );

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @private
     * 
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} valueProperty - the Property that is set and linked to
     * @returns {VBox}
     */
    function createParameterControlBox( labelString, unitsString, valueProperty ) {
      var parameterLabel = new Text( '', parameterLabelOptions );
      parameterLabel.setBoundsMethod( 'accurate' );

      valueProperty.link( function( value ) {
        var valueReadout = unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
          value: value,
          units: unitsString
        } ) : Util.toFixed( value, 2 );
        parameterLabel.setText( labelString + ': ' + valueReadout );
      } );

      return new VBox( { align: 'left', children: [ parameterLabel, new HStrut( parameterLabelOptions.maxWidth ) ] } );
    }

    var massBox = createParameterControlBox(
      massString,
      kgString,
      projectileMassProperty
    );

    var diameterBox = createParameterControlBox(
      diameterString,
      mString,
      projectileDiameterProperty
    );

    var dragCoefficientBox = createParameterControlBox(
      dragCoefficientString,
      null,
      projectileDragCoefficientProperty
    );
    
    // air resistance
    var airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, airResistanceOnProperty, {
      maxWidth: parameterLabelOptions.maxWidth - AIR_RESISTANCE_ICON.width - options.xMargin,
      boxWidth: 18
    } );
    var airResistanceCheckBoxAndIcon = new HBox( {
      spacing: options.xMargin,
      children: [ airResistanceCheckBox, AIR_RESISTANCE_ICON ]
    } );

    // disabling and enabling drag and altitude controls depending on whether air resistance is on
    airResistanceOnProperty.link( function( airResistanceOn ) {
      var opacity = airResistanceOn ? 1 : 0.5;
      dragCoefficientBox.setOpacity( opacity );
    } );
    
    // vertical strut to account for the space that combobox takes up, since it is not added as a child to panel
    var vStrutForComboBox = new VStrut( projectileChoiceComboBox.height );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        vStrutForComboBox,
        massBox,
        diameterBox,
        new Line( 0, 0, options.minWidth - 2 * options.xMargin, 0, { stroke: 'gray' } ),
        airResistanceCheckBoxAndIcon,
        dragCoefficientBox
      ]
    } );

    // @private for layout convenience
    this.projectileChoiceComboBox = projectileChoiceComboBox;
    this.controlsVerticalSpace = options.controlsVerticalSpace;

    Panel.call( this, content, options );

  }

  projectileMotion.register( 'IntroProjectilePanel', IntroProjectilePanel );

  return inherit( Panel, IntroProjectilePanel, {

    /**
     * Layout the combobox
     * @public
     */
    layoutComboBox: function() {
      this.projectileChoiceComboBox.centerX = this.centerX;
      this.projectileChoiceComboBox.top = this.top + this.controlsVerticalSpace;
    }
  } );
} );

