// Copyright 2022-2023, University of Colorado Boulder

/**
 * ScreenView for the 'Stats' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import '../../common/ProjectileMotionQueryParameters.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import ProjectileMotionViewProperties from '../../common/view/ProjectileMotionViewProperties.js';
import projectileMotion from '../../projectileMotion.js';
import FireMultipleButton from './FireMultipleButton.js';
import StatsControlPanel from './StatsControlPanel.js';
import StatsProjectileControlPanel from './StatsProjectileControlPanel.js';

// constants
const X_MARGIN = 10;
const FIRE_BUTTON_MARGIN_X = 40;

class StatsScreenView extends ProjectileMotionScreenView {
  /**
   * @param {StatsModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    options = merge( {
      addFlatirons: false,
      cannonNodeOptions: { preciseCannonDelta: true },
      maxTrajectories: ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES_STATS,
      showPaths: false,
      constantTrajectoryOpacity: true

    }, options );

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new ProjectileMotionViewProperties( {
      tandem: options.tandem.createTandem( 'viewProperties' ),
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
      { tandem: options.tandem.createTandem( 'projectileControlPanel' ) }
    );

    const statsPanel = new StatsControlPanel(
      model.groupSizeProperty,
      model.initialSpeedStandardDeviationProperty,
      model.initialAngleStandardDeviationProperty,
      model.rapidFireModeProperty,
      visibilityProperties,
      { tandem: options.tandem.createTandem( 'statsControlPanel' ) }
    );

    const fireMultipleButton = new FireMultipleButton( {
      minWidth: 75,
      iconWidth: 35,
      minHeight: 42,
      listener: () => {
        model.fireMultipleProjectiles();
        this.cannonNode.flashMuzzle();
      },
      tandem: options.tandem.createTandem( 'fireMultipleButton' ),
      phetioDocumentation: 'button to launch multiple simultaneous projectiles'
    } );

    super(
      model,
      projectilePanel,
      statsPanel,
      visibilityProperties,
      options
    );

    // @private
    this.projectilePanel = projectilePanel;
    this.statsPanel = statsPanel;
    this.fireMultipleButton = fireMultipleButton;

    model.fireMultipleEnabledProperty.link( enable => {
      this.fireMultipleButton.setEnabled( enable );
    } );

    // insert dropdowns on top of the right-side panels
    this.insertChild(
      this.indexOfChild( this.topRightPanel ) + 1,
      comboBoxListParent
    );

    this.addChild( this.fireMultipleButton );

    this.fireButton.left = this.initialAnglePanel.right + FIRE_BUTTON_MARGIN_X;
    this.fireMultipleButton.left = this.fireButton.right + X_MARGIN;
    this.fireMultipleButton.centerY = this.fireButton.centerY;
    this.timeControlNode.left = this.fireMultipleButton.right + FIRE_BUTTON_MARGIN_X;
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
