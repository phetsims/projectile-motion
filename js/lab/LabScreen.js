// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Lab' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import projectileMotion from '../projectileMotion.js';
import projectileMotionStrings from '../projectileMotionStrings.js';
import LabModel from './model/LabModel.js';
import LabIconNode from './view/LabIconNode.js';
import LabScreenView from './view/LabScreenView.js';

class LabScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: projectileMotionStrings.screen.lab,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new ScreenIcon( new LabIconNode( 'screen' ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new LabIconNode( 'nav' ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      function() { return new LabModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new LabScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }
}

projectileMotion.register( 'LabScreen', LabScreen );
export default LabScreen;