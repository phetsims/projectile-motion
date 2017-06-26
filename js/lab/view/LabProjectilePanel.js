// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control panel allows the user to change a projectile's parameters
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var ComboBox = require( 'SUN/ComboBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var Util = require( 'DOT/Util' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // strings
  var pattern0Label1UnitsString = require( 'string!PROJECTILE_MOTION/pattern0Label1Units' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var massString = require( 'string!PROJECTILE_MOTION/mass' );
  var kgString = require( 'string!PROJECTILE_MOTION/kg' );
  var diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  var dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  var altitudeString = require( 'string!PROJECTILE_MOTION/altitude' );
  var airResistanceString = require( 'string!PROJECTILE_MOTION/airResistance' );
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var TEXT_BACKGROUND_OPTIONS = {
    fill: 'white',
    stroke: 'black'
  };
  var TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
  var NUMBER_CONTROL_OPTIONS = {
    valueBackgroundStroke: 'gray',
    valueAlign: 'center',
    titleFont: TEXT_FONT,
    valueFont: TEXT_FONT,
    majorTickLength: 5,
    thumbSize: new Dimension2( 16, 28 ),
    thumbTouchAreaXDilation: 6,
    thumbTouchAreaYDilation: 4
  };

  /**
   * @param {Array.<ProjectileObjectType>} objectTypes - types of objects available for the dropdown model
   * @param {Property.<ProjectileObjectType>} selectedProjectileObjectTypeProperty - currently selected type of object
   * @param {Node} comboBoxListParent - node for containing the combobox
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Property.<number>} altitudeProperty
   * @param {Property.<boolean>} airResistanceOnProperty - whether air resistance is on
   * @param {Object} [options]
   * @constructor
   */
  function LabProjectilePanel(
                              objectTypes,
                              selectedProjectileObjectTypeProperty,
                              comboBoxListParent,
                              projectileMassProperty,
                              projectileDiameterProperty,
                              projectileDragCoefficientProperty,
                              altitudeProperty,
                              airResistanceOnProperty,
                              options
  ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    var firstItemNode = new VBox( {
      align: 'left',
      children: [
        new Text( objectTypes[ 0 ].name, LABEL_OPTIONS )
      ]
    } );

    var comboBoxWidth = options.minWidth - 2 * options.xMargin;
    var itemXMargin = 6;
    var buttonXMargin = 10;
    var comboBoxLineWidth = 1;

    // first item contains horizontal strut that sets width of combobox
    var firstItemNodeWidth = comboBoxWidth - itemXMargin - 0.5 * firstItemNode.height - 4 * buttonXMargin - 2 * itemXMargin - 2 * comboBoxLineWidth;
    firstItemNode.addChild( new HStrut( firstItemNodeWidth ) );

    var comboBoxItems = [];
    comboBoxItems[ 0 ] = ComboBox.createItem( firstItemNode, objectTypes[ 0 ] );

    var i;
    for ( i = 1; i < objectTypes.length; i++ ) {
      var projectileObject = objectTypes[ i ];
      comboBoxItems[ i ] = ComboBox.createItem( new Text( projectileObject.name, LABEL_OPTIONS ), projectileObject );
    }

    var projectileChoiceComboBox = new ComboBox(
      comboBoxItems,
      selectedProjectileObjectTypeProperty,
      comboBoxListParent, {
        itemXMargin: itemXMargin,
        buttonXMargin: buttonXMargin,
        buttonLineWidth: comboBoxLineWidth,
        listLineWidth: comboBoxLineWidth,
        itemHighlightLineWidth: comboBoxLineWidth
      }
    );

    comboBoxListParent.addChild( projectileChoiceComboBox );

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Range} range - range for the property value
     * @returns {VBox}
     * @private
     */
    function createParameterControlBox( labelString, unitsString, property, range ) {
      // label
      var parameterLabel = new Text( unitsString ? StringUtils.format( pattern0Label1UnitsString, labelString, unitsString ) : labelString,
        LABEL_OPTIONS
      );

      // value text
      var valueText = new Text( Util.toFixedNumber( property.get(), 2 ), LABEL_OPTIONS );

      // background for text
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        options.textDisplayWidth, // width
        valueText.height + 2 * options.textDisplayYMargin, // height
        _.defaults( { cornerRadius: 4}, TEXT_BACKGROUND_OPTIONS )
      );

      // text node updates if property value changes
      property.link( function( value ) {
        valueText.setText( value );
        valueText.center = backgroundNode.center;
      } );

      var valueNode = new Node( { children: [ backgroundNode, valueText ] } );

      var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueNode.width;

      return new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } );
    }

    var massBox = createParameterControlBox(
      massString,
      kgString,
      projectileMassProperty,
      ProjectileMotionConstants.PROJECTILE_MASS_RANGE
    );

    var layoutFunction = function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
      return new VBox( {
        spacing: options.sliderLabelSpacing,
        children: [
          new HBox( {
            spacing: options.minWidth - 2 * options.xMargin - titleNode.width - numberDisplay.width,
            children: [ titleNode, numberDisplay ]
          } ),
          new HBox( {
            spacing: ( options.minWidth - 2 * options.xMargin - slider.width - leftArrowButton.width - rightArrowButton.width ) / 2,
            resize: false, // prevent slider from causing a resize when thumb is at min or max
            children: [ leftArrowButton, slider, rightArrowButton ]
          } )
        ]
      } );
    };

    var numberControlOptions = _.extend( { 
      trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 90, 0.5 ),
      layoutFunction: layoutFunction
    }, NUMBER_CONTROL_OPTIONS );

    // diameter readout, slider, and tweakers
    // TODO: make numbercontrol options, and then extend
    var diameterBox = new NumberControl(
      diameterString, projectileDiameterProperty,
      selectedProjectileObjectTypeProperty.get().diameterRange, _.extend( {
        valuePattern: StringUtils.format( pattern0Value1UnitsWithSpaceString, '{0}', mString ),
        constrainValue: function( value ) { return Util.roundSymmetric( value / selectedProjectileObjectTypeProperty.get().diameterRound ) * selectedProjectileObjectTypeProperty.get().diameterRound; },
        majorTicks: [ { value: selectedProjectileObjectTypeProperty.get().diameterRange.min }, { value: selectedProjectileObjectTypeProperty.get().diameterRange.max } ],
        decimalPlaces: Math.ceil( -Math.log10( selectedProjectileObjectTypeProperty.get().diameterRound ) ),
        delta: selectedProjectileObjectTypeProperty.get().diameterRound,
        layoutFunction
      }, numberControlOptions )
    );

    var dragCoefficientBox = createParameterControlBox(
      dragCoefficientString,
      null,
      projectileDragCoefficientProperty,
      ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE
    );

    var altitudeBox = createParameterControlBox(
      altitudeString,
      mString,
      altitudeProperty,
      ProjectileMotionConstants.ALTITUDE_RANGE
    );

    var airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, airResistanceOnProperty );

    var vStrutForComboBox = new VStrut( projectileChoiceComboBox.height );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        vStrutForComboBox,
        massBox,
        diameterBox,
        airResistanceCheckBox,
        dragCoefficientBox,
        altitudeBox
      ]
    } );

    // @private for layout
    this.projectileChoiceComboBox = projectileChoiceComboBox;
    this.controlsVerticalSpace = options.controlsVerticalSpace;


    Panel.call( this, content, options );
  }

  projectileMotion.register( 'LabProjectilePanel', LabProjectilePanel );

  return inherit( Panel, LabProjectilePanel, {
    // @public layout the combobox
    layoutComboBox: function() {
      this.projectileChoiceComboBox.centerX = this.centerX;
      this.projectileChoiceComboBox.top = this.top + this.controlsVerticalSpace;
    }
  } );
} );


