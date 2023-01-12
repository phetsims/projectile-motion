// Copyright 2022-2023, University of Colorado Boulder

/**
 * The 'Stats' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import projectileMotion from '../projectileMotion.js';
import ProjectileMotionStrings from '../ProjectileMotionStrings.js';
import StatsModel from './model/StatsModel.js';
import StatsIconNode from './view/StatsIconNode.js';
import StatsScreenView from './view/StatsScreenView.js';

class StatsScreen extends Screen {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    const options = {
      name: ProjectileMotionStrings.screen.statsStringProperty,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new ScreenIcon( new StatsIconNode( 'screen' ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new StatsIconNode( 'nav' ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new StatsModel( tandem.createTandem( 'model' ) ),
      model => new StatsScreenView( model, { tandem: tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

projectileMotion.register( 'StatsScreen', StatsScreen );
export default StatsScreen;
