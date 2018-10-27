// Copyright 2016-2017, University of Colorado Boulder

/**
 * Control panel allows the user to change a projectile's parameters
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Checkbox = require( 'SUN/Checkbox' );
  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var airResistanceString = require( 'string!PROJECTILE_MOTION/airResistance' );
  var altitudeString = require( 'string!PROJECTILE_MOTION/altitude' );
  var diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  var dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  var gravityString = require( 'string!PROJECTILE_MOTION/gravity' );
  var kgString = require( 'string!PROJECTILE_MOTION/kg' );
  var massString = require( 'string!PROJECTILE_MOTION/mass' );
  var metersPerSecondSquaredString = require( 'string!PROJECTILE_MOTION/metersPerSecondSquared' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
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
    arrowButtonScale: 0.56
  };
  var AIR_RESISTANCE_ICON = ProjectileMotionConstants.AIR_RESISTANCE_ICON;

  /**
   * @param {Node} comboBoxListParent - node for containing the combobox
   * @param {KeypadLayer} keypadLayer - for entering values
   * @param {LabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function LabProjectilePanel( comboBoxListParent,
                               keypadLayer,
                               model,
                               options ) {

    // convenience variables with description comments

    var objectTypes = model.objectTypes; // {Array.<ProjectileObjectType>} - for dropdown

    // {Property.<ProjectileObjectType>}
    var selectedProjectileObjectTypeProperty = model.selectedProjectileObjectTypeProperty;
    
    var projectileMassProperty = model.projectileMassProperty; // {Property.<number>}
    var projectileDiameterProperty = model.projectileDiameterProperty; // {Property.<number>}
    var projectileDragCoefficientProperty = model.projectileDragCoefficientProperty; // {Property.<number>}
    var altitudeProperty = model.altitudeProperty; // {Property.<number>}
    var airResistanceOnProperty = model.airResistanceOnProperty; // {Property.<boolean>}
    var gravityProperty = model.gravityProperty; // {Property.<number>}

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    // maxWidth empirically determined for labels in the dropdown
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
    
    // create view for the dropdown
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

    // @private make visible to methods
    this.projectileChoiceComboBox = projectileChoiceComboBox;
    
    // local vars for layout and formatting
    var textDisplayWidth = options.textDisplayWidth * 1.3;
    var textOptions = _.defaults( { cursor: 'pointer', maxWidth: textDisplayWidth - 2 * options.xMargin }, LABEL_OPTIONS );

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} valueProperty - the Property that is set and linked to
     * @param {Range} range - range for the valueProperty value
     * @returns {VBox}
     */
    function createParameterControlBox( labelString, unitsString, valueProperty, range ) {

      // label
      var parameterLabel = new Text( labelString, LABEL_OPTIONS );

      // value text
      var valueText = new Text( unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        value: valueProperty.get(),
        units: unitsString
      } ) : valueProperty.get(), textOptions );

      // background for text
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        textDisplayWidth,
        options.textDisplayHeight,
        _.defaults( { cornerRadius: 4, cursor: 'pointer' }, TEXT_BACKGROUND_OPTIONS )
      );

      // text node updates if valueProperty value changes
      valueProperty.link( function( value ) {
        valueText.setText( unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
          value: value,
          units: unitsString
        } ) : value );
        valueText.center = backgroundNode.center;
      } );

      var editValue = function() {
        keypadLayer.beginEdit( valueProperty, range, unitsString, {
          onBeginEdit: function() { backgroundNode.fill = PhetColorScheme.BUTTON_YELLOW; },
          onEndEdit: function() { backgroundNode.fill = 'white'; }
        } );
      };

      // edit button
      var pencilIcon = new FontAwesomeNode( 'pencil_square_o', { scale: 0.35 } );
      var editButton = new RectangularPushButton( {
        minWidth: 25,
        minHeight: 20,
        centerY: backgroundNode.centerY,
        left: backgroundNode.right + options.xMargin,
        content: pencilIcon,
        baseColor: PhetColorScheme.BUTTON_YELLOW,
        listener: editValue
      } );

      // include readout to open keypad
      backgroundNode.addInputListener( new DownUpListener( { // no removeInputListener required
        down: editValue
      } ) );

      valueText.addInputListener( new DownUpListener( { // no removeInputListener required
        down: editValue
      } ) );      

      var valueNode = new Node( { children: [ backgroundNode, valueText, editButton ] } );

      parameterLabel.setMaxWidth( options.minWidth - 4 * options.xMargin - valueNode.width );

      var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueNode.width;

      return new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } );
    }
    
    // layout function for the number controls
    var layoutFunction = function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
      titleNode.setMaxWidth( options.minWidth - 3 * options.xMargin - numberDisplay.width );
      return new VBox( {
        spacing: options.sliderLabelSpacing,
        align: 'center',
        children: [
          new HBox( {
            spacing: options.minWidth - 2 * options.xMargin - titleNode.width - numberDisplay.width - 3,
            children: [ titleNode, numberDisplay ]
          } ),
          new HBox( {
            spacing: ( options.minWidth - 2 * options.xMargin - slider.width - leftArrowButton.width - rightArrowButton.width ) / 2 - 2,
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
    
    // local vars for improving readability and tracking control boxes
    // __Box such as massBox is the parent of the control, and it is a child of Panel
    // __SpecificProjectileTypeBox is a number control for when a benchmark is selected from the dropdown
    // __CustomBox is a control box with label, readout, and edit button for when Custom is selected from the dropdown
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
    
    // update the type of control based on the objectType
    selectedProjectileObjectTypeProperty.link( function( objectType ) {
      if ( objectType.benchmark ) {
        if ( massCustomBox && massBox.hasChild( massCustomBox ) ) {

          // if there are already custom boxes, remove them
          
          massBox.removeChild( massCustomBox );
          diameterBox.removeChild( diameterCustomBox );
          dragCoefficientBox.removeChild( dragCoefficientCustomBox );
          altitudeBox.removeChild( altitudeCustomBox );
          gravityBox.removeChild( gravityCustomBox );
        }
        if ( massSpecificProjectileTypeBox ) {

          // if there are already benchmark boxes, remove them
          
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
            delta: 0.01
          }, numberControlOptions )
        );
        altitudeSpecificProjectileTypeBox = new NumberControl(
          altitudeString, altitudeProperty,
          ProjectileMotionConstants.ALTITUDE_RANGE, _.extend( {
            valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { value: '{0}', units: mString } ),
            constrainValue: function( value ) { return Util.roundSymmetric( value / 100 ) * 100; },
            decimalPlaces: 0,
            delta: 100
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

          // if there are already benchmark boxes, remove them

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
      altitudeBox.opacity = opacity;
      dragCoefficientBox.opacity = opacity;
      altitudeBox.setPickable( airResistanceOn );
      dragCoefficientBox.setPickable( airResistanceOn );
    } );

    // air resistance
    var airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    var airResistanceCheckbox = new Checkbox( airResistanceLabel, airResistanceOnProperty, {
      maxWidth: options.minWidth - AIR_RESISTANCE_ICON.width - 3 * options.xMargin,
      boxWidth: 18
    } );
    var airResistanceCheckboxAndIcon = new HBox( {
      spacing: options.xMargin,
      children: [ airResistanceCheckbox, AIR_RESISTANCE_ICON ]
    } );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        projectileChoiceComboBox,
        massBox,
        diameterBox,
        new Line( 0, 0, options.minWidth - 2 * options.xMargin, 0, { stroke: 'gray' } ),
        gravityBox,
        new Line( 0, 0, options.minWidth - 2 * options.xMargin, 0, { stroke: 'gray' } ),
        airResistanceCheckboxAndIcon,
        altitudeBox,
        dragCoefficientBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'LabProjectilePanel', LabProjectilePanel );

  return inherit( Panel, LabProjectilePanel, {

    // @public for use by screen view
    hideComboBoxList: function() {
      this.projectileChoiceComboBox.hideListFromClick();
    }
  } );
} );


