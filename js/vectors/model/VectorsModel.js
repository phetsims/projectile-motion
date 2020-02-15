// Copyright 2016-2020, University of Colorado Boulder

/**
 * Model for the 'Vectors' Screen.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  const ProjectileObjectType = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectType' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function VectorsModel( tandem ) {
    ProjectileMotionModel.call( this, ProjectileObjectType.COMPANIONLESS, true,
      [ ProjectileObjectType.COMPANIONLESS ], tandem, {
        phetioInstrumentAltitudeProperty: false
      } );
  }

  projectileMotion.register( 'VectorsModel', VectorsModel );

  return inherit( ProjectileMotionModel, VectorsModel );
} );

