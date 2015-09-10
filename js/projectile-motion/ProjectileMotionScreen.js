// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var ProjectileMotionModel = require( 'PROJECTILE_MOTION/projectile-motion/model/ProjectileMotionModel' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/projectile-motion/view/ProjectileMotionScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var projectileMotionSimString = require( 'string!PROJECTILE_MOTION/projectile-motion.title' );

  /**
   * @constructor
   */
  function ProjectileMotionScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, projectileMotionSimString, icon,
      function() { return new ProjectileMotionModel(); },
      function( model ) { return new ProjectileMotionScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, ProjectileMotionScreen );
} );