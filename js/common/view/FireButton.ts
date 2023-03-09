// Copyright 2016-2023, University of Colorado Boulder

/**
 * Fire button, just a simple subtype of RectangularPushButton.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { Image } from '../../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import fireButton_png from '../../../mipmaps/fireButton_png.js';
import projectileMotion from '../../projectileMotion.js';

type SelfOptions = {
  baseColor?: string;
  iconWidth?: number;
};
type FireButtonOptions = SelfOptions & RectangularPushButtonOptions;

class FireButton extends RectangularPushButton {
  public constructor( providedOptions?: FireButtonOptions ) {

    const options = optionize<FireButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
      baseColor: 'rgb( 234,33,38 )', // cannon red
      iconWidth: 20 // width of icon, used for scaling, the aspect ratio will determine height
    }, providedOptions );

    // fire button icon
    assert && assert( !options.content, 'this type sets its own content' );
    options.content = new Image( fireButton_png );
    options.content.scale( options.iconWidth / options.content.width );

    super( options );
  }
}

projectileMotion.register( 'FireButton', FireButton );
export default FireButton;