// Copyright 2016-2017, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroProjectilePanel = require( 'PROJECTILE_MOTION/intro/view/IntroProjectilePanel' );
  var IntroVectorsPanel = require( 'PROJECTILE_MOTION/intro/view/IntroVectorsPanel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  var VectorVisibilityProperties = require( 'PROJECTILE_MOTION/common/view/VectorVisibilityProperties' );

  /**
   * @param {IntroModel} model
   * @param {Object} [options]
   * @constructor
   */
  function IntroScreenView( model, options ) {

    // contains Properties about vector visibility, used in super class
    var visibilityProperties = new VectorVisibilityProperties();

    // acts as listParent for the projectile dropdown box
    var comboBoxListParent = new Node();

    ProjectileMotionScreenView.call(
      this,
      model,
      new IntroProjectilePanel(
        model.objectTypes,
        model.selectedProjectileObjectTypeProperty,
        comboBoxListParent,
        model.projectileMassProperty,
        model.projectileDiameterProperty,
        model.projectileDragCoefficientProperty,
        model.airResistanceOnProperty
      ),
      new IntroVectorsPanel( visibilityProperties ),
      visibilityProperties,
      options
    );

    // insert dropdown right on top of the rightside panels
    this.insertChild( this.indexOfChild( this.topRightPanel ) + 1, comboBoxListParent );
  }

  projectileMotion.register( 'IntroScreenView', IntroScreenView );

  return inherit( ProjectileMotionScreenView, IntroScreenView, {

    /**
     * Layout according to screenview and layout the combo box
     * @public
     * @override
     *
     * @param {number} width
     * @param {number} height
     */
    layout: function( width, height ) {
      ProjectileMotionScreenView.prototype.layout.call( this, width, height );
      this.topRightPanel.layoutComboBox();
    }

  } );
} );

