// Copyright 2016, University of Colorado Boulder

/**
 * View for the 'Drag' screen. A subtype of the common screen view, ProjectileMotionScreenView
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionDragModel = require( 'PROJECTILE_MOTION/drag/model/ProjectileMotionDragModel' );
  var ProjectileMotionDragScreenView = require( 'PROJECTILE_MOTION/drag/view/ProjectileMotionDragScreenView' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  // var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var dragTitleString = require( 'string!PROJECTILE_MOTION/drag.title' );

  /**
   * @constructor
   */
  function ProjectileMotionDragScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = ProjectileMotionConstants.RANDOM_ICON_FACTORY.createIcon();

    Screen.call( this, dragTitleString, icon,
      function() {
        return new ProjectileMotionDragModel(); },
      function( model ) {
        return new ProjectileMotionDragScreenView( model ); }, { backgroundColor: 'white' }
    );
  }

  projectileMotion.register( 'ProjectileMotionDragScreen', ProjectileMotionDragScreen );

  return inherit( Screen, ProjectileMotionDragScreen );
} );

