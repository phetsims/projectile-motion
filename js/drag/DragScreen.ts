// Copyright 2016-2023, University of Colorado Boulder

/**
 * The 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Tandem from '../../../tandem/js/Tandem.js';
import projectileMotion from '../projectileMotion.js';
import ProjectileMotionStrings from '../ProjectileMotionStrings.js';
import DragModel from './model/DragModel.js';
import DragIconNode from './view/DragIconNode.js';
import DragScreenView from './view/DragScreenView.js';

class DragScreen extends Screen<DragModel, DragScreenView> {
  public constructor( tandem: Tandem ) {

    const options = {
      name: ProjectileMotionStrings.screen.dragStringProperty,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new ScreenIcon( new DragIconNode(), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new DragModel( tandem.createTandem( 'model' ) ),
      model => new DragScreenView( model, { tandem: tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

projectileMotion.register( 'DragScreen', DragScreen );
export default DragScreen;