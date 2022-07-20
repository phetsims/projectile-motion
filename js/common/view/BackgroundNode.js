// Copyright 2016-2022, University of Colorado Boulder

/**
 * Scenery node that shows the background, including the sky, grass, and road.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Image, Line, LinearGradient, Node, Rectangle } from '../../../../scenery/js/imports.js';
import flatirons_png from '../../../images/flatirons_png.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';

// image

// constants
const CEMENT_WIDTH = 20;
const GRASS_ABOVE_ROAD_WIDTH = 4;
const YELLOW_LINE_WIDTH = 1.5;
const FLATIRONS_WIDTH = 450;
const FLATIRONS_LEFT = 8; // in meters

class BackgroundNode extends Node {
  /**
   * @param {Bounds2} layoutBounds - the ScreenView layoutBounds
   * @param {Object} [options]
   */
  constructor( layoutBounds, options ) {
    options = merge( {
      pickable: false
    }, options );

    super();

    // @private
    this.sky = new Rectangle( 0, 0, 0, 0 );
    this.grass = new Rectangle( 0, 0, 0, 0, { fill: 'rgb( 0, 173, 78 )' } );
    this.road = new Rectangle( 0, 0, 0, 0, { fill: 'rgb( 77, 77, 75 )' } );
    this.roadDashedLine = new Line( 0, 0, 0, 0, {
      stroke: 'rgb( 235, 234, 48 )',
      lineDash: [ 10, 10 ],
      lineWidth: YELLOW_LINE_WIDTH
    } );
    this.flatirons = new Image( flatirons_png, { maxWidth: FLATIRONS_WIDTH } );
    this.flatirons.visible = false;

    assert && assert( !options.children, 'this type sets its own children' );
    options.children = [ this.sky, this.flatirons, this.grass, this.road, this.roadDashedLine ];

    this.mutate( options );
  }


  /**
   * Layout nodes part of the background
   * @public
   *
   * @param {number} offsetX
   * @param {number} offsetY
   * @param {number} width
   * @param {number} height
   * @param {number} layoutScale
   */
  layout( offsetX, offsetY, width, height, layoutScale ) {
    const dashedLineY = ProjectileMotionConstants.VIEW_ORIGIN.y;

    this.sky.setRect( -offsetX, -offsetY, width / layoutScale, height / layoutScale );
    this.sky.fill = new LinearGradient( 0, 0, 0, 2 * height / 3 ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );

    this.road.setRect( -offsetX, dashedLineY - 0.5 * CEMENT_WIDTH, width / layoutScale, CEMENT_WIDTH );

    this.grass.setRect( -offsetX, this.road.top - GRASS_ABOVE_ROAD_WIDTH, width / layoutScale, height / layoutScale );

    this.roadDashedLine.setLine( -offsetX, dashedLineY, width / layoutScale, dashedLineY );

    this.flatirons.bottom = ProjectileMotionConstants.VIEW_ORIGIN.y;
  }

  /**
   * Makes flatirons image visible or invisible
   * @public
   *
   * @param {boolean} visibility
   */
  showOrHideFlatirons( visibility ) {
    this.flatirons.visible = visibility;
  }

  /**
   * Update position of the mountains if transform changes
   * @public
   *
   * @param {ModelViewTransform2} transform
   */
  updateFlatironsPosition( transform ) {
    this.flatirons.left = transform.modelToViewX( FLATIRONS_LEFT );
  }
}

projectileMotion.register( 'BackgroundNode', BackgroundNode );

export default BackgroundNode;