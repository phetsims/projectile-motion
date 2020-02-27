// Copyright 2016-2020, University of Colorado Boulder

/**
 * Functions that create nodes for the projectile objects
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import baseballImage from '../../../images/baseball_png.js';
import car1Image from '../../../images/car_1_png.js';
import car2Image from '../../../images/car_2_png.js';
import footballImage from '../../../images/football_png.js';
import human1Image from '../../../images/human_1_png.js';
import human2Image from '../../../images/human_2_png.js';
import piano1Image from '../../../images/piano_1_png.js';
import piano2Image from '../../../images/piano_2_png.js';
import pumpkin1Image from '../../../images/pumpkin_1_png.js';
import pumpkin2Image from '../../../images/pumpkin_2_png.js';
import tankShellImage from '../../../images/tank_shell_png.js';
import projectileMotion from '../../projectileMotion.js';

// image

const ProjectileObjectViewFactory = {

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
    const radius = diameter / 2;
    let shape;
    let angle;
    let newRadius;
    let newCenterX;
    if ( dragCoefficient <= 0.47 ) { // teardrop (inclusive) to sphere (inclusive)

      // Algorithm from http://mathworld.wolfram.com/TeardropCurve.html
      // drag coefficient ranges from [ 0.04 , 0.47 ], and m ranges from 0 to 7
      const m = Utils.linear( 0.04, 0.47, 4, 0, dragCoefficient );
      shape = new Shape();
      shape.moveTo( -radius, 0 );
      let t;
      for ( t = Math.PI / 24; t < 2 * Math.PI; t += Math.PI / 24 ) {
        const x = -Math.cos( t ) * radius;
        const y = Math.sin( t ) * Math.pow( Math.sin( 0.5 * t ), m ) * radius;
        shape.lineTo( x, y );
      }
      shape.lineTo( -radius, 0 );

      // to maintain the same cross sectional area
      const currentCrossSectionalRadius = ( shape.bounds.maxY - shape.bounds.minY ) / 2;
      const scaleFactor = radius / currentCrossSectionalRadius;

      shape = shape.transformed( Matrix3.scaling( scaleFactor, scaleFactor ) );

      const objectNode = new Path( shape, { fill: 'black' } );

      // used to shift center onto COM
      const strut = new Line( objectNode.left, 0, 1.5 * objectNode.width - 2 * radius, 0, { visible: false } );

      return new Node( { children: [ strut, objectNode ] } );
    }
    else {

      // sphere (exclusive) to kind of hemisphere (inclusive ) = ( 0.47 , 1 )
      shape = new Shape();
      shape.arc( 0, 0, radius, Math.PI / 2, 3 * Math.PI / 2, false );
      shape.moveTo( 0, -radius );

      angle = Utils.linear( 0.47, 1.17, Math.PI / 2, 0, dragCoefficient );
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
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    return new Circle( transformedBallSize / 2, { fill: 'black' } );
  },

  createPumpkin: function( diameter, modelViewTransform, landed ) {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( landed ) {
      return new Image( pumpkin2Image, { maxHeight: transformedBallSize * 0.75 } );
    }
    else {
      return new Image( pumpkin1Image, { maxHeight: transformedBallSize * 0.95 } );
    }
  },

  createBaseball: function( diameter, modelViewTransform, landed ) {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    return new Image( baseballImage, { maxWidth: transformedBallSize } );
  },

  createCar: function( diameter, modelViewTransform, landed ) {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( landed ) {
      return new Image( car2Image, { maxHeight: transformedBallSize * 1.7 } );
    }
    else {
      return new Image( car1Image, { maxHeight: transformedBallSize * 0.75 } );
    }
  },

  createFootball: function( diameter, modelViewTransform, landed ) {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    return new Image( footballImage, { maxHeight: transformedBallSize } );
  },

  createHuman: function( diameter, modelViewTransform, landed ) {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( landed ) {
      return new Image( human2Image, { maxWidth: transformedBallSize * 1.35 } );
    }
    else {
      return new Image( human1Image, { maxHeight: transformedBallSize * 1.9 } );
    }
  },

  createPiano: function( diameter, modelViewTransform, landed ) {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( landed ) {
      return new Image( piano2Image, { maxWidth: transformedBallSize * 1.3 } );
    }
    else {
      return new Image( piano1Image, { maxWidth: transformedBallSize * 1.1 } );
    }
  },

  createGolfBall: function( diameter, modelViewTransform, landed ) {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    return new Circle( transformedBallSize / 2, { fill: 'white', stroke: 'gray' } );
  },

  createTankShell: function( diameter, modelViewTransform, landed ) {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    return new Image( tankShellImage, { maxHeight: transformedBallSize } );
  }
};

projectileMotion.register( 'ProjectileObjectViewFactory', ProjectileObjectViewFactory );

export default ProjectileObjectViewFactory;