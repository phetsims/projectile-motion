// Copyright 2016, University of Colorado Boulder

/**
 * View for the projectile.
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
   * @param {number} radius - radius of the projectile
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

