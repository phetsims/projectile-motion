// Copyright 2016-2025, University of Colorado Boulder

/**
 * ScreenView for the 'Vectors' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import ProjectileMotionScreenView, { ProjectileMotionScreenViewOptions } from '../../common/view/ProjectileMotionScreenView.js';
import projectileMotion from '../../projectileMotion.js';
import VectorsProjectileControlPanel from './VectorsProjectileControlPanel.js';
import VectorsVectorsControlPanel from './VectorsVectorsControlPanel.js';
import VectorsViewProperties from './VectorsViewProperties.js';
import VectorsModel from '../model/VectorsModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;
type VectorsScreenViewOptions = SelfOptions & ProjectileMotionScreenViewOptions;

class VectorsScreenView extends ProjectileMotionScreenView {

  public constructor( model: VectorsModel, providedOptions: VectorsScreenViewOptions ) {

    const options = optionize<VectorsScreenViewOptions, SelfOptions, ProjectileMotionScreenViewOptions>()( {
      addFlatirons: false
    }, providedOptions );

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