// Copyright 2016-2017, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  // strings
  var velocityVectorsString = require( 'string!PROJECTILE_MOTION/velocityVectors' );
  var accelerationVectorsString = require( 'string!PROJECTILE_MOTION/accelerationVectors' );
  var totalString = require( 'string!PROJECTILE_MOTION/total' );
  var componentsString = require( 'string!PROJECTILE_MOTION/components' );

  // constants
  var TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var VELOCITY_VECTOR_ICON = ProjectileMotionConstants.VELOCITY_VECTOR_ICON;
  var ACCELERATION_VECTOR_ICON = ProjectileMotionConstants.ACCELERATION_VECTOR_ICON;

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

    var titleOptions = _.defaults(
      { maxWidth: options.minWidth - 3 * options.xMargin - VELOCITY_VECTOR_ICON.width },
      TITLE_OPTIONS
    );
    var velocityVectorsTitle = new Text( velocityVectorsString, titleOptions );
    var velocityTitleBox = new HBox( {
      spacing: options.minWidth - velocityVectorsTitle.width - VELOCITY_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        velocityVectorsTitle,
        VELOCITY_VECTOR_ICON
      ]
    } );

    var checkBoxOptions = { maxWidth: titleOptions.maxWidth, boxWidth: 18 };
    var totalVelocityLabel = new Text( totalString, LABEL_OPTIONS );
    var totalVelocityCheckBox = new CheckBox(
      totalVelocityLabel,
      vectorVisibilityProperties.totalVelocityVectorOnProperty,
      checkBoxOptions
    );

    var componentsVelocityLabel = new Text( componentsString, LABEL_OPTIONS );
    var componentsVelocityCheckBox = new CheckBox(
      componentsVelocityLabel,
      vectorVisibilityProperties.componentsVelocityVectorsOnProperty,
      checkBoxOptions
    );

    var accelerationVectorsTitle = new Text( accelerationVectorsString, titleOptions );
    var accelerationTitleBox = new HBox( {
      spacing: options.minWidth - accelerationVectorsTitle.width - ACCELERATION_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        accelerationVectorsTitle,
        ACCELERATION_VECTOR_ICON
      ]
    } );

    var totalAccelerationLabel = new Text( totalString, LABEL_OPTIONS );
    var totalAccelerationCheckBox = new CheckBox(
      totalAccelerationLabel,
      vectorVisibilityProperties.totalAccelerationVectorOnProperty,
      checkBoxOptions
    );

    var componentsAccelerationLabel = new Text( componentsString, LABEL_OPTIONS );
    var componentsAccelerationCheckBox = new CheckBox(
      componentsAccelerationLabel,
      vectorVisibilityProperties.componentsAccelerationVectorsOnProperty,
      checkBoxOptions
    );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        velocityTitleBox,
        totalVelocityCheckBox,
        componentsVelocityCheckBox,
        accelerationTitleBox,
        totalAccelerationCheckBox,
        componentsAccelerationCheckBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'IntroVectorsPanel', IntroVectorsPanel );

  return inherit( Panel, IntroVectorsPanel );
} );

