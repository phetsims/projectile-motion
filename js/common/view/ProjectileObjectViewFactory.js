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
  var Path = require( 'SCENERY/nodes/Path' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  var ProjectileObjectViewFactory = {

    // @public creates a {Circle} custom object view based on {number} and {number} drag coefficient
    createCustom: function( radius, dragCoefficient ) {
      // drag coefficients estimated from three sources:
      // https://en.wikipedia.org/wiki/Drag_coefficient#Drag_coefficient_cd_examples
      // https://www.grc.nasa.gov/www/k-12/airplane/shaped.html
      // http://www.aerospaceweb.org/question/aerodynamics/q0231.shtml
      // TODO: the remaining cases
      // TODO: rotate the projectile based on change in angle
      if ( dragCoefficient <= 0.04 ) { // teardrop
        var teardrop = new Shape();
        teardrop.arc( 0, 0, radius, Math.PI / 2, 3 * Math.PI / 2, true );
        teardrop.moveTo( 0, radius );
        teardrop.lineTo( -radius * 2, 0 );
        teardrop.lineTo( 0, -radius );
        return new Path( teardrop, { fill: 'black' } );
      }
      else if ( dragCoefficient <= 0.30 ) { // bullet
        var bullet = new Shape();
        bullet.arc( 0, 0, radius, Math.PI / 2, 3 * Math.PI / 2, true );
        bullet.moveTo( 0, radius );
        bullet.lineTo( -radius * 2, radius );
        bullet.lineTo( -radius * 2, -radius );
        bullet.lineTo( 0, -radius );
        return new Path( bullet, { fill: 'black' } );
      }
      else if ( dragCoefficient <= 0.47 ) { // sphere
        return new Circle( radius, { fill: 'black' } );
      }
      else if ( dragCoefficient <= 0.59 ) { // ellipsoid
        var ellipsoid = new Shape();
        ellipsoid.ellipticalArc( 0, 0, radius * 2, radius, 0, 0, Math.PI * 2 );
        return new Path( ellipsoid, { fill: 'black' } );
      }
      else if ( dragCoefficient <= 1.17 ) { // hemisphere
        var hemisphere = new Shape();
        hemisphere.arc( 0, 0, radius, Math.PI / 2, 3 * Math.PI / 2, true );
        hemisphere.moveTo( 0, radius );
        hemisphere.lineTo( 0, -radius );
        return new Path( hemisphere, { fill: 'black' } );
      }
      else if ( dragCoefficient <= 1.28 ) { // flat plate
        return new Rectangle( -radius / 4, - radius, radius / 2, 2 * radius, { fill: 'black' } );
      }
      else {
        throw new Error( 'dragCoefficient out of range' );
      }
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

