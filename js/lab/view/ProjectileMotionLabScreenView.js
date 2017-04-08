// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var CustomizeDialog = require( 'PROJECTILE_MOTION/lab/view/CustomizeDialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabSecondPanel = require( 'PROJECTILE_MOTION/lab/view/LabSecondPanel' );
  var InitialValuesPanel = require( 'PROJECTILE_MOTION/lab/view/InitialValuesPanel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );

  /**
   * @param {ProjectileMotionLabModel} model
   * @constructor
   */
  function ProjectileMotionLabScreenView( model, options ) {

    options = options || {};

    // customize panel that becomes visible when customize button in second panel is pressed
    this.customizeDialog = new CustomizeDialog( model );

    // second panel includes customizable options
    options = _.extend( {
      secondPanel: new InitialValuesPanel( model.cannonHeightProperty, model.cannonAngleProperty, model.launchVelocityProperty ),
      vectorsPanel: new LabSecondPanel( model )
    }, options );

    ProjectileMotionScreenView.call( this, model, options );

    this.customizeDialog.center = this.visibleBoundsProperty.get().center.minusXY( 50, 0 );
    this.addChild( this.customizeDialog );

  }

  projectileMotion.register( 'ProjectileMotionLabScreenView', ProjectileMotionLabScreenView );

  return inherit( ProjectileMotionScreenView, ProjectileMotionLabScreenView );
} );

