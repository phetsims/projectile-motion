// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control panel for choosing which vectors are visible.
 * 
 * @author Andrea Lin( PhET Interactive Simulations )
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

  // strings
  var velocityVectorsString = require( 'string!PROJECTILE_MOTION/velocityVectors' );
  var accelerationVectorsString = require( 'string!PROJECTILE_MOTION/accelerationVectors' );
  var totalString = require( 'string!PROJECTILE_MOTION/total' );
  var componentsString = require( 'string!PROJECTILE_MOTION/components' );

  // constants
  var TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
  var BIGGER_LABEL_OPTIONS = ProjectileMotionConstants.PANEL_BIGGER_LABEL_OPTIONS;

  /**
   * @param {IntroModel} introModel
   * @constructor
   */
  function IntroVectorsPanel( introModel, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, { align: 'left' }, options );
    
    var velocityVectorsTitle = new Text( velocityVectorsString, TITLE_OPTIONS );

    var totalVelocityLabel = new Text( totalString, BIGGER_LABEL_OPTIONS );
    var totalVelocityCheckBox = new CheckBox( totalVelocityLabel, introModel.totalVelocityVectorOnProperty );
    
    var componentsVelocityLabel = new Text( componentsString, BIGGER_LABEL_OPTIONS );
    var componentsVelocityCheckBox = new CheckBox( componentsVelocityLabel, introModel.componentsVelocityVectorsOnProperty );
    
    var accelerationVectorsTitle = new Text( accelerationVectorsString, TITLE_OPTIONS );

    var componentsAccelerationLabel = new Text( componentsString, BIGGER_LABEL_OPTIONS );
    var componentsAccelerationCheckBox = new CheckBox( componentsAccelerationLabel, introModel.componentsAccelerationVectorsOnProperty );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        velocityVectorsTitle,
        totalVelocityCheckBox,
        componentsVelocityCheckBox,
        accelerationVectorsTitle,
        componentsAccelerationCheckBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'IntroVectorsPanel', IntroVectorsPanel );

  return inherit( Panel, IntroVectorsPanel );
} );

