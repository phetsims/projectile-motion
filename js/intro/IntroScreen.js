// Copyright 2016-2022, University of Colorado Boulder

/**
 * The 'Intro' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import projectileMotion from '../projectileMotion.js';
import ProjectileMotionStrings from '../ProjectileMotionStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroIconNode from './view/IntroIconNode.js';
import IntroScreenView from './view/IntroScreenView.js';

class IntroScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: ProjectileMotionStrings.screen.intro,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new ScreenIcon( new IntroIconNode( 'screen' ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new IntroIconNode( 'nav' ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new IntroModel( tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

projectileMotion.register( 'IntroScreen', IntroScreen );
export default IntroScreen;