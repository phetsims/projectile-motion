// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Intro' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import inherit from '../../../phet-core/js/inherit.js';
import projectileMotionStrings from '../projectileMotionStrings.js';
import projectileMotion from '../projectileMotion.js';
import IntroModel from './model/IntroModel.js';
import IntroIconNode from './view/IntroIconNode.js';
import IntroScreenView from './view/IntroScreenView.js';

const screenIntroString = projectileMotionStrings.screen.intro;

/**
 * @param {Tandem} tandem
 * @constructor
 */
function IntroScreen( tandem ) {

  const options = {
    name: screenIntroString,
    backgroundColorProperty: new Property( 'white' ),
    homeScreenIcon: new ScreenIcon( new IntroIconNode( 'screen' ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } ),
    navigationBarIcon: new IntroIconNode( 'nav' ),
    tandem: tandem
  };

  Screen.call( this,
    function() { return new IntroModel( tandem.createTandem( 'model' ) ); },
    function( model ) { return new IntroScreenView( model, tandem.createTandem( 'view' ) ); },
    options
  );
}

projectileMotion.register( 'IntroScreen', IntroScreen );

inherit( Screen, IntroScreen );
export default IntroScreen;