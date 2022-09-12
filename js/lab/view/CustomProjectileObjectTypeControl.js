// Copyright 2019-2022, University of Colorado Boulder

/**
 * The controls for the "custom" projectile type. This is a special type because, unlike the others, for this type the
 * projectile panel is populated with controls to adjust values via a Keypad (instead of just NumberControl).
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { AlignBox, AlignGroup, Color, FireListener, HStrut, Node, Path, Text } from '../../../../scenery/js/imports.js';
import editSolidShape from '../../../../sherpa/js/fontawesome-5/editSolidShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import ProjectileObjectTypeControl from './ProjectileObjectTypeControl.js';

const altitudeString = ProjectileMotionStrings.altitude;
const diameterString = ProjectileMotionStrings.diameter;
const dragCoefficientString = ProjectileMotionStrings.dragCoefficient;
const gravityString = ProjectileMotionStrings.gravity;
const kgString = ProjectileMotionStrings.kg;
const massString = ProjectileMotionStrings.mass;
const metersPerSecondSquaredString = ProjectileMotionStrings.metersPerSecondSquared;
const mString = ProjectileMotionStrings.m;
const pattern0Value1UnitsString = ProjectileMotionStrings.pattern0Value1Units;
const pattern0Value1UnitsWithSpaceString = ProjectileMotionStrings.pattern0Value1UnitsWithSpace;

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

    // arbitrary values, as these should be provided by the LabProjectileControlPanel
    options = merge( {
      xMargin: 5,
      minWidth: 200,
      readoutXMargin: 20,
      textDisplayWidth: 50
    }, options );

    // Instead of passing up parameters here, set them after the fact. After construction all members will be set
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
      objectType.dragCoefficientRange,
      tandem.createTandem( 'dragCoefficientControl' )
    );
  }


  /**
   * Auxiliary function that creates VBox for a parameter label and readouts
   * @param {string} labelString - label for the parameter
   * @param {string} unitsString - units
   * @param {Property.<number>} valueProperty - the Property that is set and linked to
   * @param {Range} range - range for the valueProperty value
   * @param {Tandem} tandem
   * @returns {VBox}
   * @private
   */
  createCustomControl( labelString, unitsString, valueProperty, range, tandem ) {

    // label
    const parameterLabel = new Text( labelString, merge( { tandem: tandem.createTandem( 'labelText' ) }, LABEL_OPTIONS ) );

    // value text
    const valuePattern = unitsString ? StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
      units: unitsString
    } ) : StringUtils.fillIn( pattern0Value1UnitsString, {
      units: ''
    } );

    const valueLabelOptions = merge( {}, NUMBER_DISPLAY_OPTIONS, {
      backgroundStroke: 'black',
      decimalPlaces: null,
      cornerRadius: 4,
      xMargin: 4,
      minBackgroundWidth: this.options.textDisplayWidth,
      textOptions: {
        maxWidth: this.options.textDisplayWidth - 2 * this.options.readoutXMargin
      }
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

    const editEnabledProperty = new BooleanProperty( true, { tandem: tandem.createTandem( 'editEnabledProperty' ) } );

    // edit button
    const pencilIcon = new Path( editSolidShape, { scale: 0.025, fill: Color.BLACK } );
    const editButton = new RectangularPushButton( {
      minWidth: 25,
      minHeight: 20,
      centerY: numberDisplay.centerY,
      left: numberDisplay.right + this.options.xMargin,
      content: pencilIcon,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      listener: editValue,
      enabledProperty: editEnabledProperty,

      // phet-io
      tandem: tandem.createTandem( 'editButton' ),
      phetioDocumentation: 'the button to open the keypad to adjust the value'
    } );

    numberDisplay.addInputListener( new FireListener( { // no removeInputListener required
      fire: editValue,
      fireOnDown: true,
      useInputListenerCursor: true,
      enabledProperty: editEnabledProperty,

      // phet-io
      tandem: numberDisplayTandem.createTandem( 'fireListener' ),
      phetioDocumentation: 'When fired, calls listener to open UI to edit the value for this NumberDisplay'
    } ) );

    const valueNode = new Node( { children: [ numberDisplay, editButton ] } );

    parameterLabel.setMaxWidth( this.options.minWidth - 4 * this.options.xMargin - valueNode.width );

    // size the components to be left/right justified, respectively, with space in the middle.
    const spacer = new HStrut( this.options.minWidth - 2 * this.options.xMargin );
    const group = new AlignGroup( { matchHorizontal: false } );

    const labelBox = new AlignBox( parameterLabel, { group: group } );
    labelBox.left = spacer.left;

    const valueBox = new AlignBox( valueNode, { group: group } );
    valueBox.right = spacer.right;

    return new Node( { children: [ spacer, labelBox, valueBox ], tandem: tandem } );
  }
}

projectileMotion.register( 'CustomProjectileObjectTypeControl', CustomProjectileObjectTypeControl );
export default CustomProjectileObjectTypeControl;