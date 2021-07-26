// Copyright 2016-2020, University of Colorado Boulder

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
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new DragViewProperties( tandem.createTandem( 'viewProperties' ) );

    super(
      model,
      new DragProjectileControlPanel(
        model.selectedProjectileObjectTypeProperty,
        model.projectileDragCoefficientProperty,
        model.projectileDiameterProperty,
        model.projectileMassProperty,
        model.altitudeProperty,
        { tandem: tandem.createTandem( 'projectileControlPanel' ) }
      ),
      new DragVectorsControlPanel( visibilityProperties, { tandem: tandem.createTandem( 'vectorsControlPanel' ) } ),
      visibilityProperties,
      tandem,
      options );
  }
}

projectileMotion.register( 'DragScreenView', DragScreenView );
export default DragScreenView;