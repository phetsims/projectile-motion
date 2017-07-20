// Copyright 2016-2017, University of Colorado Boulder

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
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Line = require( 'SCENERY/nodes/Line' );

  // strings
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var metersPerSecondSquaredString = require( 'string!PROJECTILE_MOTION/metersPerSecondSquared' );
  var massString = require( 'string!PROJECTILE_MOTION/mass' );
  var kgString = require( 'string!PROJECTILE_MOTION/kg' );
  var diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  var dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  var altitudeString = require( 'string!PROJECTILE_MOTION/altitude' );
  var airResistanceString = require( 'string!PROJECTILE_MOTION/airResistance' );
  var gravityString = require( 'string!PROJECTILE_MOTION/gravity' );
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var TEXT_BACKGROUND_OPTIONS = {
    fill: 'white',
    stroke: 'black'
  };
  var TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
  var NUMBER_CONTROL_OPTIONS = {
    valueAlign: 'center',
    titleFont: TEXT_FONT,
    valueFont: TEXT_FONT,
    majorTickLength: 5,
    thumbSize: new Dimension2( 13, 22 ),
    thumbTouchAreaXDilation: 6,
    thumbTouchAreaYDilation: 4,
    arrowButtonScale: 0.65
  };
  var AIR_RESISTANCE_ICON = ProjectileMotionConstants.AIR_RESISTANCE_ICON;

  /**
   * @param {Array.<ProjectileObjectType>} objectTypes - types of objects available for the dropdown model
   * @param {Property.<ProjectileObjectType>} selectedProjectileObjectTypeProperty - currently selected type of object
   * @param {Node} comboBoxListParent - node for containing the combobox
   * @param {KeypadLayer} keypadLayer - for entering values
   * @param {function:KeypadPanel} setKeypadLocation - function for laying out the keypad, no return
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Property.<number>} altitudeProperty
   * @param {Property.<boolean>} airResistanceOnProperty - whether air resistance is on
   * @param {Property.<number>} gravityProperty
   * @param {Object} [options]
   * @constructor
   */
  function LabProjectilePanel( objectTypes,
                               selectedProjectileObjectTypeProperty,
                               comboBoxListParent,
                               keypadLayer,
                               setKeypadLocation,
                               projectileMassProperty,
                               projectileDiameterProperty,
                               projectileDragCoefficientProperty,
                               altitudeProperty,
                               airResistanceOnProperty,
                               gravityProperty,
                               options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    // maxWidth empirically determined
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
    var firstItemNodeWidth = comboBoxWidth - itemXMargin - 0.5 * firstItemNode.height - 4 * buttonXMargin - 2 * itemXMargin - 2 * comboBoxLineWidth;
    firstItemNode.addChild( new HStrut( firstItemNodeWidth ) );

    var comboBoxItems = [];
    comboBoxItems[ 0 ] = ComboBox.createItem( firstItemNode, objectTypes[ 0 ] );

    for ( var i = 1; i < objectTypes.length; i++ ) {
      var projectileObject = objectTypes[ i ];
      comboBoxItems[ i ] = ComboBox.createItem( new Text( projectileObject.name, itemNodeOptions ), projectileObject );
    }

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

    comboBoxListParent.addChild( projectileChoiceComboBox );

    var textDisplayWidth = options.textDisplayWidth * 1.3;
    var textOptions = _.defaults( { maxWidth: textDisplayWidth - 2 * options.xMargin }, LABEL_OPTIONS );

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Range} range - range for the property value
     * @returns {VBox}
     */
    function createParameterControlBox( labelString, unitsString, property, range ) {
      // label
      var parameterLabel = new Text( labelString, LABEL_OPTIONS );

      // value text
      var valueText = new Text( unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        value: property.get(),
        units: unitsString
      } ) : property.get(), textOptions );

      // background for text
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        textDisplayWidth,
        options.textDisplayHeight,
        _.defaults( { cornerRadius: 4 }, TEXT_BACKGROUND_OPTIONS )
      );

      // text node updates if property value changes
      property.link( function( value ) {
        valueText.setText( unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
          value: value,
          units: unitsString
        } ) : value );
        valueText.center = backgroundNode.center;
      } );

      // edit button
      var pencilIcon = new FontAwesomeNode( 'pencil_square_o', { scale: 0.35 } );
      var editButton = new RectangularPushButton( {
        minWidth: 25,
        minHeight: 20,
        centerY: backgroundNode.centerY,
        left: backgroundNode.right + options.xMargin,
        content: pencilIcon,
        baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
        listener: function() {
          keypadLayer.beginEdit( property, range, {
            onBeginEdit: function() { backgroundNode.fill = PhetColorScheme.PHET_LOGO_YELLOW; },
            onEndEdit: function() { backgroundNode.fill = 'white'; },
            setKeypadLocation: setKeypadLocation,
            maxDigits: 8,
            maxDecimals: 2,
          } );
        }
      } );

      var valueNode = new Node( { children: [ backgroundNode, valueText, editButton ] } );

      parameterLabel.setMaxWidth( options.minWidth - 4 * options.xMargin - valueNode.width );

      var xSpacing = options.minWidth - 3 * options.xMargin - parameterLabel.width - valueNode.width;

      return new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } );
    }

    var layoutFunction = function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
      titleNode.setMaxWidth( options.minWidth - 3 * options.xMargin - numberDisplay.width );
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
      trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 80, 0.5 ),
      layoutFunction: layoutFunction,
      valueMaxWidth: textDisplayWidth
    }, NUMBER_CONTROL_OPTIONS );

    // readout, slider, and tweakers
    var massBox = new Node();
    var diameterBox = new Node();
    var dragCoefficientBox = new Node();
    var altitudeBox = new Node();
    var gravityBox = new Node();
    var massSpecificProjectileTypeBox = null;
    var diameterSpecificProjectileTypeBox = null;
    var dragCoefficientSpecificProjectileTypeBox = null;
    var altitudeSpecificProjectileTypeBox = null;
    var gravitySpecificProjectileTypeBox = null;
    var massCustomBox = null;
    var diameterCustomBox = null;
    var dragCoefficientCustomBox = null;
    var altitudeCustomBox = null;
    var gravityCustomBox = null;

    selectedProjectileObjectTypeProperty.link( function( objectType ) {
      if ( objectType.type ) {
        if ( massCustomBox && massBox.hasChild( massCustomBox ) ) {
          massBox.removeChild( massCustomBox );
          diameterBox.removeChild( diameterCustomBox );
          dragCoefficientBox.removeChild( dragCoefficientCustomBox );
          altitudeBox.removeChild( altitudeCustomBox );
          gravityBox.removeChild( gravityCustomBox );
        }
        if ( massSpecificProjectileTypeBox ) {
          massSpecificProjectileTypeBox.dispose();
          diameterSpecificProjectileTypeBox.dispose();
          dragCoefficientSpecificProjectileTypeBox.dispose();
          altitudeSpecificProjectileTypeBox.dispose();
          gravitySpecificProjectileTypeBox.dispose();
        }
        massSpecificProjectileTypeBox = new NumberControl(
          massString, projectileMassProperty,
          objectType.massRange, _.extend( {
            valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { value: '{0}', units: kgString } ),
            constrainValue: function( value ) { return Util.roundSymmetric( value / objectType.massRound ) * objectType.massRound; },
            majorTicks: [ {
              value: objectType.massRange.min,
              label: new Text( objectType.massRange.min, LABEL_OPTIONS )
            }, { value: objectType.massRange.max, label: new Text( objectType.massRange.max, LABEL_OPTIONS ) } ],
            decimalPlaces: Math.ceil( -Util.log10( objectType.massRound ) ),
            delta: objectType.massRound
          }, numberControlOptions )
        );
        diameterSpecificProjectileTypeBox = new NumberControl(
          diameterString, projectileDiameterProperty,
          objectType.diameterRange, _.extend( {
            valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { value: '{0}', units: mString } ),
            constrainValue: function( value ) { return Util.roundSymmetric( value / objectType.diameterRound ) * objectType.diameterRound; },
            majorTicks: [ {
              value: objectType.diameterRange.min,
              label: new Text( objectType.diameterRange.min, LABEL_OPTIONS )
            }, {
              value: objectType.diameterRange.max,
              label: new Text( objectType.diameterRange.max, LABEL_OPTIONS )
            } ],
            decimalPlaces: Math.ceil( -Util.log10( objectType.diameterRound ) ),
            delta: objectType.diameterRound
          }, numberControlOptions )
        );
        gravitySpecificProjectileTypeBox = new NumberControl(
          gravityString, gravityProperty,
          ProjectileMotionConstants.GRAVITY_RANGE, _.extend( {
            valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
              value: '{0}',
              units: metersPerSecondSquaredString
            } ),
            constrainValue: function( value ) { return Util.roundSymmetric( value * 100 ) / 100; },
            decimalPlaces: 2,
            delta: 0.01,
          }, numberControlOptions )
        );
        altitudeSpecificProjectileTypeBox = new NumberControl(
          altitudeString, altitudeProperty,
          ProjectileMotionConstants.ALTITUDE_RANGE, _.extend( {
            valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { value: '{0}', units: mString } ),
            constrainValue: function( value ) { return Util.roundSymmetric( value / 100 ) * 100; },
            decimalPlaces: 0,
            delta: 100,
          }, numberControlOptions )
        );
        dragCoefficientSpecificProjectileTypeBox = new Text( dragCoefficientString + ': ' + Util.toFixed( projectileDragCoefficientProperty.get(), 2 ), _.defaults( { maxWidth: options.minWidth - 2 * options.xMargin }, LABEL_OPTIONS ) );
        massBox.addChild( massSpecificProjectileTypeBox );
        diameterBox.addChild( diameterSpecificProjectileTypeBox );
        dragCoefficientBox.addChild( dragCoefficientSpecificProjectileTypeBox );
        altitudeBox.addChild( altitudeSpecificProjectileTypeBox );
        gravityBox.addChild( gravitySpecificProjectileTypeBox );
      }
      else {
        if ( massSpecificProjectileTypeBox && massBox.hasChild( massSpecificProjectileTypeBox ) ) {
          massBox.removeChild( massSpecificProjectileTypeBox );
          diameterBox.removeChild( diameterSpecificProjectileTypeBox );
          dragCoefficientBox.removeChild( dragCoefficientSpecificProjectileTypeBox );
          altitudeBox.removeChild( altitudeSpecificProjectileTypeBox );
          gravityBox.removeChild( gravitySpecificProjectileTypeBox );
        }
        if ( !massCustomBox ) {
          massCustomBox = createParameterControlBox(
            massString,
            kgString,
            projectileMassProperty,
            objectType.massRange
          );
          diameterCustomBox = createParameterControlBox(
            diameterString,
            mString,
            projectileDiameterProperty,
            objectType.diameterRange
          );
          gravityCustomBox = createParameterControlBox(
            gravityString,
            metersPerSecondSquaredString,
            gravityProperty,
            ProjectileMotionConstants.GRAVITY_RANGE
          );
          altitudeCustomBox = createParameterControlBox(
            altitudeString,
            mString,
            altitudeProperty,
            ProjectileMotionConstants.ALTITUDE_RANGE
          );
          dragCoefficientCustomBox = createParameterControlBox(
            dragCoefficientString,
            null,
            projectileDragCoefficientProperty,
            objectType.dragCoefficientRange
          );
        }
        massBox.addChild( massCustomBox );
        diameterBox.addChild( diameterCustomBox );
        dragCoefficientBox.addChild( dragCoefficientCustomBox );
        altitudeBox.addChild( altitudeCustomBox );
        gravityBox.addChild( gravityCustomBox );
      }
    } );

    // disabling and enabling drag and altitude controls depending on whether air resistance is on
    airResistanceOnProperty.link( function( airResistanceOn ) {
      var opacity = airResistanceOn ? 1 : 0.5;
      altitudeBox.setOpacity( opacity );
      dragCoefficientBox.setOpacity( opacity );
      altitudeBox.setPickable( airResistanceOn );
      dragCoefficientBox.setPickable( airResistanceOn );
    } );

    var airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, airResistanceOnProperty, {
      maxWidth: options.minWidth - AIR_RESISTANCE_ICON.width - 3 * options.xMargin
    } );
    var airResistanceCheckBoxAndIcon = new HBox( {
      spacing: options.xMargin,
      children: [ airResistanceCheckBox, AIR_RESISTANCE_ICON ]
    } );

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
        gravityBox,
        new Line( 0, 0, options.minWidth - 2 * options.xMargin, 0, { stroke: 'gray' } ),
        airResistanceCheckBoxAndIcon,
        altitudeBox,
        dragCoefficientBox
      ]
    } );

    // @private for layout
    this.projectileChoiceComboBox = projectileChoiceComboBox;
    this.controlsVerticalSpace = options.controlsVerticalSpace;

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'LabProjectilePanel', LabProjectilePanel );

  return inherit( Panel, LabProjectilePanel, {

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


