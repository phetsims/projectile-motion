// Copyright 2022, University of Colorado Boulder

/**
 * Fire button, just a simple subtype of RectangularPushButton.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Image } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import fireMultipleButton_png from '../../../mipmaps/fireMultipleButton_png.js';
import projectileMotion from '../../projectileMotion.js';

class FireMultipleButton extends RectangularPushButton {
  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    options = merge(
      {
        baseColor: 'rgb( 60, 110, 240 )', // blue
        iconWidth: 20 // width of icon, used for scaling, the aspect ratio will determine height
      },
      options
    );

    // fire button icon
    assert && assert( !options.content, 'this type sets its own content' );
    options.content = new Image( fireMultipleButton_png );
    options.content.scale( options.iconWidth / options.content.width );

    super( options );
  }
}

projectileMotion.register( 'FireMultipleButton', FireMultipleButton );
export default FireMultipleButton;