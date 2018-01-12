// Copyright 2016-2017, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Checkbox = require( 'SUN/Checkbox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var accelerationVectorsString = require( 'string!PROJECTILE_MOTION/accelerationVectors' );
  var componentsString = require( 'string!PROJECTILE_MOTION/components' );
  var totalString = require( 'string!PROJECTILE_MOTION/total' );
  var velocityVectorsString = require( 'string!PROJECTILE_MOTION/velocityVectors' );

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

    var checkboxOptions = { maxWidth: titleOptions.maxWidth, boxWidth: 18 };
    var totalVelocityLabel = new Text( totalString, LABEL_OPTIONS );
    var totalVelocityCheckbox = new Checkbox(
      totalVelocityLabel,
      vectorVisibilityProperties.totalVelocityVectorOnProperty,
      checkboxOptions
    );

    var componentsVelocityLabel = new Text( componentsString, LABEL_OPTIONS );
    var componentsVelocityCheckbox = new Checkbox(
      componentsVelocityLabel,
      vectorVisibilityProperties.componentsVelocityVectorsOnProperty,
      checkboxOptions
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
    var totalAccelerationCheckbox = new Checkbox(
      totalAccelerationLabel,
      vectorVisibilityProperties.totalAccelerationVectorOnProperty,
      checkboxOptions
    );

    var componentsAccelerationLabel = new Text( componentsString, LABEL_OPTIONS );
    var componentsAccelerationCheckbox = new Checkbox(
      componentsAccelerationLabel,
      vectorVisibilityProperties.componentsAccelerationVectorsOnProperty,
      checkboxOptions
    );

    // The contents of the control panel
    var content = new VBox( {
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

