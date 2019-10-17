// Copyright 2016-2019, University of Colorado Boulder

/**
 * Fire button, just a simple subtype of RectangularPushButton.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // images
  const fireImage = require( 'mipmap!PROJECTILE_MOTION/fire_button.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function FireButton( options ) {
    options = merge( {
      baseColor: 'rgb( 255, 0, 0 )', // red
      iconWidth: 20 // width of icon, used for scaling, the aspect ratio will determine height
    }, options );

    assert && assert( !options.content, 'this type sets its own content' );

    // fire button icon
    options.content = new Image( fireImage );
    options.content.scale( options.iconWidth / options.content.width );

    RectangularPushButton.call( this, options );
  }

  projectileMotion.register( 'FireButton', FireButton );

  return inherit( RectangularPushButton, FireButton );
} );

