// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the 'Drag' Screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  const ProjectileObjectType = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectType' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function DragModel( tandem ) {

    const defaultObjectType = new ProjectileObjectType(
      null,
      5,
      0.8,
      ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT,
      null,
      true, {
        tandem: tandem.createTandem( 'generalObjectType' ),
        phetioDocumentation: 'On this screen there is only a single, general projectile object type. It cannot be ' +
                             'changed to a different object type, but can be altered via Properties in the model.'
      }
    );
    ProjectileMotionModel.call( this, defaultObjectType, true, [ defaultObjectType ], tandem );

  }

  projectileMotion.register( 'DragModel', DragModel );

  return inherit( ProjectileMotionModel, DragModel );
} );

