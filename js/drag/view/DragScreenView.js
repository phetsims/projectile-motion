// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DragVectorsPanel = require( 'PROJECTILE_MOTION/drag/view/DragVectorsPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  var DragProjectilePanel = require( 'PROJECTILE_MOTION/drag/view/DragProjectilePanel' );

  /**
   * @param {DragModel} model
   * @constructor
   */
  function DragScreenView( model, options ) {

    var self = this;

    options = options || {};

    // second panel shows dropdown of projectiles, air resistance checkbox, and disabled parameters
    options = _.extend( {
      secondPanel: new DragProjectilePanel( model ),
      vectorsPanel: new DragVectorsPanel( model )
    }, options );

    ProjectileMotionScreenView.call( self, model, options );

  }

  projectileMotion.register( 'DragScreenView', DragScreenView );

  return inherit( ProjectileMotionScreenView, DragScreenView );
} );

