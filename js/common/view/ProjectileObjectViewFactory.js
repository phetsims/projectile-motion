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
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );

  var ProjectileObjectViewFactory = {

    // @public creates a {Circle} custom object view based on {number} and {number} drag coefficient
    createCustom: function( radius, dragCoefficient ) {
      // drag coefficients estimated from three sources:
      // https://en.wikipedia.org/wiki/Drag_coefficient#Drag_coefficient_cd_examples
      // https://www.grc.nasa.gov/www/k-12/airplane/shaped.html
      // http://www.aerospaceweb.org/question/aerodynamics/q0231.shtml
      // TODO: the remaining cases
      // TODO: rotate the projectile based on change in angle
      var shape;
      var angle;
      var newRadius;
      var newCenterX;
      if ( dragCoefficient <= 0.47 ) { // teardrop (inclusive) to sphere (inclusive)
        // [ 0.04 , 0.47 ]
        // vary m from 0 to 7
        // TODO: source url
        var m = Util.linear( 0.04, 0.47, 4, 0, dragCoefficient );
        shape = new Shape();
        shape.moveTo( -radius, 0 );
        var t;
        for ( t = Math.PI / 12; t < 2 * Math.PI; t += Math.PI / 12 ) {
          var x = -Math.cos( t ) * radius;
          var y = Math.sin( t ) * Math.pow( Math.sin( 0.5 * t ), m ) * radius;
          shape.lineTo( x, y );
        }
        shape.lineTo( -radius, 0 );
        return new Path( shape, { fill: 'black' } );
      }
      else if ( dragCoefficient < 1.17 ) { // sphere (exclusive) to hemisphere (exclusive)
        // ( 0.47 , 1.17 )
        shape = new Shape();
        shape.arc( 0, 0, radius, Math.PI / 2, 3 * Math.PI / 2, false );
        shape.moveTo( 0, -radius );

        angle = Util.linear( 0.47, 1.17, Math.PI / 2, 0, dragCoefficient );
        newRadius = radius / Math.sin( angle );
        newCenterX = -radius / Math.tan( angle );
        shape.arc( newCenterX, 0, newRadius, -angle, angle, false );
        return new Path( shape, { fill: 'black' } );
      }
      else if ( dragCoefficient === 1.17 ) { // hemisphere
        shape = new Shape();
        shape.arc( 0, 0, radius, Math.PI / 2, 3 * Math.PI / 2, false );

        shape.moveTo( 0, -radius );
        shape.lineTo( 0, radius );
        return new Path( shape, { fill: 'black' } );
      }
      else { // hemisphere (exclusive) to flat disc (inclusive)
        // ( 1.17 , 1.28 ]
        // width of disc is 0.3, height is 2
        shape = new Shape();
        shape.moveTo( -0.3 * radius, -radius );
        shape.lineTo( 0, -radius );
        shape.lineTo( 0, radius );
        shape.lineTo( -0.3 * radius, radius );

        angle = Util.linear( 1.17, 1.281, Math.atan( 1 / 0.3 ), 0, dragCoefficient );
        newRadius = radius / Math.sin( angle );
        newCenterX = radius / Math.tan( angle ) - 0.3 * radius;
        shape.arc( newCenterX, 0, newRadius, -Math.PI + angle, Math.PI - angle, true );
        return new Path( shape, { fill: 'black' } );
     }
    },

    // only used by intro screen
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

