// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionLabModel = require( 'PROJECTILE_MOTION/lab/model/ProjectileMotionLabModel' );
  var ProjectileMotionLabScreenView = require( 'PROJECTILE_MOTION/lab/view/ProjectileMotionLabScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var labTitleString = require( 'string!PROJECTILE_MOTION/lab.title' );

  /**
   * @constructor
   */
  function ProjectileMotionLabScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, labTitleString, icon,
      function() { return new ProjectileMotionLabModel(); },
      function( model ) { return new ProjectileMotionLabScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  projectileMotion.register( 'ProjectileMotionLabScreen', ProjectileMotionLabScreen );

  return inherit( Screen, ProjectileMotionLabScreen );
} );