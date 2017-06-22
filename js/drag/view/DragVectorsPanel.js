// Copyright 2013-2015, University of Colorado Boulder

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

  // strings
  var velocityVectorsString = require( 'string!PROJECTILE_MOTION/velocityVectors' );
  var forceVectorsString = require( 'string!PROJECTILE_MOTION/forceVectors' );
  var totalString = require( 'string!PROJECTILE_MOTION/total' );
  var componentsString = require( 'string!PROJECTILE_MOTION/components' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

  /**
   * @param {VectorVisibilityProperties} vectorVisibilityProperties - properties that determine which vectors are shown
   * @param {Object} [options]
   * @constructor
   */
  function DragVectorsPanel( vectorVisibilityProperties, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, { align: 'left' }, options );
    
    var totalLabel = new Text( totalString, LABEL_OPTIONS );
    var componentsLabel = new Text( componentsString, LABEL_OPTIONS );
    
    var totalOrComponentsGroup = new VerticalAquaRadioButtonGroup( [
      { node: totalLabel, property: vectorVisibilityProperties.totalOrComponentsProperty, value: 'total' },
      { node: componentsLabel, property: vectorVisibilityProperties.totalOrComponentsProperty, value: 'components' }
    ], {
      radius: 8,      // radius of radio button circle
      spacing: 10,     // vertical spacing between each radio button
      touchAreaXDilation: 5
    } );

    var velocityLabel = new Text( velocityVectorsString, LABEL_OPTIONS );
    var velocityCheckBox = new CheckBox( velocityLabel, vectorVisibilityProperties.velocityVectorsOnProperty );
    
    var forceLabel = new Text( forceVectorsString, LABEL_OPTIONS );
    var forceCheckBox = new CheckBox( forceLabel, vectorVisibilityProperties.forceVectorsOnProperty );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        totalOrComponentsGroup,
        velocityCheckBox,
        forceCheckBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'DragVectorsPanel', DragVectorsPanel );

  return inherit( Panel, DragVectorsPanel );
} );

