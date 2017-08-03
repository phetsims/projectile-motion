// Copyright 2016-2017, University of Colorado Boulder

/**
 * The 'Vectors' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var VectorsIconNode = require( 'PROJECTILE_MOTION/vectors/view/VectorsIconNode' );
  var VectorsModel = require( 'PROJECTILE_MOTION/vectors/model/VectorsModel' );
  var VectorsScreenView = require( 'PROJECTILE_MOTION/vectors/view/VectorsScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );

  // strings
  var screenVectorsString = require( 'string!PROJECTILE_MOTION/screen.vectors' );

  /**
   * @constructor
   */
  function VectorsScreen() {

    var options = {
      name: screenVectorsString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new VectorsIconNode( 'screen' ),
      navigationBarIcon: new VectorsIconNode( 'nav' )
    };

    Screen.call( this,
      function() { return new VectorsModel(); },
      function( model ) { return new VectorsScreenView( model ); },
      options
    );
  }

  projectileMotion.register( 'VectorsScreen', VectorsScreen );

  return inherit( Screen, VectorsScreen );
} );

