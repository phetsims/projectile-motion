// Copyright 2016-2025, University of Colorado Boulder

/**
 * The 'Lab' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import projectileMotion from '../projectileMotion.js';
import ProjectileMotionStrings from '../ProjectileMotionStrings.js';
import LabModel from './model/LabModel.js';
import LabIconNode from './view/LabIconNode.js';
import LabScreenView from './view/LabScreenView.js';
import Tandem from '../../../tandem/js/Tandem.js';

class LabScreen extends Screen<LabModel, LabScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: ProjectileMotionStrings.screen.labStringProperty,
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
      () => new LabModel( tandem.createTandem( 'model' ) ),
      ( model: LabModel ) => new LabScreenView( model, { tandem: tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

projectileMotion.register( 'LabScreen', LabScreen );
export default LabScreen;