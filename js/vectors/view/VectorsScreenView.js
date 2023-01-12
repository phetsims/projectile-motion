// Copyright 2016-2023, University of Colorado Boulder

/**
 * ScreenView for the 'Vectors' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import projectileMotion from '../../projectileMotion.js';
import VectorsProjectileControlPanel from './VectorsProjectileControlPanel.js';
import VectorsVectorsControlPanel from './VectorsVectorsControlPanel.js';
import VectorsViewProperties from './VectorsViewProperties.js';

class VectorsScreenView extends ProjectileMotionScreenView {

  /**
   * @param {VectorsModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
      addFlatirons: false
    }, options );

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new VectorsViewProperties( options.tandem.createTandem( 'viewProperties' ) );

    super(
      model,
      new VectorsProjectileControlPanel(
        model.selectedProjectileObjectTypeProperty,
        model.projectileDiameterProperty,
        model.projectileMassProperty,
        model.airResistanceOnProperty,
        model.projectileDragCoefficientProperty,
        { tandem: options.tandem.createTandem( 'projectileControlPanel' ) }
      ),
      new VectorsVectorsControlPanel( visibilityProperties, { tandem: options.tandem.createTandem( 'vectorsControlPanel' ) } ),
      visibilityProperties,
      options
    );
  }
}

projectileMotion.register( 'VectorsScreenView', VectorsScreenView );
export default VectorsScreenView;