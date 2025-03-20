// Copyright 2017-2025, University of Colorado Boulder

/**
 * Control panel that allows users to modify initial values for how the cannon fires a projectile.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants, { ProjectileMotionUIOptions } from '../../common/ProjectileMotionConstants.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import VarianceNumberProperty from '../../../../axon/js/VarianceNumberProperty.js';

const angleString = ProjectileMotionStrings.angle;
const heightString = ProjectileMotionStrings.height;
const initialValuesString = ProjectileMotionStrings.initialValues;
const metersPerSecondString = ProjectileMotionStrings.metersPerSecond;
const mString = ProjectileMotionStrings.m;
const pattern0Value1UnitsString = ProjectileMotionStrings.pattern0Value1Units;
const pattern0Value1UnitsWithSpaceString = ProjectileMotionStrings.pattern0Value1UnitsWithSpace;
const speedString = ProjectileMotionStrings.speed;

// constants
const TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
const DEGREES = MathSymbols.DEGREES;

type SelfOptions = EmptySelfOptions;
type InitialValuesPanelOptions = SelfOptions & PanelOptions;

class InitialValuesPanel extends Panel {

  public constructor( cannonHeightProperty: Property<number>, cannonAngleProperty: VarianceNumberProperty, initialSpeedProperty: VarianceNumberProperty, providedOptions: InitialValuesPanelOptions ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    const options = optionize<InitialValuesPanelOptions, SelfOptions, ProjectileMotionUIOptions>()(
      combineOptions<ProjectileMotionUIOptions>( ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
        yMargin: 5,
        tandem: Tandem.REQUIRED
      } ), providedOptions );

    // Max width for all components in this panel
    const maxWidth = options.minWidth - 2 * options.xMargin;

    /**
     * Auxiliary function that creates VBox for a parameter label and slider
     */
    function createReadout( labelString: string, unitsString: string | null, valueProperty: Property<number>, tandem: Tandem, degreeString: string | null ): VBox {
      const parameterLabel = new Text( '', combineOptions<TextOptions>( LABEL_OPTIONS, {
        maxWidth: maxWidth,

        // phet-io
        tandem: tandem,
        stringPropertyOptions: { phetioReadOnly: true }
      } ) );

      valueProperty.link( value => {
        const valueReadout = degreeString ?
                             StringUtils.fillIn( pattern0Value1UnitsString, {
                               value: toFixedNumber( value, 2 ),
                               units: degreeString
                             } ) :
                             StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
                               value: toFixedNumber( value, 2 ),
                               units: unitsString
                             } );
        parameterLabel.setString( `${labelString}: ${valueReadout}` );
      } );

      return new VBox( {
        align: 'left',
        children: [ parameterLabel, new HStrut( maxWidth ) ]
      } );
    }

    const heightText = createReadout(
      heightString,
      mString,
      cannonHeightProperty,
      options.tandem.createTandem( 'heightText' ),
      null
    );

    const angleText = createReadout(
      angleString,
      null,
      cannonAngleProperty,
      options.tandem.createTandem( 'angleText' ),
      DEGREES
    );

    const velocityText = createReadout(
      speedString,
      metersPerSecondString,
      initialSpeedProperty,
      options.tandem.createTandem( 'velocityText' ),
      null
    );

    // contents of the panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace / 3,
      children: [
        heightText,
        angleText,
        velocityText
      ]
    } );

    const titleText = new Text( initialValuesString, _.merge( {}, TITLE_OPTIONS, {
      maxWidth: maxWidth,
      tandem: options.tandem.createTandem( 'titleText' )
    } ) );

    const initialValuesVBox = new VBox( {
      align: 'center',
      spacing: 0,
      children: [
        titleText,
        content
      ]
    } );

    super( initialValuesVBox, options );
  }
}

projectileMotion.register( 'InitialValuesPanel', InitialValuesPanel );
export default InitialValuesPanel;