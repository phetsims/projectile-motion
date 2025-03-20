// Copyright 2016-2025, University of Colorado Boulder

/**
 * The 'Vectors' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import projectileMotion from '../projectileMotion.js';
import ProjectileMotionStrings from '../ProjectileMotionStrings.js';
import VectorsModel from './model/VectorsModel.js';
import VectorsIconNode from './view/VectorsIconNode.js';
import VectorsScreenView from './view/VectorsScreenView.js';
import Tandem from '../../../tandem/js/Tandem.js';

class VectorsScreen extends Screen<VectorsModel, VectorsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: ProjectileMotionStrings.screen.vectorsStringProperty,
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
      () => new VectorsModel( tandem.createTandem( 'model' ) ),
      model => new VectorsScreenView( model, { tandem: tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

projectileMotion.register( 'VectorsScreen', VectorsScreen );
export default VectorsScreen;