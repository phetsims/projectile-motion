// Copyright 2016-2023, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import ProjectileMotionViewProperties from '../../common/view/ProjectileMotionViewProperties.js';
import projectileMotion from '../../projectileMotion.js';
import IntroProjectileControlPanel from './IntroProjectileControlPanel.js';
import IntroVectorsControlPanel from './IntroVectorsControlPanel.js';

class IntroScreenView extends ProjectileMotionScreenView {

  /**
   * @param {IntroModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
      addFlatirons: false
    }, options );

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new ProjectileMotionViewProperties( {
      tandem: options.tandem.createTandem( 'viewProperties' ),
      forceProperties: false
    } );

    // acts as listParent for the projectile dropdown box
    const comboBoxListParent = new Node();

    const projectilePanel = new IntroProjectileControlPanel(
      model.objectTypes,
      model.selectedProjectileObjectTypeProperty,
      comboBoxListParent,
      model.projectileMassProperty,
      model.projectileDiameterProperty,
      model.projectileDragCoefficientProperty,
      model.airResistanceOnProperty,
      { tandem: options.tandem.createTandem( 'projectileControlPanel' ) }
    );

    super(
      model,
      projectilePanel,
      new IntroVectorsControlPanel( visibilityProperties, { tandem: options.tandem.createTandem( 'vectorsControlPanel' ) } ),
      visibilityProperties,
      options
    );

    // @private
    this.projectilePanel = projectilePanel;

    // insert dropdown right on top of the right-side panels
    this.insertChild( this.indexOfChild( this.topRightPanel ) + 1, comboBoxListParent );
  }

  /**
   * Layout
   * @param {Bounds2} viewBounds
   * @public (joist-internal)
   * @override
   */
  layout( viewBounds ) {
    this.projectilePanel.hideComboBoxList();
    super.layout( viewBounds );
  }
}

projectileMotion.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;