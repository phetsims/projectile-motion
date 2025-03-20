// Copyright 2016-2025, University of Colorado Boulder

/**
 * ScreenView for the 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import projectileMotion from '../../projectileMotion.js';
import DragProjectileControlPanel from './DragProjectileControlPanel.js';
import DragVectorsControlPanel from './DragVectorsControlPanel.js';
import DragViewProperties from './DragViewProperties.js';
import DragModel from '../model/DragModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';

type SelfOptions = EmptySelfOptions;
type DragScreenViewOptions = SelfOptions & ScreenViewOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class DragScreenView extends ProjectileMotionScreenView {

  public constructor( model: DragModel, providedOptions: DragScreenViewOptions ) {

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new DragViewProperties( providedOptions.tandem.createTandem( 'viewProperties' ) );

    super(
      model,
      new DragProjectileControlPanel(
        model.selectedProjectileObjectTypeProperty,
        model.projectileDragCoefficientProperty,
        model.projectileDiameterProperty,
        model.projectileMassProperty,
        model.altitudeProperty, {
          tandem: providedOptions.tandem.createTandem( 'projectileControlPanel' )
        }
      ),
      new DragVectorsControlPanel( visibilityProperties, { tandem: providedOptions.tandem.createTandem( 'vectorsControlPanel' ) } ),
      visibilityProperties,
      providedOptions );
  }
}

projectileMotion.register( 'DragScreenView', DragScreenView );
export default DragScreenView;