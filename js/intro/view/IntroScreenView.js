// Copyright 2016-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import VectorVisibilityProperties from '../../common/view/VectorVisibilityProperties.js';
import projectileMotion from '../../projectileMotion.js';
import IntroProjectileControlPanel from './IntroProjectileControlPanel.js';
import IntroVectorsControlPanel from './IntroVectorsControlPanel.js';

/**
 * @param {IntroModel} model
 * @param {Tandem} tandem
 * @param {Object} [options]
 * @constructor
 */
function IntroScreenView( model, tandem, options ) {

  // contains Properties about vector visibility, used in super class
  const visibilityProperties = new VectorVisibilityProperties( {
    tandem: tandem.createTandem( 'vectorVisibilityProperties' ),
    forceProperties: false
  } );

  // acts as listParent for the projectile dropdown box
  const comboBoxListParent = new Node();

  // @private, for layout
  this.projectilePanel = new IntroProjectileControlPanel(
    model.objectTypes,
    model.selectedProjectileObjectTypeProperty,
    comboBoxListParent,
    model.projectileMassProperty,
    model.projectileDiameterProperty,
    model.projectileDragCoefficientProperty,
    model.airResistanceOnProperty,
    { tandem: tandem.createTandem( 'projectileControlPanel' ) }
  );

  ProjectileMotionScreenView.call(
    this,
    model,
    this.projectilePanel,
    new IntroVectorsControlPanel( visibilityProperties, { tandem: tandem.createTandem( 'vectorsControlPanel' ) } ),
    visibilityProperties,
    tandem,
    options
  );

  // insert dropdown right on top of the rightside panels
  this.insertChild( this.indexOfChild( this.topRightPanel ) + 1, comboBoxListParent );
}

projectileMotion.register( 'IntroScreenView', IntroScreenView );

inherit( ProjectileMotionScreenView, IntroScreenView, {
  /**
   * Layout
   * @param {number} width
   * @param {number} height
   *
   * @override
   */
  layout: function( width, height ) {
    this.projectilePanel.hideComboBoxList();
    ProjectileMotionScreenView.prototype.layout.call( this, width, height );
  }
} );

export default IntroScreenView;