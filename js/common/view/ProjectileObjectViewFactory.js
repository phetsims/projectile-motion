// Copyright 2016, University of Colorado Boulder

/**
 * Functions that create nodes for the projectile objects
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';
  
  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );

  var ProjectileObjectViewFactory = {

    // @public creates a {Circle} custom object view based on {number} and {number} drag coefficient
    createCustom: function( radius, dragCoefficient ) {
      return new Circle( radius, { fill: 'black' } );
    },

    createObjectView: function( projectileObjectModel, modelViewTransform ) {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( projectileObjectModel.diameter );
      switch ( projectileObjectModel.type ) {
        case 'cannonball':
          return new Circle( transformedBallSize / 2, { fill: 'black' } );
        case 'tankShell':
          return new Circle( transformedBallSize / 2, { fill: 'gray', stroke: 'black' } );
        case 'pumpkin':
          return new Circle( transformedBallSize / 2, { fill: 'orange', stroke: 'black' } );
        default:
          throw new Error( 'type is not right' );
      }
    }
  };

  projectileMotion.register( 'ProjectileObjectViewFactory', ProjectileObjectViewFactory );

  return ProjectileObjectViewFactory;

} );

