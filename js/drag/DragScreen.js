// Copyright 2016-2017, University of Colorado Boulder

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
  var DragModel = require( 'PROJECTILE_MOTION/drag/model/DragModel' );
  var DragScreenView = require( 'PROJECTILE_MOTION/drag/view/DragScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );
  var DragIconNode = require( 'PROJECTILE_MOTION/drag/view/DragIconNode' );

  // strings
  var screenDragString = require( 'string!PROJECTILE_MOTION/screen.drag' );

  /**
   * @constructor
   */
  function DragScreen() {

    var options = {
      name: screenDragString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new DragIconNode()
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

