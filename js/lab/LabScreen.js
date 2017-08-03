// Copyright 2016-2017, University of Colorado Boulder

/**
 * The 'Lab' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var LabIconNode = require( 'PROJECTILE_MOTION/lab/view/LabIconNode' );
  var LabModel = require( 'PROJECTILE_MOTION/lab/model/LabModel' );
  var LabScreenView = require( 'PROJECTILE_MOTION/lab/view/LabScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );

  // strings
  var screenLabString = require( 'string!PROJECTILE_MOTION/screen.lab' );

  /**
   * @constructor
   */
  function LabScreen() {

    var options = {
      name: screenLabString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new LabIconNode( 'screen' ),
      navigationBarIcon: new LabIconNode( 'nav' )
    };

    Screen.call( this,
      function() { return new LabModel(); },
      function( model ) { return new LabScreenView( model ); },
      options
    );
  }

  projectileMotion.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );
