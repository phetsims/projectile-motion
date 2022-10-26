// Copyright 2022, University of Colorado Boulder

/**
 * icon node for the 'Stats' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Screen from '../../../../joist/js/Screen.js';
import { NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import { LinearGradient } from '../../../../scenery/js/imports.js';
import projectileMotion from '../../projectileMotion.js';

// constants
const SCREEN_ICON_SIZE = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE;
const NAV_ICON_SIZE = Screen.MINIMUM_NAVBAR_ICON_SIZE;

class StatsIconNode extends Rectangle {

  public constructor( type: 'nav' | 'screen' ) {
    super( 0, 0, 0, 0 );

    let width;
    let height;

    const rectWidthFactor = 0.2;
    const rectHeights = [ 0.45, 0.65, 0.3 ];
    const gradientColor1 = '#990000';
    const gradientColor2 = '#ff0000';

    if ( type === 'nav' ) {
      width = NAV_ICON_SIZE.width;
      height = NAV_ICON_SIZE.height;
      for ( let i = 0; i < rectHeights.length; i++ ) {
        const rectHeight = rectHeights[ i ] * height;
        const statBar = new Rectangle(
          ( 0.5 - ( i - 0.5 ) * rectWidthFactor ) * width,
          height - rectHeight,
          rectWidthFactor * width,
          rectHeight,
          {
            fill: new LinearGradient( 0, height, 0, height - rectHeight )
              .addColorStop( 0, gradientColor1 )
              .addColorStop( 1, gradientColor2 )
          }
        );
        this.addChild( statBar );
      }
    }
    else {
      width = SCREEN_ICON_SIZE.width;
      height = SCREEN_ICON_SIZE.height;
      for ( let i = 0; i < rectHeights.length; i++ ) {
        const rectHeight = rectHeights[ i ] * height;
        const statBar = new Rectangle(
          ( 0.5 - ( i - 0.5 ) * rectWidthFactor ) * width,
          height - rectHeight,
          rectWidthFactor * width,
          rectHeight,
          {
            fill: new LinearGradient( 0, height, 0, height - rectHeight )
              .addColorStop( 0, gradientColor1 )
              .addColorStop( 1, gradientColor2 )
          }
        );
        this.addChild( statBar );
      }
    }

    // create the background
    const backgroundFill = new LinearGradient( 0, 0, 0, height )
      .addColorStop( 0, '#02ace4' )
      .addColorStop( 1, '#cfecfc' );
    this.mutate( { fill: backgroundFill } as NodeOptions );
    this.setRectWidth( width );
    this.setRectHeight( height );
  }
}

projectileMotion.register( 'StatsIconNode', StatsIconNode );

export default StatsIconNode;