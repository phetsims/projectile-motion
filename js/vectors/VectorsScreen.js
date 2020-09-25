// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Vectors' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import projectileMotion from '../projectileMotion.js';
import projectileMotionStrings from '../projectileMotionStrings.js';
import VectorsModel from './model/VectorsModel.js';
import VectorsIconNode from './view/VectorsIconNode.js';
import VectorsScreenView from './view/VectorsScreenView.js';

class VectorsScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: projectileMotionStrings.screen.vectors,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new ScreenIcon( new VectorsIconNode( 'screen' ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new VectorsIconNode( 'nav' ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      function() { return new VectorsModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new VectorsScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }
}

projectileMotion.register( 'VectorsScreen', VectorsScreen );
export default VectorsScreen;