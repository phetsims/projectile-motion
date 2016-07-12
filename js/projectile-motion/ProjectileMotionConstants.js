// Copyright 2016, University of Colorado Boulder

/**
 * This object is collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this simulation.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var ProjectileMotionConstants = {

    LABEL_FONT: new PhetFont( 18 ),

    VELOCITY_RANGE: { min: 0, max: 50 },
    ANGLE_RANGE: { min: -90, max: 180 },

    INITIAL_TRAJECTORY_X: 0,
    INITIAL_TRAJECTORY_Y: 2

  };

  projectileMotion.register( 'ProjectileMotionConstants', ProjectileMotionConstants );

  return ProjectileMotionConstants;

} );
