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

    // convenience variables as much of the logic in this type is in prototype functions only called on construction.
    // @private
    this.objectTypes = model.objectTypes;
    this.objectTypeControls = []; // {Array.<ObjectTypeControls>} same size as objectTypes, holds a Node that is the controls;
    this.keypadLayer = keypadLayer;
    this.model = model; // @private

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    // @private save them for later
    this.options = options;

    // @private - these number controls don't change between all "benchmarked" elements (not custom), so we can reuse them
    this.gravityNumberControl = null;
    this.altitudeNumberControl = null;

    // @private;
    this.textDisplayWidth = options.textDisplayWidth * 1.4;

    // maxWidth empirically determined for labels in the dropdown
    const itemNodeOptions = _.defaults( { maxWidth: 170 }, LABEL_OPTIONS );

    const firstItemNode = new VBox( {
      align: 'left',
      children: [
        new Text( this.objectTypes[ 0 ].name, itemNodeOptions )
      ]
    } );

    const comboBoxWidth = options.minWidth - 2 * options.xMargin;
    const itemXMargin = 6;
    const buttonXMargin = 10;
    const comboBoxLineWidth = 1;

    // first item contains horizontal strut that sets width of combo box
    const firstItemNodeWidth = comboBoxWidth - itemXMargin -
                               0.5 * firstItemNode.height -
                               4 * buttonXMargin -
                               2 * itemXMargin -
                               2 * comboBoxLineWidth;
    firstItemNode.addChild( new HStrut( firstItemNodeWidth ) );

    const comboBoxItems = [];
    for ( let i = 0; i < this.objectTypes.length; i++ ) {
      const projectileObject = this.objectTypes[ i ];

      comboBoxItems[ i ] = new ComboBoxItem( i === 0 ? firstItemNode : new Text( projectileObject.name, itemNodeOptions ),
        projectileObject, {
          tandemName: projectileObject.benchmark
        } );

      // Create the controls for tht objectType too.
      this.objectTypeControls.push( this.createControlsForObjectType( projectileObject, tandem, tandem.createTandem( `${projectileObject.benchmark}Control` ) ) );
    }

    // create view for the dropdown
    const projectileChoiceComboBox = new ComboBox(
      comboBoxItems,
      model.selectedProjectileObjectTypeProperty,
      comboBoxListParent, {
        xMargin: 12,
        yMargin: 8,
        cornerRadius: 4,
        buttonLineWidth: comboBoxLineWidth,
        listLineWidth: comboBoxLineWidth,
        tandem: tandem.createTandem( 'projectileChoiceComboBox' )
      } );

    // @private make visible to methods
    this.projectileChoiceComboBox = projectileChoiceComboBox;

    // readout, slider, and tweakers

    // These containers are added into the Panel as desired, and their children are changed as the object type does.
    const massBox = new Node();
    const diameterBox = new Node();
    const dragCoefficientBox = new Node();
    const altitudeBox = new Node();
    const gravityBox = new Node();

    // update the type of control based on the objectType
    model.selectedProjectileObjectTypeProperty.link( objectType => {
      const objectTypeControls = this.objectTypeControls[ this.objectTypes.indexOf( objectType ) ];
      massBox.children = [ objectTypeControls.massControl ];
      diameterBox.children = [ objectTypeControls.diameterControl ];
      dragCoefficientBox.children = [ objectTypeControls.dragCoefficientControl ];
      altitudeBox.children = [ objectTypeControls.altitudeControl ];
      gravityBox.children = [ objectTypeControls.gravityControl ];
    } );

    // disabling and enabling drag and altitude controls depending on whether air resistance is on
    model.airResistanceOnProperty.link( airResistanceOn => {
      const opacity = airResistanceOn ? 1 : 0.5;
      altitudeBox.opacity = opacity;
      dragCoefficientBox.opacity = opacity;
      altitudeBox.setPickable( airResistanceOn );
      dragCoefficientBox.setPickable( airResistanceOn );
    } );

    // air resistance
    const airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    const airResistanceLabelAndIcon = new HBox( {
      spacing: options.xMargin,
      children: [ airResistanceLabel, new Node( { children: [ AIR_RESISTANCE_ICON ] } ) ]
    } );
    const airResistanceCheckbox = new Checkbox( airResistanceLabelAndIcon, model.airResistanceOnProperty, {
      maxWidth: options.minWidth - AIR_RESISTANCE_ICON.width - 3 * options.xMargin,
      boxWidth: 18,
      tandem: tandem.createTandem( 'airResistanceCheckbox' )
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
        gravityBox,
        new Line( 0, 0, options.minWidth - 2 * options.xMargin, 0, { stroke: 'gray' } ),
        airResistanceCheckbox,
        altitudeBox,
        dragCoefficientBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'LabProjectilePanel', LabProjectilePanel );

  class ObjectTypeControls {
    constructor( massControl, diameterControl, gravityControl, altitudeControl, dragCoefficientControl ) {

      // @public (read-only) {Node}
      this.massControl = massControl;
      this.diameterControl = diameterControl;
      this.gravityControl = gravityControl;
      this.altitudeControl = altitudeControl;
      this.dragCoefficientControl = dragCoefficientControl;
    }
  }

  return inherit( Panel, LabProjectilePanel, {

    // @public for use by screen view
    hideComboBoxList: function() {
      this.projectileChoiceComboBox.hideListBox();
    },

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} valueProperty - the Property that is set and linked to
     * @param {Range} range - range for the valueProperty value
     * @param {Tandem} tandem
     * @returns {VBox}
     */
    createCustomParameterControlBox: function( labelString, unitsString, valueProperty, range, tandem ) {

      // label
      const parameterLabel = new Text( labelString, merge( { tandem: tandem.createTandem( 'label' ) }, LABEL_OPTIONS ) );

      // value text
      const valuePattern = unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        units: unitsString
      } ) : StringUtils.fillIn( pattern0Value1UnitsString, {
        units: ''
      } );

      const valueLabelOptions = _.defaults( {
        cursor: 'pointer',
        backgroundStroke: 'black',
        decimalPlaces: null,
        cornerRadius: 4,
        xMargin: 4,
        minBackgroundWidth: this.textDisplayWidth,
        numberMaxWidth: this.textDisplayWidth - 2 * this.options.readoutXMargin
      }, NUMBER_DISPLAY_OPTIONS );

      const numberDisplay = new NumberDisplay(
        valueProperty,
        range,
        merge( valueLabelOptions, { tandem: tandem.createTandem( 'numberDisplay' ), valuePattern: valuePattern } )
      );

      const editValue = () => {
        this.keypadLayer.beginEdit( valueProperty, range, unitsString, {
          onBeginEdit: () => { numberDisplay.backgroundFill = PhetColorScheme.BUTTON_YELLOW; },
          onEndEdit: () => { numberDisplay.backgroundFill = 'white'; }
        } );
      };

      // edit button
      const pencilIcon = new FontAwesomeNode( 'pencil_square_o', { scale: 0.35 } );
      const editButton = new RectangularPushButton( {
        minWidth: 25,
        minHeight: 20,
        centerY: numberDisplay.centerY,
        left: numberDisplay.right + this.options.xMargin,
        content: pencilIcon,
        baseColor: PhetColorScheme.BUTTON_YELLOW,
        listener: editValue,
        tandem: tandem.createTandem( 'editButton' )
      } );

      numberDisplay.addInputListener( new DownUpListener( { // no removeInputListener required
        down: editValue
      } ) );

      const valueNode = new Node( { children: [ numberDisplay, editButton ] } );

      parameterLabel.setMaxWidth( this.options.minWidth - 4 * this.options.xMargin - valueNode.width );

      const xSpacing = this.options.minWidth - 2 * this.options.xMargin - parameterLabel.width - valueNode.width;

      return new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } );
    },

    /**
     * Create the controls for the "custom" object type. This is involes a keypad to input custom numbers.
     * @private
     * @returns {ObjectTypeControls}
     */
    createControlsForCustomObjectType: function( objectType, tandem ) {

      // mass
      const massControl = this.createCustomParameterControlBox(
        massString,
        kgString,
        this.model.projectileMassProperty,
        objectType.massRange,
        tandem.createTandem( 'massControl' )
      );

      // diameter
      const diameterControl = this.createCustomParameterControlBox(
        diameterString,
        mString,
        this.model.projectileDiameterProperty,
        objectType.diameterRange,
        tandem.createTandem( 'diameterControl' )
      );

      // gravity
      const gravityControl = this.createCustomParameterControlBox(
        gravityString,
        metersPerSecondSquaredString,
        this.model.gravityProperty,
        ProjectileMotionConstants.GRAVITY_RANGE,
        tandem.createTandem( 'gravityControl' )
      );

      // altitude
      const altitudeControl = this.createCustomParameterControlBox(
        altitudeString,
        mString,
        this.model.altitudeProperty,
        ProjectileMotionConstants.ALTITUDE_RANGE,
        tandem.createTandem( 'altitudeControl' )
      );

      // dragCoefficient
      const dragCoefficientControl = this.createCustomParameterControlBox(
        dragCoefficientString,
        null,
        this.model.projectileDragCoefficientProperty,
        objectType.dragCoefficientRange,
        tandem.createTandem( 'dragCoefficientControl' )
      );
      return new ObjectTypeControls(
        massControl,
        diameterControl,
        gravityControl,
        altitudeControl,
        dragCoefficientControl );
    },

    /**
     * Given an objectType, create the controls needed for that type.
     * @private
     * @param {ProjectileObjectType} objectType
     * @param {Tandem} generalComponentTandem - used for the elements that can be reused between all elements
     * @param {Tandem} objectSpecificTandem - used for the elements that change for each object type
     * @returns {ObjectTypeControls}
     */
    createControlsForObjectType: function( objectType, generalComponentTandem, objectSpecificTandem ) {

      if ( objectType.benchmark === 'custom' ) {
        return this.createControlsForCustomObjectType( objectType, objectSpecificTandem );
      }
      else {

        // layout function for the number controls
        const layoutFunction = ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
          titleNode.setMaxWidth( this.options.minWidth - 3 * this.options.xMargin - numberDisplay.width );
          return new VBox( {
            spacing: this.options.sliderLabelSpacing,
            align: 'center',
            children: [
              new HBox( {
                spacing: this.options.minWidth - 2 * this.options.xMargin - titleNode.width - numberDisplay.width - 3,
                children: [ titleNode, numberDisplay ]
              } ),
              new HBox( {
                spacing: ( this.options.minWidth - 2 * this.options.xMargin - slider.width - leftArrowButton.width - rightArrowButton.width ) / 2 - 2,
                resize: false, // prevent slider from causing a resize when thumb is at min or max
                children: [ leftArrowButton, slider, rightArrowButton ]
              } )
            ]
          } );
        };

        const defaultNumberControlOptions = {
          titleNodeOptions: { font: TEXT_FONT },
          numberDisplayOptions: {
            maxWidth: this.textDisplayWidth,
            align: 'right',
            xMargin: READOUT_X_MARGIN,
            yMargin: 4,
            font: TEXT_FONT
          },
          sliderOptions: {
            majorTickLength: 5,
            trackSize: new Dimension2( this.options.minWidth - 2 * this.options.xMargin - 80, 0.5 ),
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

        const massNumberControl = new NumberControl(
          massString,
          this.model.projectileMassProperty,
          objectType.massRange,
          merge( {
            delta: objectType.massRound,
            numberDisplayOptions: {

              // '{{value}} kg'
              valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: kgString } ),
              decimalPlaces: Math.ceil( -Util.log10( objectType.massRound ) )
            },
            sliderOptions: {
              constrainValue: value => Util.roundSymmetric( value / objectType.massRound ) * objectType.massRound,
              majorTicks: [ {
                value: objectType.massRange.min,
                label: new Text( objectType.massRange.min, LABEL_OPTIONS )
              }, {
                value: objectType.massRange.max,
                label: new Text( objectType.massRange.max, LABEL_OPTIONS )
              } ]
            },
            tandem: objectSpecificTandem.createTandem( 'massNumberControl' )
          }, defaultNumberControlOptions ) );

        const diameterNumberControl = new NumberControl(
          diameterString, this.model.projectileDiameterProperty,
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
            tandem: objectSpecificTandem.createTandem( 'diameterNumberControl' )
          }, defaultNumberControlOptions ) );

        const gravityNumberControl = this.gravityNumberControl || new NumberControl(
          gravityString,
          this.model.gravityProperty,
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
              maxWidth: this.textDisplayWidth + GRAVITY_READOUT_X_MARGIN
            },
            sliderOptions: {
              constrainValue: value => Util.roundSymmetric( value * 100 ) / 100
            },
            tandem: generalComponentTandem.createTandem( 'gravityNumberControl' )
          }, defaultNumberControlOptions )
        );
        this.gravityNumberControl = gravityNumberControl;

        const altitudeNumberControl = this.altitudeNumberControl || new NumberControl(
          altitudeString, this.model.altitudeProperty,
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
            tandem: generalComponentTandem.createTandem( 'altitudeNumberControl' )
          }, defaultNumberControlOptions, )
        );
        this.altitudeNumberControl = altitudeNumberControl;

        const dragCoefficientText = new Text( '', _.defaults( {
          maxWidth: this.options.minWidth - 2 * this.options.xMargin
        }, LABEL_OPTIONS ) );

        // exists for the lifetime of the simulation
        this.model.projectileDragCoefficientProperty.link( dragCoefficient => {
          dragCoefficientText.text = dragCoefficientString + ': ' + Util.toFixed( dragCoefficient, 2 );
        } );

        return new ObjectTypeControls(
          massNumberControl,
          diameterNumberControl,
          gravityNumberControl,
          altitudeNumberControl,
          dragCoefficientText );
      }
    }
  } );
} );

