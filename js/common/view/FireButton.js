// Copyright 2016-2020, University of Colorado Boulder

/**
 * Fire button, just a simple subtype of RectangularPushButton.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import fireImage from '../../../mipmaps/fire_button_png.js';
import projectileMotion from '../../projectileMotion.js';

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

inherit( RectangularPushButton, FireButton );
export default FireButton;