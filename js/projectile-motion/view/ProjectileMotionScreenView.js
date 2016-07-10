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
  var ScreenView = require( 'JOIST/ScreenView' );
  var ControlPanel = require( 'PROJECTILE_MOTION/projectile-motion/view/ControlPanel' );
  var TrajectoryNode = require( 'PROJECTILE_MOTION/projectile-motion/view/TrajectoryNode' );

  /**
   * @param {ProjectileMotionModel} projectileMotionModel
   * @constructor
   */
  function ProjectileMotionScreenView( projectileMotionModel ) {

    var thisScreenView = this;

    ScreenView.call( thisScreenView );

    // Reset All button
    thisScreenView.addChild( new ControlPanel( projectileMotionModel, {
      x: 700,
      y: 300
    } ) );

    // add trajectory node
    thisScreenView.addChild( new TrajectoryNode( projectileMotionModel.trajectory ) );
  }

  projectileMotion.register( 'ProjectileMotionScreenView', ProjectileMotionScreenView );

  return inherit( ScreenView, ProjectileMotionScreenView );
} );

