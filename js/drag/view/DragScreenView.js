// Copyright 2016-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import projectileMotion from '../../projectileMotion.js';
import DragProjectileControlPanel from './DragProjectileControlPanel.js';
import DragVectorsControlPanel from './DragVectorsControlPanel.js';
import DragVectorVisibilityProperties from './DragVectorVisibilityProperties.js';

/**
 * @param {DragModel} model
 * @param {Tandem} tandem
 * @param {Object} [options]
 * @constructor
 */
function DragScreenView( model, tandem, options ) {

  // contains Properties about vector visibility, used in super class
  const visibilityProperties = new DragVectorVisibilityProperties( tandem.createTandem( 'vectorVisibilityProperties' ) );

  ProjectileMotionScreenView.call(
    this,
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

projectileMotion.register( 'DragScreenView', DragScreenView );

inherit( ProjectileMotionScreenView, DragScreenView );
export default DragScreenView;