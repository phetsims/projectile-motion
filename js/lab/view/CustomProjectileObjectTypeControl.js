// Copyright 2019, University of Colorado Boulder

/**
 * The controls for the "custom" projectil type. This is a special type because, unlike the others, for this type the
 * projectile panel is populated with controls to adjust values via a Keypad (instead of just NumberControl).
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const FireListener = require( 'SCENERY/listeners/FireListener' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const ProjectileObjectTypeControl = require( 'PROJECTILE_MOTION/lab/view/ProjectileObjectTypeControl' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
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

  class CustomProjectileObjectTypeControl extends ProjectileObjectTypeControl {

    /**
     * @private
     * @param {LabModel} model
     * @param {KeypadLayer} keypadLayer
     * @param {ProjectileObjectType} objectType
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( model, keypadLayer, objectType, tandem, options ) {

      // arbitrary values, as these should be provided by the LabProjectilePanel
      options = merge( {
        xMargin: 5,
        minWidth: 200,
        readoutXMargin: 20,
        textDisplayWidth: 50
      }, options );

      // Instead of passing up parameters here, set them after the fact. After contruction all members will be set
      // correctly
      super();

      // @private
      this.keypadLayer = keypadLayer;
      this.options = options;

      // mass
      this.massControl = this.createCustomControl(
        massString,
        kgString,
        model.projectileMassProperty,
        objectType.massRange,
        tandem.createTandem( 'massControl' )
      );

      // diameter
      this.diameterControl = this.createCustomControl(
        diameterString,
        mString,
        model.projectileDiameterProperty,
        objectType.diameterRange,
        tandem.createTandem( 'diameterControl' )
      );

      // gravity
      this.gravityControl = this.createCustomControl(
        gravityString,
        metersPerSecondSquaredString,
        model.gravityProperty,
        ProjectileMotionConstants.GRAVITY_RANGE,
        tandem.createTandem( 'gravityControl' )
      );

      // altitude
      this.altitudeControl = this.createCustomControl(
        altitudeString,
        mString,
        model.altitudeProperty,
        ProjectileMotionConstants.ALTITUDE_RANGE,
        tandem.createTandem( 'altitudeControl' )
      );

      // dragCoefficient
      this.dragCoefficientControl = this.createCustomControl(
        dragCoefficientString,
        null,
        model.projectileDragCoefficientProperty,
        model.projectileDragCoefficientProperty.range,
        tandem.createTandem( 'dragCoefficientControl' )
      );
    }


    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} valueProperty - the Property that is set and linked to
     * @param {Range} range - range for the valueProperty value
     * @param {Tandem} tandem
     * @returns {VBox}
     */
    createCustomControl( labelString, unitsString, valueProperty, range, tandem ) {

      // label
      const parameterLabel = new Text( labelString, merge( { tandem: tandem.createTandem( 'label' ) }, LABEL_OPTIONS ) );

      // value text
      const valuePattern = unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        units: unitsString
      } ) : StringUtils.fillIn( pattern0Value1UnitsString, {
        units: ''
      } );

      const valueLabelOptions = merge( {}, NUMBER_DISPLAY_OPTIONS, {
        cursor: 'pointer',
        backgroundStroke: 'black',
        decimalPlaces: null,
        cornerRadius: 4,
        xMargin: 4,
        minBackgroundWidth: this.options.textDisplayWidth,
        numberMaxWidth: this.options.textDisplayWidth - 2 * this.options.readoutXMargin
      } );

      const numberDisplayTandem = tandem.createTandem( 'numberDisplay' );
      const numberDisplay = new NumberDisplay(
        valueProperty,
        range,
        merge( valueLabelOptions, { tandem: numberDisplayTandem, valuePattern: valuePattern } )
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
        tandem: tandem.createTandem( 'editButton' ),
        phetioDocumentation: 'the button to open the keypad to adjust the value'
      } );

      numberDisplay.addInputListener( new FireListener( { // no removeInputListener required
        fire: editValue,
        fireOnDown: true,
        tandem: numberDisplayTandem.createTandem( 'fireListener' ),
        phetioDocumentation: 'When fired, calls listener to open UI to edit the value for this NumberDisplay'
      } ) );

      const valueNode = new Node( { children: [ numberDisplay, editButton ] } );

      parameterLabel.setMaxWidth( this.options.minWidth - 4 * this.options.xMargin - valueNode.width );

      const xSpacing = this.options.minWidth - 2 * this.options.xMargin - parameterLabel.width - valueNode.width;

      return new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ], tandem: tandem } );
    }
  }

  return projectileMotion.register( 'CustomProjectileObjectTypeControl', CustomProjectileObjectTypeControl );
} );
