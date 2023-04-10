// Copyright 2016-2023, University of Colorado Boulder

/**
 * Control panel allows the user to change a projectile's parameters
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import { HBox, HSeparator, HStrut, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import CustomProjectileObjectTypeControl from './CustomProjectileObjectTypeControl.js';
import ProjectileObjectTypeControl from './ProjectileObjectTypeControl.js';

const airResistanceString = ProjectileMotionStrings.airResistance;
const altitudeString = ProjectileMotionStrings.altitude;
const diameterString = ProjectileMotionStrings.diameter;
const dragCoefficientString = ProjectileMotionStrings.dragCoefficient;
const gravityString = ProjectileMotionStrings.gravity;
const kgString = ProjectileMotionStrings.kg;
const massString = ProjectileMotionStrings.mass;
const metersPerSecondSquaredString = ProjectileMotionStrings.metersPerSecondSquared;
const mString = ProjectileMotionStrings.m;
const pattern0Value1UnitsWithSpaceString = ProjectileMotionStrings.pattern0Value1UnitsWithSpace;

// constants
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
const TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
const READOUT_X_MARGIN = 4;
const AIR_RESISTANCE_ICON = ProjectileMotionConstants.AIR_RESISTANCE_ICON;
const GRAVITY_READOUT_X_MARGIN = 6;

class LabProjectileControlPanel extends Node {

  /**
   * @param {Node} comboBoxListParent - node for containing the combo box
   * @param {KeypadLayer} keypadLayer - for entering values
   * @param {LabModel} model
   * @param {Object} [options]
   */
  constructor( comboBoxListParent, keypadLayer, model, options ) {

    super();

    // convenience variables as much of the logic in this type is in prototype functions only called on construction.
    // @private
    this.objectTypes = model.objectTypes;
    this.objectTypeControls = []; // {Array.<ProjectileObjectTypeControl>} same size as objectTypes, holds a Node that is the controls;
    this.keypadLayer = keypadLayer;
    this.model = model; // @private

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
      tandem: Tandem.REQUIRED
    }, options );

    // @private save them for later
    this.options = options;

    // @private - these number controls don't change between all "benchmarked" elements (not custom), so we can reuse them
    this.gravityNumberControl = null;
    this.altitudeNumberControl = null;

    // @private;
    this.textDisplayWidth = options.textDisplayWidth * 1.4;

    // @private - toggle the visibility of all ProjectileObjectType mass NumberControls with a single Property. Created
    // for PhET-iO.
    this.massNumberControlsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'massNumberControlsVisibleProperty' )
    } );

    // @private - toggle the visibility of all ProjectileObjectType diameter NumberControls with a single Property. Created
    // for PhET-iO.
    this.diameterNumberControlsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'diameterNumberControlsVisibleProperty' )
    } );

    // maxWidth empirically determined for labels in the dropdown
    const itemNodeOptions = merge( {}, LABEL_OPTIONS, { maxWidth: 170 } );

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
      const projectileType = this.objectTypes[ i ];

      comboBoxItems[ i ] = {
        value: projectileType,
        createNode: () => ( i === 0 ) ? firstItemNode : new Text( projectileType.name, itemNodeOptions ),
        tandemName: `${projectileType.benchmark}${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      };

      // Create the controls for the projectileType too.
      this.objectTypeControls.push( this.createControlsForObjectType( projectileType, options.tandem, options.tandem.createTandem( `${projectileType.benchmark}Control` ) ) );
    }

    // creating the controls for each object type changes these values because of enabledRangeProperty listeners in the
    // NumberControls. Here reset back to the selectedProjectileObjectType to fix things. See
    // https://github.com/phetsims/projectile-motion/issues/213
    model.resetModelValuesToInitial();

    // create view for the dropdown
    const projectileChoiceComboBox = new ComboBox( model.selectedProjectileObjectTypeProperty, comboBoxItems, comboBoxListParent, {
      xMargin: 12,
      yMargin: 8,
      cornerRadius: 4,
      buttonLineWidth: comboBoxLineWidth,
      listLineWidth: comboBoxLineWidth,
      tandem: options.tandem.createTandem( 'projectileChoiceComboBox' ),
      phetioDocumentation: 'Combo box that selects what projectile type to launch from the cannon'
    } );

    // @private make visible to methods
    this.projectileChoiceComboBox = projectileChoiceComboBox;

    // readout, slider, and tweakers

    // These containers are added into the Panel as desired, and their children are changed as the object type does.
    const massBox = new Node( { excludeInvisibleChildrenFromBounds: true } );
    const diameterBox = new Node( { excludeInvisibleChildrenFromBounds: true } );
    const dragCoefficientBox = new Node( { excludeInvisibleChildrenFromBounds: true } );
    const altitudeBox = new Node( { excludeInvisibleChildrenFromBounds: true } );
    const gravityBox = new Node( { excludeInvisibleChildrenFromBounds: true } );

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
    const airResistanceCheckbox = new Checkbox( model.airResistanceOnProperty, airResistanceLabelAndIcon, {
      maxWidth: options.minWidth - AIR_RESISTANCE_ICON.width - 3 * options.xMargin,
      boxWidth: 18,
      tandem: options.tandem.createTandem( 'airResistanceCheckbox' )
    } );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        projectileChoiceComboBox,
        massBox,
        diameterBox,
        new HSeparator( { stroke: ProjectileMotionConstants.SEPARATOR_COLOR } ),
        gravityBox,
        new HSeparator( { stroke: ProjectileMotionConstants.SEPARATOR_COLOR } ),
        airResistanceCheckbox,
        altitudeBox,
        dragCoefficientBox
      ]
    } );

    this.addChild( new Panel( content, options ) );
  }

  /**
   * for use by screen view
   * @public
   */
  hideComboBoxList() {
    this.projectileChoiceComboBox.hideListBox();
  }

  /**
   * Given an objectType, create the controls needed for that type.
   * @param {ProjectileObjectType} objectType
   * @param {Tandem} generalComponentTandem - used for the elements that can be reused between all elements
   * @param {Tandem} objectSpecificTandem - used for the elements that change for each object type
   * @returns {ProjectileObjectTypeControl}
   * @private
   */
  createControlsForObjectType( objectType, generalComponentTandem, objectSpecificTandem ) {

    if ( objectType.benchmark === 'custom' ) {
      return new CustomProjectileObjectTypeControl( this.model, this.keypadLayer, objectType, objectSpecificTandem, {
        xMargin: this.options.xMargin,
        minWidth: this.options.minWidth,
        readoutXMargin: this.options.readoutXMargin,
        textDisplayWidth: this.textDisplayWidth
      } );
    }
    else {

      const defaultNumberControlOptions = {
        titleNodeOptions: {
          font: TEXT_FONT,

          // panel width - margins - numberDisplay margins and maxWidth
          maxWidth: this.options.minWidth - 3 * this.options.xMargin - 2 * READOUT_X_MARGIN - this.textDisplayWidth
        },
        numberDisplayOptions: {
          maxWidth: this.textDisplayWidth,
          align: 'right',
          xMargin: READOUT_X_MARGIN,
          yMargin: 4,
          textOptions: {
            font: TEXT_FONT
          }
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
        layoutFunction: NumberControl.createLayoutFunction4( {
          arrowButtonSpacing: 10
        } )
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
            decimalPlaces: Math.ceil( -Utils.log10( objectType.massRound ) )
          },
          sliderOptions: {
            constrainValue: value => Utils.roundSymmetric( value / objectType.massRound ) * objectType.massRound,
            majorTicks: [ {
              value: objectType.massRange.min,
              label: new Text( objectType.massRange.min, LABEL_OPTIONS )
            }, {
              value: objectType.massRange.max,
              label: new Text( objectType.massRange.max, LABEL_OPTIONS )
            } ]
          },
          tandem: objectSpecificTandem.createTandem( 'massNumberControl' ),
          phetioDocumentation: 'UI control to adjust the mass of the projectile'
        }, defaultNumberControlOptions ) );

      const diameterNumberControl = new NumberControl(
        diameterString, this.model.projectileDiameterProperty,
        objectType.diameterRange,
        merge( {
          delta: objectType.diameterRound,
          numberDisplayOptions: {

            // '{{value}} m'
            valuePattern: StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: mString } ),
            decimalPlaces: Math.ceil( -Utils.log10( objectType.diameterRound ) )
          },
          sliderOptions: {
            constrainValue: value => Utils.roundSymmetric( value / objectType.diameterRound ) * objectType.diameterRound,
            majorTicks: [ {
              value: objectType.diameterRange.min,
              label: new Text( objectType.diameterRange.min, LABEL_OPTIONS )
            }, {
              value: objectType.diameterRange.max,
              label: new Text( objectType.diameterRange.max, LABEL_OPTIONS )
            } ]
          },
          tandem: objectSpecificTandem.createTandem( 'diameterNumberControl' ),
          phetioDocumentation: 'UI control to adjust the diameter of the projectile'
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
            constrainValue: value => Utils.roundSymmetric( value * 100 ) / 100
          },
          tandem: generalComponentTandem.createTandem( 'gravityNumberControl' ),
          phetioDocumentation: 'UI control to adjust the force of gravity on the projectile'
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
            constrainValue: value => Utils.roundSymmetric( value / 100 ) * 100
          },
          tandem: generalComponentTandem.createTandem( 'altitudeNumberControl' ),
          phetioDocumentation: 'UI control to adjust the altitude of position where the projectile is being launched'
        }, defaultNumberControlOptions )
      );
      this.altitudeNumberControl = altitudeNumberControl;

      const dragCoefficientText = new Text( '', merge( {}, LABEL_OPTIONS, {
        maxWidth: this.options.minWidth - 2 * this.options.xMargin
      } ) );

      // exists for the lifetime of the simulation
      this.model.projectileDragCoefficientProperty.link( dragCoefficient => {
        dragCoefficientText.string = `${dragCoefficientString}: ${Utils.toFixed( dragCoefficient, 2 )}`;
      } );


      // One direction of control. Instead of linking both to each other. This allows a single, global control to switch
      // all types' visibility at once, while also allowing a single numberControl the flexibility to hide itself.
      this.massNumberControlsVisibleProperty.link( visible => {
        massNumberControl.visibleProperty.value = visible;
      } );
      this.diameterNumberControlsVisibleProperty.link( visible => {
        diameterNumberControl.visibleProperty.value = visible;
      } );

      return new ProjectileObjectTypeControl(
        massNumberControl,
        diameterNumberControl,
        gravityNumberControl,
        altitudeNumberControl,
        dragCoefficientText );
    }
  }
}

projectileMotion.register( 'LabProjectileControlPanel', LabProjectileControlPanel );
export default LabProjectileControlPanel;