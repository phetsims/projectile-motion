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
  function LabModel() {
    var self = this;
    ProjectileMotionModel.call( self );

    // @public {Property.<boolean>} whether the CustomizeDialog is visible
    this.customizeDialogVisibleProperty = new Property( false );
  }

  projectileMotion.register( 'LabModel', LabModel );

  return inherit( ProjectileMotionModel, LabModel, {
    // @public resets all drag model elements, first calling the super class' reset
    reset: function() {
      ProjectileMotionModel.prototype.reset.call( this );
      this.customizeDialogVisibleProperty.reset();
    }
  } );
} );

