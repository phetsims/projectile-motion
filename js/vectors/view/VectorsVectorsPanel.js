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
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VectorsDisplayEnumeration = require( 'PROJECTILE_MOTION/common/view/VectorsDisplayEnumeration' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  const accelerationVectorsString = require( 'string!PROJECTILE_MOTION/accelerationVectors' );
  const componentsString = require( 'string!PROJECTILE_MOTION/components' );
  const forceVectorsString = require( 'string!PROJECTILE_MOTION/forceVectors' );
  const totalString = require( 'string!PROJECTILE_MOTION/total' );
  const velocityVectorsString = require( 'string!PROJECTILE_MOTION/velocityVectors' );

  // constants
  const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  const VELOCITY_VECTOR_ICON = ProjectileMotionConstants.VELOCITY_VECTOR_ICON;
  const ACCELERATION_VECTOR_ICON = ProjectileMotionConstants.ACCELERATION_VECTOR_ICON;
  const FORCE_VECTOR_ICON = ProjectileMotionConstants.FORCE_VECTOR_ICON;

  /**
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function VectorsVectorsPanel( vectorVisibilityProperties, tandem, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, { align: 'left' }, options );

    const checkboxOptions = {
      maxWidth: options.minWidth - 3 * options.xMargin - VELOCITY_VECTOR_ICON.width,
      boxWidth: 18
    };

    const totalLabel = new Text( totalString, LABEL_OPTIONS );
    const componentsLabel = new Text( componentsString, LABEL_OPTIONS );

    const totalOrComponentsRadioButtonGroup = new VerticalAquaRadioButtonGroup( vectorVisibilityProperties.vectorsDisplayProperty, [ {
      node: totalLabel,
      tandemName: _.camelCase( VectorsDisplayEnumeration.TOTAL.toString() ),
      value: VectorsDisplayEnumeration.TOTAL
    }, {
      node: componentsLabel,
      tandemName: _.camelCase( VectorsDisplayEnumeration.COMPONENTS.toString() ),
      value: VectorsDisplayEnumeration.COMPONENTS
    } ], {
      radioButtonOptions: { radius: 8 },
      spacing: 10,     // vertical spacing between each radio button
      touchAreaXDilation: 5,
      maxWidth: checkboxOptions.maxWidth,
      tandem: tandem.createTandem( 'totalOrComponentsRadioButtonGroup' )
    } );

    const velocityLabel = new Text( velocityVectorsString, LABEL_OPTIONS );
    const velocityCheckbox = new Checkbox(
      velocityLabel,
      vectorVisibilityProperties.velocityVectorsOnProperty,
      merge( { tandem: tandem.createTandem( 'velocityCheckbox' ) }, checkboxOptions )
    );
    const velocityCheckboxAndIcon = new HBox( {
      spacing: options.minWidth - velocityCheckbox.width - VELOCITY_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        velocityCheckbox,
        VELOCITY_VECTOR_ICON
      ],
      tandem: tandem.createTandem( 'velocityCheckboxAndIcon' )
    } );

    const accelerationLabel = new Text( accelerationVectorsString, LABEL_OPTIONS );
    const accelerationCheckbox = new Checkbox(
      accelerationLabel,
      vectorVisibilityProperties.accelerationVectorsOnProperty,
      merge( { tandem: tandem.createTandem( 'accelerationCheckbox' ) }, checkboxOptions )
    );
    const accelerationCheckboxAndIcon = new HBox( {
      spacing: options.minWidth - accelerationCheckbox.width - ACCELERATION_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        accelerationCheckbox,
        ACCELERATION_VECTOR_ICON
      ],
      tandem: tandem.createTandem( 'accelerationCheckboxAndIcon' )
    } );

    const forceLabel = new Text( forceVectorsString, LABEL_OPTIONS );
    const forceCheckbox = new Checkbox( forceLabel, vectorVisibilityProperties.forceVectorsOnProperty,
      merge( { tandem: tandem.createTandem( 'forceCheckbox' ) }, checkboxOptions )
    );
    const forceCheckboxAndIcon = new HBox( {
      spacing: options.minWidth - forceCheckbox.width - FORCE_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        forceCheckbox,
        FORCE_VECTOR_ICON
      ],
      tandem: tandem.createTandem( 'forceCheckboxAndIcon' )
    } );

    // The contents of the control panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        totalOrComponentsRadioButtonGroup,
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

