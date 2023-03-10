// Copyright 2022-2023, University of Colorado Boulder

/**
 * Button for firing multiple projectiles, just a simple subtype of RectangularPushButton.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { Image } from '../../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import fireMultipleButton_png from '../../../mipmaps/fireMultipleButton_png.js';
import projectileMotion from '../../projectileMotion.js';

type SelfOptions = {
  iconWidth?: number;
};

type FireMultipleButtonOptions = SelfOptions & RectangularPushButtonOptions;

class FireMultipleButton extends RectangularPushButton {
  public constructor( providedOptions?: FireMultipleButtonOptions ) {

    const options = optionize<FireMultipleButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
      baseColor: 'rgb( 60, 110, 240 )', // blue
      iconWidth: 20 // width of icon, used for scaling, the aspect ratio will determine height
    }, providedOptions );

    // fire button icon
    assert && assert( !options.content, 'this type sets its own content' );
    options.content = new Image( fireMultipleButton_png );
    options.content.scale( options.iconWidth / options.content.width );

    super( options );
  }
}

projectileMotion.register( 'FireMultipleButton', FireMultipleButton );
export default FireMultipleButton;