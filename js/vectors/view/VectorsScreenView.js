// Copyright 2016-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Vectors' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import projectileMotion from '../../projectileMotion.js';
import VectorsProjectileControlPanel from './VectorsProjectileControlPanel.js';
import VectorsVectorsControlPanel from './VectorsVectorsControlPanel.js';
import VectorsVectorVisibilityProperties from './VectorsVectorVisibilityProperties.js';

class VectorsScreenView extends ProjectileMotionScreenView {

  /**
   * @param {VectorsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new VectorsVectorVisibilityProperties( tandem.createTandem( 'vectorVisibilityProperties' ) );

    super(
      model,
      new VectorsProjectileControlPanel(
        model.selectedProjectileObjectTypeProperty,
        model.projectileDiameterProperty,
        model.projectileMassProperty,
        model.airResistanceOnProperty,
        model.projectileDragCoefficientProperty,
        { tandem: tandem.createTandem( 'projectileControlPanel' ) }
      ),
      new VectorsVectorsControlPanel( visibilityProperties, { tandem: tandem.createTandem( 'vectorsControlPanel' ) } ),
      visibilityProperties,
      tandem,
      options
    );
  }
}

projectileMotion.register( 'VectorsScreenView', VectorsScreenView );
export default VectorsScreenView;