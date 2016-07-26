// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  // var ScreenView = require( 'JOIST/ScreenView' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  var LabSecondPanel = require( 'PROJECTILE_MOTION/lab/view/LabSecondPanel' );
  var CustomizePanel = require( 'PROJECTILE_MOTION/lab/view/CustomizePanel' );
 
  /**
   * @param {ProjectileMotionLabModel} model
   * @constructor
   */
  function ProjectileMotionLabScreenView( model, options ) {

    options = options || {};

    // second panel includes customizable options
    options = _.extend( { secondPanel: new LabSecondPanel( model ) }, options );

    ProjectileMotionScreenView.call( this, model, options );

    // customize panel that becomes visible when customize button in second panel is pressed
    this.customizePanel = new CustomizePanel( model );
    this.customizePanel.center = this.center;
    this.addChild( this.customizePanel );

  }

  projectileMotion.register( 'ProjectileMotionLabScreenView', ProjectileMotionLabScreenView );

  return inherit( ProjectileMotionScreenView, ProjectileMotionLabScreenView );
} );

