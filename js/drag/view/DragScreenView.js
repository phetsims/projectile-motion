// Copyright 2016-2023, University of Colorado Boulder

/**
 * ScreenView for the 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import projectileMotion from '../../projectileMotion.js';
import DragProjectileControlPanel from './DragProjectileControlPanel.js';
import DragVectorsControlPanel from './DragVectorsControlPanel.js';
import DragViewProperties from './DragViewProperties.js';

class DragScreenView extends ProjectileMotionScreenView {

  /**
   * @param {DragModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new DragViewProperties( options.tandem.createTandem( 'viewProperties' ) );

    super(
      model,
      new DragProjectileControlPanel(
        model.selectedProjectileObjectTypeProperty,
        model.projectileDragCoefficientProperty,
        model.projectileDiameterProperty,
        model.projectileMassProperty,
        model.altitudeProperty, {
          tandem: options.tandem.createTandem( 'projectileControlPanel' )
        }
      ),
      new DragVectorsControlPanel( visibilityProperties, { tandem: options.tandem.createTandem( 'vectorsControlPanel' ) } ),
      visibilityProperties,
      options );
  }
}

projectileMotion.register( 'DragScreenView', DragScreenView );
export default DragScreenView;