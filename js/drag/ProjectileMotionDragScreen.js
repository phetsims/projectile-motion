// Copyright 2016, University of Colorado Boulder

/**
 * The 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ProjectileMotionDragModel = require( 'PROJECTILE_MOTION/drag/model/ProjectileMotionDragModel' );
  var ProjectileMotionDragScreenView = require( 'PROJECTILE_MOTION/drag/view/ProjectileMotionDragScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );

  // strings
  var dragTitleString = require( 'string!PROJECTILE_MOTION/drag.title' );

  /**
   * @constructor
   */
  function ProjectileMotionDragScreen() {

    var options = {
      name: dragTitleString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: ProjectileMotionConstants.RANDOM_ICON_FACTORY.createIcon()
    };

    Screen.call( this,
      function() { return new ProjectileMotionDragModel(); },
      function( model ) { return new ProjectileMotionDragScreenView( model ); },
      options
    );
  }

  projectileMotion.register( 'ProjectileMotionDragScreen', ProjectileMotionDragScreen );

  return inherit( Screen, ProjectileMotionDragScreen );
} );

