// Copyright 2016-2021, University of Colorado Boulder

/**
 * ScreenView for the 'Stats' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import ProjectileMotionViewProperties from '../../common/view/ProjectileMotionViewProperties.js';
import projectileMotion from '../../projectileMotion.js';
import StatsProjectileControlPanel from './StatsProjectileControlPanel.js';
import StatsControlPanel from './StatsControlPanel.js';
import FireHundredButton from './FireHundredButton.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';

const X_MARGIN = 10; //refactor into common view

class StatsScreenView extends ProjectileMotionScreenView {
  /**
   * @param {StatsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    options = merge(
      {
        addFlatirons: false
      },
      options
    );

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new ProjectileMotionViewProperties( {
      tandem: tandem.createTandem( 'viewProperties' ),
      forceProperties: false
    } );

    // acts as listParent for the projectile dropdown box
    const comboBoxListParent = new Node();

    const projectilePanel = new StatsProjectileControlPanel(
      model.objectTypes,
      model.selectedProjectileObjectTypeProperty,
      comboBoxListParent,
      model.projectileMassProperty,
      model.projectileDiameterProperty,
      model.projectileDragCoefficientProperty,
      model.airResistanceOnProperty,
      { tandem: tandem.createTandem( 'projectileControlPanel' ) }
    );

    // fire 100 button
    const fireHundredButton = new FireHundredButton( {
      minWidth: 50,
      iconWidth: 30,
      minHeight: 40,
      listener: () => {
        model.startFiringMultiple( 100 );
      },
      bottom: 0,
      left: 0,
      tandem: tandem.createTandem( 'fireHundredButton' ),
      phetioDocumentation: 'button to launch 100 projectiles'
    } );

    super(
      model,
      projectilePanel,
      new StatsControlPanel( visibilityProperties, {
        tandem: tandem.createTandem( 'vectorsControlPanel' )
      } ),
      visibilityProperties,
      tandem,
      options,
      ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES_STATS,
      true //constantTrajectoryOpacity
    );

    // @private
    this.projectilePanel = projectilePanel;

    // insert dropdown right on top of the right-side panels
    this.insertChild(
      this.indexOfChild( this.topRightPanel ) + 1,
      comboBoxListParent
    );

    this.fireHundredButton = fireHundredButton;
    this.addChild( this.fireHundredButton );

    // model.fireEnabledProperty.link((enable) => {
    //   this.fireHundredButton.setEnabled(enable);
    // });

    this.fireHundredButton.bottom = this.eraserButton.bottom;
    this.fireHundredButton.left = this.fireButton.right + X_MARGIN;
    this.timeControlNode.left = this.fireHundredButton.right + 40;
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

projectileMotion.register( 'StatsScreenView', StatsScreenView );
export default StatsScreenView;
