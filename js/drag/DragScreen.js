// Copyright 2016-2017, University of Colorado Boulder

/**
 * The 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragIconNode = require( 'PROJECTILE_MOTION/drag/view/DragIconNode' );
  const DragModel = require( 'PROJECTILE_MOTION/drag/model/DragModel' );
  const DragScreenView = require( 'PROJECTILE_MOTION/drag/view/DragScreenView' );
  const inherit = require( 'PHET_CORE/inherit' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenDragString = require( 'string!PROJECTILE_MOTION/screen.drag' );

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

