// Copyright 2016-2020, University of Colorado Boulder

/**
 * Control panel that allows users to alter Properties of the projectile fired.
 * Also includes a slider for changing altitude, which changes air density.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AirResistanceControl = require( 'PROJECTILE_MOTION/common/view/AirResistanceControl' );
  const ArrowlessNumberControl = require( 'PROJECTILE_MOTION/common/view/ArrowlessNumberControl' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const cannonballString = require( 'string!PROJECTILE_MOTION/cannonball' );
  const diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  const kgString = require( 'string!PROJECTILE_MOTION/kg' );
  const massString = require( 'string!PROJECTILE_MOTION/mass' );
  const mString = require( 'string!PROJECTILE_MOTION/m' );

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

  return inherit( Panel, VectorsProjectileControlPanel );
} );

