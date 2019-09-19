// Copyright 2016-2019, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
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
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  const accelerationVectorsString = require( 'string!PROJECTILE_MOTION/accelerationVectors' );
  const componentsString = require( 'string!PROJECTILE_MOTION/components' );
  const forceVectorsString = require( 'string!PROJECTILE_MOTION/forceVectors' );
  const totalString = require( 'string!PROJECTILE_MOTION/total' );
  const velocityVectorsString = require( 'string!PROJECTILE_MOTION/velocityVectors' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var VELOCITY_VECTOR_ICON = ProjectileMotionConstants.VELOCITY_VECTOR_ICON;
  var ACCELERATION_VECTOR_ICON = ProjectileMotionConstants.ACCELERATION_VECTOR_ICON;
  var FORCE_VECTOR_ICON = ProjectileMotionConstants.FORCE_VECTOR_ICON;

  /**
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown
   * @param {Object} [options]
   * @constructor
   */
  function VectorsVectorsPanel( vectorVisibilityProperties, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, { align: 'left' }, options );

    var checkboxOptions = {
      maxWidth: options.minWidth - 3 * options.xMargin - VELOCITY_VECTOR_ICON.width,
      boxWidth: 18
    };

    var totalLabel = new Text( totalString, LABEL_OPTIONS );
    var componentsLabel = new Text( componentsString, LABEL_OPTIONS );

    var totalOrComponentsGroup = new VerticalAquaRadioButtonGroup( vectorVisibilityProperties.totalOrComponentsProperty, [
      { node: totalLabel, value: 'total' },
      { node: componentsLabel, value: 'components' }
    ], {
      radioButtonOptions: { radius: 8 },
      spacing: 10,     // vertical spacing between each radio button
      touchAreaXDilation: 5,
      maxWidth: checkboxOptions.maxWidth
    } );

    var velocityLabel = new Text( velocityVectorsString, LABEL_OPTIONS );
    var velocityCheckbox = new Checkbox(
      velocityLabel,
      vectorVisibilityProperties.velocityVectorsOnProperty,
      checkboxOptions
    );
    var velocityCheckboxAndIcon = new HBox( {
      spacing: options.minWidth - velocityCheckbox.width - VELOCITY_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        velocityCheckbox,
        VELOCITY_VECTOR_ICON
      ]
    } );

    var accelerationLabel = new Text( accelerationVectorsString, LABEL_OPTIONS );
    var accelerationCheckbox = new Checkbox(
      accelerationLabel,
      vectorVisibilityProperties.accelerationVectorsOnProperty,
      checkboxOptions
    );
    var accelerationCheckboxAndIcon = new HBox( {
      spacing: options.minWidth - accelerationCheckbox.width - ACCELERATION_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        accelerationCheckbox,
        ACCELERATION_VECTOR_ICON
      ]
    } );

    var forceLabel = new Text( forceVectorsString, LABEL_OPTIONS );
    var forceCheckbox = new Checkbox( forceLabel, vectorVisibilityProperties.forceVectorsOnProperty, checkboxOptions );
    var forceCheckboxAndIcon = new HBox( {
      spacing: options.minWidth - forceCheckbox.width - FORCE_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        forceCheckbox,
        FORCE_VECTOR_ICON
      ]
    } );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        totalOrComponentsGroup,
        velocityCheckboxAndIcon,
        accelerationCheckboxAndIcon,
        forceCheckboxAndIcon
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'VectorsVectorsPanel', VectorsVectorsPanel );

  return inherit( Panel, VectorsVectorsPanel );
} );

