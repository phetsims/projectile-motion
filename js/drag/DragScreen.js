// Copyright 2016-2019, University of Colorado Boulder

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
   * @param {Tandem} tandem
   * @constructor
   */
  function DragScreen( tandem ) {

    const options = {
      name: screenDragString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new DragIconNode()
    };

    Screen.call( this,
      function() { return new DragModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new DragScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  projectileMotion.register( 'DragScreen', DragScreen );

  return inherit( Screen, DragScreen );
} );

