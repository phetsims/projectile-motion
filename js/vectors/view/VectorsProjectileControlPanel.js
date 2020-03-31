// Copyright 2016-2020, University of Colorado Boulder

/**
 * Control panel that allows users to alter Properties of the projectile fired.
 * Also includes a slider for changing altitude, which changes air density.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import AirResistanceControl from '../../common/view/AirResistanceControl.js';
import ArrowlessNumberControl from '../../common/view/ArrowlessNumberControl.js';
import ProjectileObjectViewFactory from '../../common/view/ProjectileObjectViewFactory.js';
import projectileMotionStrings from '../../projectileMotionStrings.js';
import projectileMotion from '../../projectileMotion.js';

const cannonballString = projectileMotionStrings.cannonball;
const diameterString = projectileMotionStrings.diameter;
const kgString = projectileMotionStrings.kg;
const massString = projectileMotionStrings.mass;
const mString = projectileMotionStrings.m;

// constants
const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

const DRAG_OBJECT_DISPLAY_DIAMETER = 24;

/**
 * @param {Property.<ProjectiLeObjectType} selectedObjectTypeProperty
 * @param {Property.<number>} projectileDiameterProperty
 * @param {Property.<number>} projectileMassProperty
 * @param {Property.<boolean>} airResistanceOnProperty - whether air resistance is on
 * @param {Property.<number>} projectileDragCoefficientProperty
 * @param {Object} [options]
 * @constructor
 */
function VectorsProjectileControlPanel( selectedObjectTypeProperty,
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
  const objectDisplay = new HBox( {
    spacing: options.xMargin,
    children: [
      new Text( cannonballString, merge( {}, LABEL_OPTIONS, {
        maxWidth: options.minWidth - 3 * options.xMargin - objectView.width
      } ) ),
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
      new Line( 0, 0, options.minWidth - 2 * options.xMargin, 0, { stroke: 'gray' } ),
      new AirResistanceControl( airResistanceOnProperty, projectileDragCoefficientProperty, {
        labelOptions: LABEL_OPTIONS,
        minWidth: options.minWidth,
        xMargin: options.xMargin,
        spacing: options.controlsVerticalSpace,
        tandem: options.tandem.createTandem( 'airResistanceControl' )
      } )
    ]
  } );

  Panel.call( this, content, options );
}

projectileMotion.register( 'VectorsProjectileControlPanel', VectorsProjectileControlPanel );

inherit( Panel, VectorsProjectileControlPanel );
export default VectorsProjectileControlPanel;