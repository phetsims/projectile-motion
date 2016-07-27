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
  // var PropertySet = require( 'AXON/PropertySet' );
  var Tracer = require( 'PROJECTILE_MOTION/lab/model/Tracer' );

  /**
   * @constructor
   */
  function ProjectileMotionLabModel() {
    var projectileMotionLabModel = this;
    ProjectileMotionModel.call( projectileMotionLabModel );

    // @public {Tracer} model for the tracer probe
    this.tracerModel = new Tracer( this.projectiles, 10, 10 ); // location arbitrary
  }

  projectileMotion.register( 'ProjectileMotionLabModel', ProjectileMotionLabModel );

  return inherit( ProjectileMotionModel, ProjectileMotionLabModel );
} );

