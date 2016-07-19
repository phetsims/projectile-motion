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
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var labTitleString = require( 'string!PROJECTILE_MOTION/lab.title' );

  // images
  var screenIcon = require( 'image!PROJECTILE_MOTION/PlumPuddingAtom-screen-icon.png' );

  /**
   * @constructor
   */
  function ProjectileMotionLabScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = new Image( screenIcon );

    Screen.call( this, labTitleString, icon,
      function() { return new ProjectileMotionLabModel(); },
      function( model ) { return new ProjectileMotionLabScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  projectileMotion.register( 'ProjectileMotionLabScreen', ProjectileMotionLabScreen );

  return inherit( Screen, ProjectileMotionLabScreen );
} );