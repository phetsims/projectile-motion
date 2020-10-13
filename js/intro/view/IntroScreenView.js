// Copyright 2016-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import VectorVisibilityProperties from '../../common/view/VectorVisibilityProperties.js';
import projectileMotion from '../../projectileMotion.js';
import IntroProjectileControlPanel from './IntroProjectileControlPanel.js';
import IntroVectorsControlPanel from './IntroVectorsControlPanel.js';

class IntroScreenView extends ProjectileMotionScreenView {

  /**
   * @param {IntroModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new VectorVisibilityProperties( {
      tandem: tandem.createTandem( 'vectorVisibilityProperties' ),
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
      { tandem: tandem.createTandem( 'projectileControlPanel' ) }
    );

    super(
      model,
      projectilePanel,
      new IntroVectorsControlPanel( visibilityProperties, { tandem: tandem.createTandem( 'vectorsControlPanel' ) } ),
      visibilityProperties,
      tandem,
      options
    );

    // @private
    this.projectilePanel = projectilePanel;

    // insert dropdown right on top of the right-side panels
    this.insertChild( this.indexOfChild( this.topRightPanel ) + 1, comboBoxListParent );
  }

  /**
   * Layout
   * @param {number} width
   * @param {number} height
   * @public (joist-internal)
   * @override
   */
  layout( width, height ) {
    this.projectilePanel.hideComboBoxList();
    super.layout( width, height );
  }
}

projectileMotion.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;