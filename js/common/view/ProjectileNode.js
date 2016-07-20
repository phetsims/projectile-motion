// Copyright 2016, University of Colorado Boulder

/**
 * Trajectory view.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );

  /**
   * @param {Trajectory} trajectory - model for the trajectory
   * @param {Property} velocityVectorComponentsOnProperty - whether those vectors should be visible
   * @param {ModelViewTransform2} modelViewTransform - meters to scale, inverted y axis, translated origin
   * @constructor
   */
  function ProjectileNode( radius, options ) {
    options = options || {};
    options = _.extend( { fill: 'black' }, options);

    Circle.call( this, radius, options );
  }

  projectileMotion.register( 'ProjectileNode', ProjectileNode );

  return inherit( Circle, ProjectileNode );
} );

