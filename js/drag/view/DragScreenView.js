// Copyright 2015, University of Colorado Boulder

/**
 * ScreenView for the 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DragVectorsPanel = require( 'PROJECTILE_MOTION/drag/view/DragVectorsPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  var DragProjectilePanel = require( 'PROJECTILE_MOTION/drag/view/DragProjectilePanel' );
  var VectorVisibilityProperties = require( 'PROJECTILE_MOTION/common/view/VectorVisibilityProperties' );

  /**
   * @param {DragModel} model
   * @constructor
   */
  function DragScreenView( model, options ) {

    var self = this;

    options = options || {};

    // contains properties about vector visibility, used in super class
    var visibilityProperties = new VectorVisibilityProperties();

    // vectors visibility for velocity and force, total or component
    visibilityProperties.velocityVectorsOnProperty = new Property( false );
    visibilityProperties.forceVectorsOnProperty = new Property( false );
    visibilityProperties.totalOrComponentsProperty = new Property( 'total' ); // or 'components'
    
    // update which vectors to show based on controls
    Property.multilink( [ visibilityProperties.velocityVectorsOnProperty, visibilityProperties.forceVectorsOnProperty, visibilityProperties.totalOrComponentsProperty ], function() {
      visibilityProperties.totalVelocityVectorOnProperty.set( visibilityProperties.velocityVectorsOnProperty.get() && visibilityProperties.totalOrComponentsProperty.get() === 'total' );
      visibilityProperties.componentsVelocityVectorsOnProperty.set( visibilityProperties.velocityVectorsOnProperty.get() && visibilityProperties.totalOrComponentsProperty.get() === 'components' );
      visibilityProperties.totalForceVectorOnProperty.set( visibilityProperties.forceVectorsOnProperty.get() && visibilityProperties.totalOrComponentsProperty.get() === 'total' );
      visibilityProperties.componentsForceVectorsOnProperty.set( visibilityProperties.forceVectorsOnProperty.get() && visibilityProperties.totalOrComponentsProperty.get() === 'components' );
    } );

    // reset for vectorVisibilityProperties needs to be updated with the new properties
    visibilityProperties.reset = function() {
      VectorVisibilityProperties.prototype.reset.call( this );
      this.velocityVectorsOnProperty.reset();
      this.forceVectorsOnProperty.reset();
      this.totalOrComponentsProperty.reset();
    };

    // second panel shows dropdown of projectiles, air resistance checkbox, and disabled parameters
    options = _.extend( {
      secondPanel: new DragProjectilePanel(
                                            model.projectileDragCoefficientProperty,
                                            model.projectileDiameterProperty,
                                            model.projectileMassProperty,
                                            model.altitudeProperty
      ),
      vectorsPanel: new DragVectorsPanel( visibilityProperties ),
      vectorVisibilityProperties: visibilityProperties
    }, options );

    ProjectileMotionScreenView.call( self, model, options );

  }

  projectileMotion.register( 'DragScreenView', DragScreenView );

  return inherit( ProjectileMotionScreenView, DragScreenView );
} );

