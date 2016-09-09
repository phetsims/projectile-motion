// Copyright 2016, University of Colorado Boulder

/**
 * View for the 'Lab' screen. A subtype of the common screen view, ProjectileMotionScreenView
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ProjectileMotionLabModel = require( 'PROJECTILE_MOTION/lab/model/ProjectileMotionLabModel' );
  var ProjectileMotionLabScreenView = require( 'PROJECTILE_MOTION/lab/view/ProjectileMotionLabScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var labTitleString = require( 'string!PROJECTILE_MOTION/lab.title' );

  /**
   * @constructor
   */
  function ProjectileMotionLabScreen() {

    var options = {
      name: labTitleString,
      backgroundColor: 'white',
      homeScreenIcon: ProjectileMotionConstants.RANDOM_ICON_FACTORY.createIcon()
    };

    Screen.call( this,
      function() { return new ProjectileMotionLabModel(); },
      function( model ) { return new ProjectileMotionLabScreenView( model ); },
      options
    );
  }

  projectileMotion.register( 'ProjectileMotionLabScreen', ProjectileMotionLabScreen );

  return inherit( Screen, ProjectileMotionLabScreen );
} );