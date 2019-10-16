// Copyright 2016-2019, University of Colorado Boulder

/**
 * Control panel allows the user to change a projectile's parameters
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const DownUpListener = require( 'SCENERY/input/DownUpListener' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Panel = require( 'SUN/Panel' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const airResistanceString = require( 'string!PROJECTILE_MOTION/airResistance' );
  const altitudeString = require( 'string!PROJECTILE_MOTION/altitude' );
  const diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  const dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  const gravityString = require( 'string!PROJECTILE_MOTION/gravity' );
  const kgString = require( 'string!PROJECTILE_MOTION/kg' );
  const massString = require( 'string!PROJECTILE_MOTION/mass' );
  const metersPerSecondSquaredString = require( 'string!PROJECTILE_MOTION/metersPerSecondSquared' );
  const mString = require( 'string!PROJECTILE_MOTION/m' );
  const pattern0Value1UnitsString = require( 'string!PROJECTILE_MOTION/pattern0Value1Units' );
  const pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );

  // constants
  const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  const NUMBER_DISPLAY_OPTIONS = ProjectileMotionConstants.NUMBER_DISPLAY_OPTIONS;
  const TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
  const READOUT_X_MARGIN = 4;
  const AIR_RESISTANCE_ICON = ProjectileMotionConstants.AIR_RESISTANCE_ICON;
  const GRAVITY_READOUT_X_MARGIN = 6;

  /**
   * @param {Node} comboBoxListParent - node for containing the combo box
   * @param {KeypadLayer} keypadLayer - for entering values
   * @param {LabModel} model
   * @param {Object} [options]
   * @param {Tandem} tandem
   * @constructor
   */
  function LabProjectilePanel( comboBoxListParent, keypadLayer, model, tandem, options ) {

    // convenience variables with description comments

    const objectTypes = model.objectTypes; // {Array.<ProjectileObjectType>} - for dropdown

    // {Property.<ProjectileObjectType>}
    const selectedProjectileObjectTypeProperty = model.selectedProjectileObjectTypeProperty;

    const projectileMassProperty = model.projectileMassProperty; // {Property.<number>}
    const projectileDiameterProperty = model.projectileDiameterProperty; // {Property.<number>}
    const projectileDragCoefficientProperty = model.projectileDragCoefficientProperty; // {Property.<number>}
    const altitudeProperty = model.altitudeProperty; // {Property.<number>}
    const airResistanceOnProperty = model.airResistanceOnProperty; // {Property.<boolean>}
    const gravityProperty = model.gravityProperty; // {Property.<number>}

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    // maxWidth empirically determined for labels in the dropdown
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
    const firstItemNodeWidth = comboBoxWidth - itemXMargin - 0.5 * firstItemNode.height - 4 * buttonXMargin - 2 * itemXMargin - 2 * comboBoxLineWidth;
    firstItemNode.addChild( new HStrut( firstItemNodeWidth ) );

    const comboBoxItems = [];
    comboBoxItems[ 0 ] = new ComboBoxItem( firstItemNode, objectTypes[ 0 ], { tandemName: objectTypes[ 0 ].benchmark } );

    for ( let i = 1; i < objectTypes.length; i++ ) {
      const projectileObject = objectTypes[ i ];
      comboBoxItems[ i ] = new ComboBoxItem( new Text( projectileObject.name, itemNodeOptions ), projectileObject, {
        tandemName: projectileObject.benchmark
      } );
    }

    // create view for the dropdown
    const projectileChoiceComboBox = new ComboBox(
      comboBoxItems,
      selectedProjectileObjectTypeProperty,
      comboBoxListParent, {
        xMargin: 12,
        yMargin: 8,
        cornerRadius: 4,
        buttonLineWidth: comboBoxLineWidth,
        listLineWidth: comboBoxLineWidth,
        tandem: tandem.createTandem( 'projectileChoiceComboBox' )
      }
    );

    // @private make visible to methods
    this.projectileChoiceComboBox = projectileChoiceComboBox;

    // local vars for layout and formatting
    const textDisplayWidth = options.textDisplayWidth * 1.4;
    const valueLabelOptions = _.defaults( {
      cursor: 'pointer',
      backgroundStroke: 'black',
      decimalPlaces: null,
      cornerRadius: 4,
      xMargin: 4,
      minBackgroundWidth: textDisplayWidth,
      numberMaxWidth: textDisplayWidth - 2 * options.readoutXMargin
    }, NUMBER_DISPLAY_OPTIONS );

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} valueProperty - the Property that is set and linked to
     * @param {Range} range - range for the valueProperty value
     * @param {Tandem} tandem
     * @returns {VBox}
     */
    function createParameterControlBox( labelString, unitsString, valueProperty, range, tandem ) {

      // label
      const parameterLabel = new Text( labelString, merge( { tandem: tandem.createTandem( 'label' ) }, LABEL_OPTIONS ) );

      // value text
      const valuePattern = unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        units: unitsString
      } ) : StringUtils.fillIn( pattern0Value1UnitsString, {
        units: ''
      } );

      const numberDisplay = new NumberDisplay(
        valueProperty,
        range,
        merge( valueLabelOptions, { tandem: tandem.createTandem( 'numberDisplay' ), valuePattern: valuePattern } )
      );

      const editValue = function() {
        keypadLayer.beginEdit( valueProperty, range, unitsString, {
          onBeginEdit: function() { numberDisplay.backgroundFill = PhetColorScheme.BUTTON_YELLOW; },
          onEndEdit: function() { numberDisplay.backgroundFill = 'white'; }
        } );
      };

      // edit button
      const pencilIcon = new FontAwesomeNode( 'pencil_square_o', { scale: 0.35 } );
      const editButton = new RectangularPushButton( {
        minWidth: 25,
        minHeight: 20,
        centerY: numberDisplay.centerY,
        left: numberDisplay.right + options.xMargin,
        content: pencilIcon,
        baseColor: PhetColorScheme.BUTTON_YELLOW,
        listener: editValue,
        tandem: tandem.createTandem( 'editButton' )
      } );

      numberDisplay.addInputListener( new DownUpListener( { // no removeInputListener required
        down: editValue
      } ) );

      const valueNode = new Node( { children: [ numberDisplay, editButton ] } );

      parameterLabel.setMaxWidth( options.minWidth - 4 * options.xMargin - valueNode.width );

      const xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueNode.width;

      return new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } );
    }

    // layout function for the number controls
    const layoutFunction = function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
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

    const defaultNumberControlOptions = {
      titleNodeOptions: { font: TEXT_FONT },
      numberDisplayOptions: {
        maxWidth: textDisplayWidth,
        align: 'right',
        xMargin: READOUT_X_MARGIN,
        yMargin: 4,
        font: TEXT_FONT
      },
      sliderOptions: {
        majorTickLength: 5,
        trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 80, 0.5 ),
        thumbSize: new Dimension2( 13, 22 ),
        thumbTouchAreaXDilation: 6,
        thumbTouchAreaYDilation: 4
      },
      arrowButtonOptions: {
        scale: 0.56,
        touchAreaXDilation: 20,
        touchAreaYDilation: 20
      },
      layoutFunction: layoutFunction
    };

    // readout, slider, and tweakers

    // local vars for improving readability and tracking control boxes
    // __Box such as massBox is the parent of the control, and it is a child of Panel
    // __SpecificProjectileTypeBox is a number control for when a benchmark is selected from the dropdown
    // __CustomBox is a control box with label, readout, and edit button for when Custom is selected from the dropdown
    const massBox = new Node();
    const diameterBox = new Node();
    const dragCoefficientBox = new Node();
    const altitudeBox = new Node();
    const gravityBox = new Node();
    let massSpecificProjectileNumberControl = null;
    let diameterSpecificProjectileTypeNumberControl = null;
    let dragCoefficientSpecificProjectileTypeNumberControl = null;
    let altitudeSpecificProjectileTypeNumberControl = null;
    let gravitySpecificProjectileTypeNumberControl = null;
    let massCustomBox = null;
    let diameterCustomBox = null;
    let dragCoefficientCustomBox = null;
    let altitudeCustomBox = null;
    let gravityCustomBox = null;

    // update the type of control based on the objectType
    selectedProjectileObjectTypeProperty.link( function( objectType ) {
      if ( objectType.benchmark !== 'custom' ) {
        if ( massCustomBox && massBox.hasChild( massCustomBox ) ) {

          // if there are already custom boxes, remove them

          massBox.removeChild( massCustomBox );
          diameterBox.removeChild( diameterCustomBox );
          dragCoefficientBox.removeChild( dragCoefficientCustomBox );
          altitudeBox.removeChild( altitudeCustomBox );
          gravityBox.removeChild( gravityCustomBox );
        }
        if ( massSpecificProjectileNumberControl ) {

          // if there are already benchmark boxes, remove them

          massSpecificProjectileNumberControl.dispose();
          diameterSpecificProjectileTypeNumberControl.dispose();
          dragCoefficientSpecificProjectileTypeNumberControl.dispose();
          altitudeSpecificProjectileTypeNumberControl.dispose();
          gravitySpecificProjectileTypeNumberControl.dispose();
        }

        massSpecificProjectileNumberControl = new NumberControl(
          massString,
          projectileMassProperty,
          objectType.massRange,
          merge( {
            delta: objectType.massRound,
            numberDisplayOptions: {

              // '{{value}} kg'
              valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: kgString } ),
              decimalPlaces: Math.ceil( -Util.log10( objectType.massRound ) )
            },
            sliderOptions: {
              constrainValue: function( value ) { return Util.roundSymmetric( value / objectType.massRound ) * objectType.massRound; },
              majorTicks: [ {
                value: objectType.massRange.min,
                label: new Text( objectType.massRange.min, LABEL_OPTIONS )
              }, {
                value: objectType.massRange.max,
                label: new Text( objectType.massRange.max, LABEL_OPTIONS )
              } ]
            },
            tandem: tandem.createTandem( 'massSpecificProjectileNumberControl' )
          }, defaultNumberControlOptions ) );

        diameterSpecificProjectileTypeNumberControl = new NumberControl(
          diameterString, projectileDiameterProperty,
          objectType.diameterRange,
          merge( {
            delta: objectType.diameterRound,
            numberDisplayOptions: {

              // '{{value}} m'
              valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: mString } ),
              decimalPlaces: Math.ceil( -Util.log10( objectType.diameterRound ) )
            },
            sliderOptions: {
              constrainValue: value => Util.roundSymmetric( value / objectType.diameterRound ) * objectType.diameterRound,
              majorTicks: [ {
                value: objectType.diameterRange.min,
                label: new Text( objectType.diameterRange.min, LABEL_OPTIONS )
              }, {
                value: objectType.diameterRange.max,
                label: new Text( objectType.diameterRange.max, LABEL_OPTIONS )
              } ]
            },
            tandem: tandem.createTandem( 'diameterSpecificProjectileTypeNumberControl' )
          }, defaultNumberControlOptions ) );

        gravitySpecificProjectileTypeNumberControl = new NumberControl(
          gravityString,
          gravityProperty,
          ProjectileMotionConstants.GRAVITY_RANGE,
          merge( {
            delta: 0.01,
            numberDisplayOptions: {

              // '{{value}} m/s^2
              valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
                units: metersPerSecondSquaredString
              } ),
              decimalPlaces: 2,
              xMargin: GRAVITY_READOUT_X_MARGIN,
              maxWidth: textDisplayWidth + GRAVITY_READOUT_X_MARGIN
            },
            sliderOptions: {
              constrainValue: value => Util.roundSymmetric( value * 100 ) / 100
            },
            tandem: tandem.createTandem( 'gravitySpecificProjectileTypeNumberControl' )
          }, defaultNumberControlOptions )
        );

        altitudeSpecificProjectileTypeNumberControl = new NumberControl(
          altitudeString, altitudeProperty,
          ProjectileMotionConstants.ALTITUDE_RANGE,
          merge( {
            delta: 100,
            numberDisplayOptions: {

              // '{{value}} m'
              valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: mString } ),
              decimalPlaces: 0
            },
            sliderOptions: {
              constrainValue: value => Util.roundSymmetric( value / 100 ) * 100
            },
            tandem: tandem.createTandem( 'altitudeSpecificProjectileTypeNumberControl' )
          }, defaultNumberControlOptions, )
        );
        dragCoefficientSpecificProjectileTypeNumberControl = new Text( dragCoefficientString + ': ' + Util.toFixed( projectileDragCoefficientProperty.get(), 2 ), _.defaults( { maxWidth: options.minWidth - 2 * options.xMargin }, LABEL_OPTIONS ) );
        massBox.addChild( massSpecificProjectileNumberControl );
        diameterBox.addChild( diameterSpecificProjectileTypeNumberControl );
        dragCoefficientBox.addChild( dragCoefficientSpecificProjectileTypeNumberControl );
        altitudeBox.addChild( altitudeSpecificProjectileTypeNumberControl );
        gravityBox.addChild( gravitySpecificProjectileTypeNumberControl );
      }
      else {
        if ( massSpecificProjectileNumberControl && massBox.hasChild( massSpecificProjectileNumberControl ) ) {

          // if there are already benchmark boxes, remove them

          massBox.removeChild( massSpecificProjectileNumberControl );
          diameterBox.removeChild( diameterSpecificProjectileTypeNumberControl );
          dragCoefficientBox.removeChild( dragCoefficientSpecificProjectileTypeNumberControl );
          altitudeBox.removeChild( altitudeSpecificProjectileTypeNumberControl );
          gravityBox.removeChild( gravitySpecificProjectileTypeNumberControl );
        }
        if ( !massCustomBox ) {
          massCustomBox = createParameterControlBox(
            massString,
            kgString,
            projectileMassProperty,
            objectType.massRange,
            tandem.createTandem( 'massCustomBox' )
          );
          diameterCustomBox = createParameterControlBox(
            diameterString,
            mString,
            projectileDiameterProperty,
            objectType.diameterRange,
            tandem.createTandem( 'diameterCustomBox' )
          );
          gravityCustomBox = createParameterControlBox(
            gravityString,
            metersPerSecondSquaredString,
            gravityProperty,
            ProjectileMotionConstants.GRAVITY_RANGE,
            tandem.createTandem( 'gravityCustomBox' )
          );
          altitudeCustomBox = createParameterControlBox(
            altitudeString,
            mString,
            altitudeProperty,
            ProjectileMotionConstants.ALTITUDE_RANGE,
            tandem.createTandem( 'altitudeCustomBox' )
          );
          dragCoefficientCustomBox = createParameterControlBox(
            dragCoefficientString,
            null,
            projectileDragCoefficientProperty,
            objectType.dragCoefficientRange,
            tandem.createTandem( 'dragCoefficientCustomBox' )
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
      const opacity = airResistanceOn ? 1 : 0.5;
      altitudeBox.opacity = opacity;
      dragCoefficientBox.opacity = opacity;
      altitudeBox.setPickable( airResistanceOn );
      dragCoefficientBox.setPickable( airResistanceOn );
    } );

    // air resistance
    const airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    const airResistanceCheckbox = new Checkbox( airResistanceLabel, airResistanceOnProperty, {
      maxWidth: options.minWidth - AIR_RESISTANCE_ICON.width - 3 * options.xMargin,
      boxWidth: 18,
      tandem: tandem.createTandem( 'airResistanceCheckbox' )
    } );
    const airResistanceCheckboxAndIcon = new HBox( {
      spacing: options.xMargin,
      children: [ airResistanceCheckbox, AIR_RESISTANCE_ICON ]
    } );

    // The contents of the control panel
    const content = new VBox( {
      align: 'center',
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
      this.projectileChoiceComboBox.hideListBox();
    }
  } );
} );


