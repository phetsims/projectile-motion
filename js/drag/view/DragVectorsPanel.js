// Copyright 2016-2017, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  // strings
  var velocityVectorsString = require( 'string!PROJECTILE_MOTION/velocityVectors' );
  var forceVectorsString = require( 'string!PROJECTILE_MOTION/forceVectors' );
  var totalString = require( 'string!PROJECTILE_MOTION/total' );
  var componentsString = require( 'string!PROJECTILE_MOTION/components' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var VELOCITY_VECTOR_ICON = ProjectileMotionConstants.VELOCITY_VECTOR_ICON;
  var FORCE_VECTOR_ICON = ProjectileMotionConstants.FORCE_VECTOR_ICON;

  /**
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - Properties that determine which vectors are shown
   * @param {Object} [options]
   * @constructor
   */
  function DragVectorsPanel( vectorVisibilityProperties, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, { align: 'left' }, options );

    var titleOptions = _.defaults( { maxWidth: options.minWidth - 2 * options.xMargin }, LABEL_OPTIONS );
    var checkBoxOptions = { maxWidth: options.minWidth - 3 * options.xMargin - VELOCITY_VECTOR_ICON.width, boxWidth: 18 };

    var totalLabel = new Text( totalString, titleOptions );
    var componentsLabel = new Text( componentsString, titleOptions );

    var totalOrComponentsGroup = new VerticalAquaRadioButtonGroup( [
      { node: totalLabel, property: vectorVisibilityProperties.totalOrComponentsProperty, value: 'total' },
      { node: componentsLabel, property: vectorVisibilityProperties.totalOrComponentsProperty, value: 'components' }
    ], {
      radius: 8,      // radius of radio button circle
      spacing: 10,     // vertical spacing between each radio button
      touchAreaXDilation: 5,
      maxWidth: titleOptions.maxWidth
    } );

    var velocityLabel = new Text( velocityVectorsString, titleOptions );
    var velocityCheckBox = new CheckBox( velocityLabel, vectorVisibilityProperties.velocityVectorsOnProperty, checkBoxOptions );
    var velocityCheckBoxAndIcon = new HBox( {
      spacing: options.minWidth - velocityCheckBox.width - VELOCITY_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        velocityCheckBox,
        VELOCITY_VECTOR_ICON
      ]
    } );

    var forceLabel = new Text( forceVectorsString, titleOptions );
    var forceCheckBox = new CheckBox( forceLabel, vectorVisibilityProperties.forceVectorsOnProperty, checkBoxOptions );
    var forceCheckBoxAndIcon = new HBox( {
      spacing: options.minWidth - forceCheckBox.width - FORCE_VECTOR_ICON.width - 2 * options.xMargin,
      children: [
        forceCheckBox,
        FORCE_VECTOR_ICON
      ]
    } );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        totalOrComponentsGroup,
        velocityCheckBoxAndIcon,
        forceCheckBoxAndIcon
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'DragVectorsPanel', DragVectorsPanel );

  return inherit( Panel, DragVectorsPanel );
} );

