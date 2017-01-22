// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  var Property = require( 'AXON/Property' );
  /**
   * @constructor
   */
  function ProjectileMotionDragModel() {
    var self = this;
    ProjectileMotionModel.call( self );

    // vectors visibility for velocity and force, total or component
    this.velocityVectorsOnProperty = new Property( false );
    this.forceVectorsOnProperty = new Property( false );
    this.totalOrComponentsProperty = new Property( 'total' ); // or 'components'
    // update which vectors to show based on controls
    Property.multilink( [ this.velocityVectorsOnProperty, this.forceVectorsOnProperty, this.totalOrComponentsProperty ], function() {
      self.totalVelocityVectorOn = self.velocityVectorsOnProperty.get() && self.totalOrComponentsProperty.get() === 'total';
      self.componentsVelocityVectorsOn = self.velocityVectorsOnProperty.get() && self.totalOrComponentsProperty.get() === 'components';
      self.totalForceVectorOn = self.forceVectorsOnProperty.get() && self.totalOrComponentsProperty.get() === 'total';
      self.componentsForceVectorsOn = self.forceVectorsOnProperty.get() && self.totalOrComponentsProperty.get() === 'components';
    } );
  }

  projectileMotion.register( 'ProjectileMotionDragModel', ProjectileMotionDragModel );

  return inherit( ProjectileMotionModel, ProjectileMotionDragModel);
} );

