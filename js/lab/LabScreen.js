// Copyright 2016-2019, University of Colorado Boulder

/**
 * The 'Lab' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const LabIconNode = require( 'PROJECTILE_MOTION/lab/view/LabIconNode' );
  const LabModel = require( 'PROJECTILE_MOTION/lab/model/LabModel' );
  const LabScreenView = require( 'PROJECTILE_MOTION/lab/view/LabScreenView' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenLabString = require( 'string!PROJECTILE_MOTION/screen.lab' );

  /**
   * @constructor
   */
  function LabScreen() {

    const options = {
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
