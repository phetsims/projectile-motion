// Copyright 2016-2017, University of Colorado Boulder

/**
 * Functions that create nodes for the projectile objects
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Path = require( 'SCENERY/nodes/Path' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );

  // image
  var pumpkin1Image = require( 'image!PROJECTILE_MOTION/pumpkin_1.png' );
  var pumpkin2Image = require( 'image!PROJECTILE_MOTION/pumpkin_2.png' );
  var baseballImage = require( 'image!PROJECTILE_MOTION/baseball.png' );
  var car1Image = require( 'image!PROJECTILE_MOTION/car_1.png' );
  var car2Image = require( 'image!PROJECTILE_MOTION/car_2.png' );
  var footballImage = require( 'image!PROJECTILE_MOTION/football.png' );
  var human1Image = require( 'image!PROJECTILE_MOTION/human_1.png' );
  var human2Image = require( 'image!PROJECTILE_MOTION/human_2.png' );
  var piano1Image = require( 'image!PROJECTILE_MOTION/piano_1.png' );
  var piano2Image = require( 'image!PROJECTILE_MOTION/piano_2.png' );
  var tankShellImage = require( 'image!PROJECTILE_MOTION/tank_shell.png' );

  var ProjectileObjectViewFactory = {

    /**
     * A custom object view
     * @public
     *
     * @param {number} diameter - in meters in model coordinates
     * @param {number} dragCoefficient
     * @returns {Circle}
     */
    createCustom: function( diameter, dragCoefficient ) {

      // drag coefficients estimated from three sources:
      // https://en.wikipedia.org/wiki/Drag_coefficient#Drag_coefficient_cd_examples
      // https://www.grc.nasa.gov/www/k-12/airplane/shaped.html
      // http://www.aerospaceweb.org/question/aerodynamics/q0231.shtml
      assert && assert( dragCoefficient >= 0.04 && dragCoefficient <= 1, 'drag coefficient ' + dragCoefficient + ' out of bounds' );
      var radius = diameter / 2;
      var shape;
      var angle;
      var newRadius;
      var newCenterX;
      if ( dragCoefficient <= 0.47 ) { // teardrop (inclusive) to sphere (inclusive)

        // Algorithm from http://mathworld.wolfram.com/TeardropCurve.html
        // drag coefficient ranges from [ 0.04 , 0.47 ], and m ranges from 0 to 7
        var m = Util.linear( 0.04, 0.47, 4, 0, dragCoefficient );
        shape = new Shape();
        shape.moveTo( -radius, 0 );
        var t;
        for ( t = Math.PI / 24; t < 2 * Math.PI; t += Math.PI / 24 ) {
          var x = -Math.cos( t ) * radius;
          var y = Math.sin( t ) * Math.pow( Math.sin( 0.5 * t ), m ) * radius;
          shape.lineTo( x, y );
        }
        shape.lineTo( -radius, 0 );

        // to maintain the same cross sectional area
        var currentCrossSectionalRadius = ( shape.bounds.maxY - shape.bounds.minY ) / 2;
        var scaleFactor = radius / currentCrossSectionalRadius;

        shape = shape.transformed( Matrix3.scaling( scaleFactor, scaleFactor ) );

        var objectNode = new Path( shape, { fill: 'black' } );

        // used to shift center onto COM
        var strut = new Line( objectNode.left, 0, 1.5 * objectNode.width - 2 * radius, 0, { visible: false } );

        return new Node( { children: [ strut, objectNode ] } );
      }
      else {

        // sphere (exclusive) to kind of hemisphere (inclusive ) = ( 0.47 , 1 )
        shape = new Shape();
        shape.arc( 0, 0, radius, Math.PI / 2, 3 * Math.PI / 2, false );
        shape.moveTo( 0, -radius );

        angle = Util.linear( 0.47, 1.17, Math.PI / 2, 0, dragCoefficient );
        newRadius = radius / Math.sin( angle );
        newCenterX = -radius / Math.tan( angle );
        shape.arc( newCenterX, 0, newRadius, -angle, angle, false );
        return new Path( shape, { fill: 'black' } );
      }
    },

    /**
     * Preset object view functions for benchmarks, some benchmarks have different landed objects
     * @public
     *
     * @param {number} diameter - in meters in model coordinates
     * @param {ModelViewTransform2} modelViewTransform
     * @param {boolean} landed - whether we want the landed object view, as opposed to a flying projectile view
     * @returns {Circle|Image|Path}
     */

    createCannonball: function( diameter, modelViewTransform, landed ) {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      return new Circle( transformedBallSize / 2, { fill: 'black' } );
    },

    createPumpkin: function( diameter, modelViewTransform, landed ) {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      if ( landed ) {
        return new Image( pumpkin2Image, { maxHeight: transformedBallSize * 0.75 } );
      }
      else {
        return new Image( pumpkin1Image, { maxHeight: transformedBallSize * 0.95 } );
      }
    },

    createBaseball: function( diameter, modelViewTransform, landed ) {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      return new Image( baseballImage, { maxWidth: transformedBallSize } );
    },

    createCar: function( diameter, modelViewTransform, landed ) {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      if ( landed ) {
        return new Image( car2Image, { maxHeight: transformedBallSize * 1.7 } );
      }
      else {
        return new Image( car1Image, { maxHeight: transformedBallSize * 0.75 } );
      }
    },

    createFootball: function( diameter, modelViewTransform, landed ) {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      return new Image( footballImage, { maxHeight: transformedBallSize } );
    },

    createHuman: function( diameter, modelViewTransform, landed ) {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      if ( landed ) {
        return new Image( human2Image, { maxWidth: transformedBallSize * 1.35 } );
      }
      else {
        return new Image( human1Image, { maxHeight: transformedBallSize * 1.9 } );
      }
    },

    createPiano: function( diameter, modelViewTransform, landed ) {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      if ( landed ) {
        return new Image( piano2Image, { maxWidth: transformedBallSize * 1.3 } );
      }
      else {
        return new Image( piano1Image, { maxWidth: transformedBallSize * 1.1 } );
      }
    },

    createGolfBall: function( diameter, modelViewTransform, landed ) {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      return new Circle( transformedBallSize / 2, { fill: 'white', stroke: 'gray' } );
    },

    createTankShell: function( diameter, modelViewTransform, landed ) {
      var transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
      return new Image( tankShellImage, { maxHeight: transformedBallSize } );
    }
  };

  projectileMotion.register( 'ProjectileObjectViewFactory', ProjectileObjectViewFactory );

  return ProjectileObjectViewFactory;

} );

