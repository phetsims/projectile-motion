// Copyright 2016-2022, University of Colorado Boulder

/**
 * Control panel that allows users to alter Properties of the projectile fired.
 * Also includes a slider for changing altitude, which changes air density.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { HBox, HSeparator, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import AirResistanceControl from '../../common/view/AirResistanceControl.js';
import ArrowlessNumberControl from '../../common/view/ArrowlessNumberControl.js';
import ProjectileObjectViewFactory from '../../common/view/ProjectileObjectViewFactory.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';

const cannonballString = ProjectileMotionStrings.cannonball;
const diameterString = ProjectileMotionStrings.diameter;
const kgString = ProjectileMotionStrings.kg;
const massString = ProjectileMotionStrings.mass;
const mString = ProjectileMotionStrings.m;

// constants
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

const DRAG_OBJECT_DISPLAY_DIAMETER = 24;

class VectorsProjectileControlPanel extends Panel {

  /**
   * @param {Property.<ProjectiLeObjectType} selectedObjectTypeProperty
   * @param {Property.<number>} projectileDiameterProperty
   * @param {Property.<number>} projectileMassProperty
   * @param {Property.<boolean>} airResistanceOnProperty - whether air resistance is on
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Object} [options]
   */
  constructor( selectedObjectTypeProperty,
               projectileDiameterProperty,
               projectileMassProperty,
               airResistanceOnProperty,
               projectileDragCoefficientProperty,
               options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {
      textDisplayWidth: 45,
      tandem: Tandem.REQUIRED
    }, options );

    // drag coefficient object shape view
    const objectView = ProjectileObjectViewFactory.createCustom( DRAG_OBJECT_DISPLAY_DIAMETER, ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT );
    const titleText = new Text( cannonballString, merge( {}, LABEL_OPTIONS, {
      maxWidth: options.minWidth - 3 * options.xMargin - objectView.width,
      tandem: options.tandem.createTandem( 'titleText' )
    } ) );
    titleText.visibleProperty.link( visible => {
      objectView.visible = visible;
    } );

    const objectDisplay = new HBox( {
      spacing: options.xMargin,
      children: [
        titleText,
        objectView
      ]
    } );

    const selectedObjectType = selectedObjectTypeProperty.get();

    const diameterNumberControl = new ArrowlessNumberControl(
      diameterString,
      mString,
      projectileDiameterProperty,
      selectedObjectType.diameterRange,
      selectedObjectType.diameterRound, {
        containerWidth: options.minWidth,
        xMargin: options.xMargin,
        numberDisplayMaxWidth: options.numberDisplayMaxWidth,
        tandem: options.tandem.createTandem( 'diameterNumberControl' ),
        phetioDocumentation: 'UI control to adjust the diameter of the projectile'
      }
    );

    const massNumberControl = new ArrowlessNumberControl(
      massString,
      kgString,
      projectileMassProperty,
      selectedObjectType.massRange,
      selectedObjectType.massRound, {
        containerWidth: options.minWidth,
        xMargin: options.xMargin,
        numberDisplayMaxWidth: options.numberDisplayMaxWidth,
        tandem: options.tandem.createTandem( 'massNumberControl' ),
        phetioDocumentation: 'UI control to adjust the mass of the projectile'
      }
    );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        objectDisplay,
        diameterNumberControl,
        massNumberControl,
        new HSeparator( { stroke: ProjectileMotionConstants.SEPARATOR_COLOR } ),
        new AirResistanceControl( airResistanceOnProperty, projectileDragCoefficientProperty, {
          labelOptions: LABEL_OPTIONS,
          minWidth: options.minWidth,
          xMargin: options.xMargin,
          spacing: options.controlsVerticalSpace,
          tandem: options.tandem.createTandem( 'airResistanceControl' )
        } )
      ]
    } );

    super( content, options );
  }
}

projectileMotion.register( 'VectorsProjectileControlPanel', VectorsProjectileControlPanel );
export default VectorsProjectileControlPanel;