// Copyright 2016-2017, University of Colorado Boulder

/**
 * Scenery node that shows the background, including the sky, grass, and road.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // image
  var flatironsImage = require( 'image!PROJECTILE_MOTION/flatirons.png' );

  // constants
  var CEMENT_WIDTH = 20;
  var GRASS_ABOVE_ROAD_WIDTH = 4;
  var YELLOW_LINE_WIDTH = 1.5;
  var FLATIRONS_WIDTH = 450;
  var FLATIRONS_LEFT = 8; // in meters

  /**
   * @param {Bounds2} layoutBounds - the ScreenView layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function BackgroundNode( layoutBounds, options ) {
    options = _.extend( {
      pickable: false
    }, options );

    // @private
    this.sky = new Rectangle( 0, 0, 0, 0 );
    this.grass = new Rectangle( 0, 0, 0, 0, { fill: 'rgb( 0, 173, 78 )' } );
    this.road = new Rectangle( 0, 0, 0, 0, { fill: 'rgb( 77, 77, 75 )' } );
    this.roadDashedLine = new Line( 0, 0, 0, 0, {
      stroke: 'rgb( 235, 234, 48 )',
      lineDash: [ 10, 10 ],
      lineWidth: YELLOW_LINE_WIDTH
    } );
    this.flatirons = new Image( flatironsImage, { maxWidth: FLATIRONS_WIDTH } );
    this.flatirons.visible = false;

    assert && assert( !options.children, 'this type sets its own children' );
    options.children = [ this.sky, this.flatirons, this.grass, this.road, this.roadDashedLine ];

    Node.call( this, options );
  }

  projectileMotion.register( 'BackgroundNode', BackgroundNode );

  return inherit( Node, BackgroundNode, {

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
    layout: function( offsetX, offsetY, width, height, layoutScale ) {
      var dashedLineY = ProjectileMotionConstants.VIEW_ORIGIN.y;

      this.sky.setRect( -offsetX, -offsetY, width / layoutScale, height / layoutScale );
      this.sky.fill = new LinearGradient( 0, 0, 0, 2 * height / 3 ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );

      this.road.setRect( -offsetX, dashedLineY - 0.5 * CEMENT_WIDTH, width / layoutScale, CEMENT_WIDTH );

      this.grass.setRect( -offsetX, this.road.top - GRASS_ABOVE_ROAD_WIDTH, width / layoutScale, height / layoutScale );

      this.roadDashedLine.setLine( -offsetX, dashedLineY, width / layoutScale, dashedLineY );

      this.flatirons.bottom = ProjectileMotionConstants.VIEW_ORIGIN.y;
    },

    /**
     * Makes flatirons image visible or invisible
     * @public
     *
     * @param {boolean} visibility
     */
    showOrHideFlatirons: function( visibility ) {
      this.flatirons.visible = visibility;
    },

    /**
     * Update position of the mountains if transform changes
     * @public
     *
     * @param {ModelViewTransform2} transform
     */
    updateFlatironsPosition: function( transform ) {
      this.flatirons.left = transform.modelToViewX( FLATIRONS_LEFT );
    }

  } );
} );

