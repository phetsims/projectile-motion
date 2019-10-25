// Copyright 2016-2019, University of Colorado Boulder

/**
 * Control panel that allows users to alter Properties of the projectile fired.
 * Also includes a slider for changing altitude, which changes air density.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HSlider = require( 'SUN/HSlider' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Panel = require( 'SUN/Panel' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const airResistanceString = require( 'string!PROJECTILE_MOTION/airResistance' );
  const cannonballString = require( 'string!PROJECTILE_MOTION/cannonball' );
  const diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  const dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );
  const kgString = require( 'string!PROJECTILE_MOTION/kg' );
  const massString = require( 'string!PROJECTILE_MOTION/mass' );
  const mString = require( 'string!PROJECTILE_MOTION/m' );
  const pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );

  // constants
  const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

  const DRAG_OBJECT_DISPlAY_DIAMETER = 24;
  const AIR_RESISTANCE_ICON = ProjectileMotionConstants.AIR_RESISTANCE_ICON;

  /**
   * @param {Property.<ProjectiLeObjectType} selectedObjectTypeProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<boolean>} airResistanceOnProperty - whether air resistance is on
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function VectorsProjectilePanel( selectedObjectTypeProperty,
                                   projectileDiameterProperty,
                                   projectileMassProperty,
                                   airResistanceOnProperty,
                                   projectileDragCoefficientProperty,
                                   tandem,
                                   options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, { textDisplayWidth: 45 }, options );

    // local vars for layout and formatting
    const textDisplayWidth = options.textDisplayWidth * 1.2;
    const parameterLabelOptions = merge( {}, LABEL_OPTIONS, {
      maxWidth: options.minWidth - 3 * options.xMargin - textDisplayWidth
    } );

    /**
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} valueProperty - the Property that is set and linked to
     * @param {Range} range - range for the valueProperty value
     * @param {Number} round - optional, for minor ticks
     * @param {Tandem} tandem
     * @returns {VBox}
     */
    function createParameterControlBox( labelString, unitsString, valueProperty, range, round, tandem ) {

      // label
      const parameterLabel = new Text( labelString, merge( { tandem: tandem.createTandem( 'label' ) }, parameterLabelOptions ) );

      const numberDisplay = new NumberDisplay(
        valueProperty,
        range,
        merge( {}, ProjectileMotionConstants.NUMBER_DISPLAY_OPTIONS, {
          valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: unitsString } ),
          decimalPlaces: null,
          tandem: tandem.createTandem( 'numberDisplay' )
        } )
      );

      const slider = new HSlider( valueProperty, range, {
        constrainValue: function( value ) { return Util.roundToInterval( value, round ); }, // two decimal place accuracy
        majorTickLength: 12,
        minorTickLength: 5,
        tickLabelSpacing: 2,
        trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 30, 0.5 ),
        thumbSize: new Dimension2( 13, 22 ),
        thumbTouchAreaXDilation: 6,
        thumbTouchAreaYDilation: 4, // smaller to prevent overlap with above number spinner buttons
        tandem: tandem.createTandem( 'slider' )
      } );
      slider.addMajorTick( range.min, new Text( range.min, LABEL_OPTIONS ) );
      slider.addMajorTick( range.max, new Text( range.max, LABEL_OPTIONS ) );

      if ( round ) {
        for ( let i = range.min + round; i < range.max; i += round ) {
          slider.addMinorTick( i );
        }
      }

      const xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - numberDisplay.width;
      return new VBox( {
        spacing: options.sliderLabelSpacing, children: [
          new HBox( { spacing: xSpacing, children: [ parameterLabel, numberDisplay ] } ),
          slider
        ]
      } );
    }

    // drag coefficient object shape view
    const objectView = ProjectileObjectViewFactory.createCustom( DRAG_OBJECT_DISPlAY_DIAMETER, ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT );
    const objectDisplay = new HBox( {
      spacing: options.xMargin,
      children: [
        new Text( cannonballString, merge( {}, LABEL_OPTIONS, {
          maxWidth: options.minWidth - 3 * options.xMargin - objectView.width
        } ) ),
        objectView
      ]
    } );

    const diameterControlBox = createParameterControlBox(
      diameterString,
      mString,
      projectileDiameterProperty,
      selectedObjectTypeProperty.get().diameterRange,
      selectedObjectTypeProperty.get().diameterRound,
      tandem.createTandem( 'diameterControlBox' )
    );

    const massControlBox = createParameterControlBox(
      massString,
      kgString,
      projectileMassProperty,
      selectedObjectTypeProperty.get().massRange,
      selectedObjectTypeProperty.get().massRound,
      tandem.createTandem( 'massControlBox' )
    );

    const dragCoefficientText = new Text( '', merge( {}, LABEL_OPTIONS, {
      maxWidth: options.minWidth - 2 * options.xMargin,
      tandem: tandem.createTandem( 'dragCoefficientReadout' ),
      phetioComponentOptions: { textProperty: { phetioReadOnly: true } } // because this display shouldn't be edited
    } ) );

    // air resistance
    const airResistanceText = new Text( airResistanceString, merge( {}, LABEL_OPTIONS, {
      tandem: tandem.createTandem( 'airResistanceText' )
    } ) );
    const airResistanceCheckboxContent = new HBox( {
      spacing: options.xMargin,
      children: [ airResistanceText, new Node( { children: [ AIR_RESISTANCE_ICON ] } ) ]
    } );

    const airResistanceCheckbox = new Checkbox( airResistanceCheckboxContent, airResistanceOnProperty, {
      maxWidth: options.minWidth - 3 * options.xMargin, // left, right, and spacing between text and icon
      boxWidth: 18,
      tandem: tandem.createTandem( 'airResistanceCheckbox' )
    } );

    // disabling and enabling drag and altitude controls depending on whether air resistance is on
    airResistanceOnProperty.link( airResistanceOn => {
      const opacity = airResistanceOn ? 1 : 0.5;
      dragCoefficientText.setOpacity( opacity );
    } );

    // Listen to changes in model drag coefficient and update the view text
    projectileDragCoefficientProperty.link( value => {
      dragCoefficientText.setText( dragCoefficientString + ': ' + Util.toFixed( value, 2 ) );
    } );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        objectDisplay,
        diameterControlBox,
        massControlBox,
        new Line( 0, 0, options.minWidth - 2 * options.xMargin, 0, { stroke: 'gray' } ),
        airResistanceCheckbox,
        dragCoefficientText
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'VectorsProjectilePanel', VectorsProjectilePanel );

  return inherit( Panel, VectorsProjectilePanel );
} );

