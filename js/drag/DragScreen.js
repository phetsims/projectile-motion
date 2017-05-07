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
  var DragModel = require( 'PROJECTILE_MOTION/drag/model/DragModel' );
  var DragScreenView = require( 'PROJECTILE_MOTION/drag/view/DragScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );

  // strings
  var dragTitleString = require( 'string!PROJECTILE_MOTION/drag.title' );

  /**
   * @constructor
   */
  function DragScreen() {

    var options = {
      name: dragTitleString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: ProjectileMotionConstants.RANDOM_ICON_FACTORY.createIcon()
    };

    Screen.call( this,
      function() { return new DragModel(); },
      function( model ) { return new DragScreenView( model ); },
      options
    );
  }

  projectileMotion.register( 'DragScreen', DragScreen );

  return inherit( Screen, DragScreen );
} );

