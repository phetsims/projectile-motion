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
 
  /**
   * @param {ProjectileMotionLabModel} model
   * @constructor
   */
  function ProjectileMotionLabScreenView( model, options ) {

    var thisScreenView = this;

    options = options || {};

    // second panel includes customizable options
    options = _.extend( { secondPanel: new LabSecondPanel( model ) }, options );

    ProjectileMotionScreenView.call( thisScreenView, model, options );

  }

  projectileMotion.register( 'ProjectileMotionLabScreenView', ProjectileMotionLabScreenView );

  return inherit( ProjectileMotionScreenView, ProjectileMotionLabScreenView );
} );

