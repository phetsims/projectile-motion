// Copyright 2016-2019, University of Colorado Boulder

/**
 * The 'Vectors' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const VectorsIconNode = require( 'PROJECTILE_MOTION/vectors/view/VectorsIconNode' );
  const VectorsModel = require( 'PROJECTILE_MOTION/vectors/model/VectorsModel' );
  const VectorsScreenView = require( 'PROJECTILE_MOTION/vectors/view/VectorsScreenView' );

  // strings
  const screenVectorsString = require( 'string!PROJECTILE_MOTION/screen.vectors' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function VectorsScreen( tandem ) {

    const options = {
      name: screenVectorsString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new VectorsIconNode( 'screen' ),
      navigationBarIcon: new VectorsIconNode( 'nav' ),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new VectorsModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new VectorsScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  projectileMotion.register( 'VectorsScreen', VectorsScreen );

  return inherit( Screen, VectorsScreen );
} );

