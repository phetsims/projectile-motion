// Copyright 2016-2025, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import ProjectileMotionViewProperties from '../../common/view/ProjectileMotionViewProperties.js';
import projectileMotion from '../../projectileMotion.js';
import IntroProjectileControlPanel from './IntroProjectileControlPanel.js';
import IntroVectorsControlPanel from './IntroVectorsControlPanel.js';
import IntroModel from '../model/IntroModel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class IntroScreenView extends ProjectileMotionScreenView {

  private readonly projectileControlPanel;

  public constructor( model: IntroModel, tandem: Tandem ) {

    // contains Properties about vector visibility, used in super class
    const viewProperties = new ProjectileMotionViewProperties( {
      tandem: tandem.createTandem( 'viewProperties' ),
      forceProperties: false
    } );

    // acts as listParent for the projectile dropdown box
    const comboBoxListParent = new Node();

    const projectileControlPanel = new IntroProjectileControlPanel(
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
      projectileControlPanel,
      new IntroVectorsControlPanel( viewProperties, { tandem: tandem.createTandem( 'vectorsControlPanel' ) } ),
      viewProperties,
      {
        tandem: tandem,
        addFlatirons: false
      }
    );

    this.projectileControlPanel = projectileControlPanel;

    // insert dropdown right on top of the right-side panels
    this.insertChild( this.indexOfChild( this.topRightPanel ) + 1, comboBoxListParent );
  }

  /**
   *
   * @param viewBounds
   */
  public override layout( viewBounds: Bounds2 ) : void {
    this.projectileControlPanel.hideComboBoxList();
    super.layout( viewBounds );
  }
}

projectileMotion.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;