// Copyright 2016-2023, University of Colorado Boulder

/**
 * Functions that create nodes for the projectile objects
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Circle, Image, Line, Node, Path } from '../../../../scenery/js/imports.js';
import baseball_png from '../../../images/baseball_png.js';
import car1_png from '../../../images/car1_png.js';
import car2_png from '../../../images/car2_png.js';
import football_png from '../../../images/football_png.js';
import human1_png from '../../../images/human1_png.js';
import human2_png from '../../../images/human2_png.js';
import piano1_png from '../../../images/piano1_png.js';
import piano2_png from '../../../images/piano2_png.js';
import pumpkin1_png from '../../../images/pumpkin1_png.js';
import pumpkin2_png from '../../../images/pumpkin2_png.js';
import tankShell_png from '../../../images/tankShell_png.js';
import projectileMotion from '../../projectileMotion.js';
import type { ProjectileObjectViewCreator } from '../model/ProjectileObjectType.js';

export default class ProjectileObjectViewFactory {

  /**
   * Preset object view functions for benchmarks, some benchmarks have different landed objects
   * @param diameter - in meters in model coordinates
   * @param landed - whether we want the landed object view, as opposed to a flying projectile view
   */
  public static createCannonball: ProjectileObjectViewCreator = ( diameter, modelViewTransform ) => {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    return new Circle( transformedBallSize / 2, { fill: 'black' } );
  };

  public static createPumpkin: ProjectileObjectViewCreator = ( diameter, modelViewTransform, landed ) => {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( landed ) {
      return new Image( pumpkin2_png, { maxHeight: transformedBallSize * 0.75 } );
    }
    else {
      return new Image( pumpkin1_png, { maxHeight: transformedBallSize * 0.95 } );
    }
  };

  public static createBaseball: ProjectileObjectViewCreator = ( diameter, modelViewTransform ) => {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    return new Image( baseball_png, { maxWidth: transformedBallSize } );
  };

  public static createCar: ProjectileObjectViewCreator = ( diameter, modelViewTransform, landed ) => {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( landed ) {
      return new Image( car2_png, { maxHeight: transformedBallSize * 1.7 } );
    }
    else {
      return new Image( car1_png, { maxHeight: transformedBallSize * 0.75 } );
    }
  };

  public static createFootball: ProjectileObjectViewCreator = ( diameter, modelViewTransform ) => {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    return new Image( football_png, { maxHeight: transformedBallSize } );
  };

  public static createHuman: ProjectileObjectViewCreator = ( diameter, modelViewTransform, landed ) => {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( landed ) {
      return new Image( human2_png, { maxWidth: transformedBallSize * 1.35 } );
    }
    else {
      return new Image( human1_png, { maxHeight: transformedBallSize * 1.9 } );
    }
  };

  public static createPiano: ProjectileObjectViewCreator = ( diameter, modelViewTransform, landed ) => {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    if ( landed ) {
      return new Image( piano2_png, { maxWidth: transformedBallSize * 1.3 } );
    }
    else {
      return new Image( piano1_png, { maxWidth: transformedBallSize * 1.1 } );
    }
  };

  public static createGolfBall: ProjectileObjectViewCreator = ( diameter, modelViewTransform ) => {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    return new Circle( transformedBallSize / 2, { fill: 'white', stroke: 'gray' } );
  };

  public static createTankShell: ProjectileObjectViewCreator = ( diameter, modelViewTransform ) => {
    const transformedBallSize = modelViewTransform.modelToViewDeltaX( diameter );
    return new Image( tankShell_png, { maxHeight: transformedBallSize } );
  };

  public static createCustom( diameter: number, dragCoefficient: number ): Node {

    // drag coefficients estimated from three sources:
    // https://en.wikipedia.org/wiki/Drag_coefficient#Drag_coefficient_cd_examples
    // https://www.grc.nasa.gov/www/k-12/airplane/shaped.html
    // http://www.aerospaceweb.org/question/aerodynamics/q0231.shtml
    assert && assert( dragCoefficient >= 0.04 && dragCoefficient <= 1, `drag coefficient ${dragCoefficient} out of bounds` );
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

      // to maintain the same cross-sectional area
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
  }
}

projectileMotion.register( 'ProjectileObjectViewFactory', ProjectileObjectViewFactory );