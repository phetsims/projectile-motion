// Copyright 2016-2018, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Panel = require( 'SUN/Panel' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const accelerationVectorsString = require( 'string!PROJECTILE_MOTION/accelerationVectors' );
  const componentsString = require( 'string!PROJECTILE_MOTION/components' );
  const totalString = require( 'string!PROJECTILE_MOTION/total' );
  const velocityVectorsString = require( 'string!PROJECTILE_MOTION/velocityVectors' );

  // constants
  const TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
  const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  const VELOCITY_VECTOR_ICON = ProjectileMotionConstants.VELOCITY_VECTOR_ICON;
  const ACCELERATION_VECTOR_ICON = ProjectileMotionConstants.ACCELERATION_VECTOR_ICON;

  /**
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown
   * @param {Object} [options]
   * @constructor
   */
  function IntroVectorsPanel( vectorVisibilityProperties, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, { align: 'left' }, options );

    const titleOptions = _.defaults(
      { maxWidth: options.minWidth - 3 * options.xMargin - VELOCITY_VECTOR_ICON.width },
      TITLE_OPTIONS
    );
    const velocityVectorsTitle = new Text( velocityVectorsString, titleOptions );
    const velocityTitleBox = new HBox( {
      spacing: options.minWidth - velocityVectorsTitle.width - VELOCITY_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        velocityVectorsTitle,
        VELOCITY_VECTOR_ICON
      ]
    } );

    const checkboxOptions = { maxWidth: titleOptions.maxWidth, boxWidth: 18 };
    const totalVelocityLabel = new Text( totalString, LABEL_OPTIONS );
    const totalVelocityCheckbox = new Checkbox(
      totalVelocityLabel,
      vectorVisibilityProperties.totalVelocityVectorOnProperty,
      checkboxOptions
    );

    const componentsVelocityLabel = new Text( componentsString, LABEL_OPTIONS );
    const componentsVelocityCheckbox = new Checkbox(
      componentsVelocityLabel,
      vectorVisibilityProperties.componentsVelocityVectorsOnProperty,
      checkboxOptions
    );

    const accelerationVectorsTitle = new Text( accelerationVectorsString, titleOptions );
    const accelerationTitleBox = new HBox( {
      spacing: options.minWidth - accelerationVectorsTitle.width - ACCELERATION_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        accelerationVectorsTitle,
        ACCELERATION_VECTOR_ICON
      ]
    } );

    const totalAccelerationLabel = new Text( totalString, LABEL_OPTIONS );
    const totalAccelerationCheckbox = new Checkbox(
      totalAccelerationLabel,
      vectorVisibilityProperties.totalAccelerationVectorOnProperty,
      checkboxOptions
    );

    const componentsAccelerationLabel = new Text( componentsString, LABEL_OPTIONS );
    const componentsAccelerationCheckbox = new Checkbox(
      componentsAccelerationLabel,
      vectorVisibilityProperties.componentsAccelerationVectorsOnProperty,
      checkboxOptions
    );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        velocityTitleBox,
        totalVelocityCheckbox,
        componentsVelocityCheckbox,
        accelerationTitleBox,
        totalAccelerationCheckbox,
        componentsAccelerationCheckbox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'IntroVectorsPanel', IntroVectorsPanel );

  return inherit( Panel, IntroVectorsPanel );
} );

