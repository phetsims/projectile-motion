// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery node that shows the background, including the sky, grass, and road.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var cementWidth = 20;
  var grassWidth = 5;
  var lineWidth = 2;

  /**
   * @param {Bounds2} layoutBounds the ScreenView layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function BackgroundNode( layoutBounds, options ) {
    Node.call( this, {
      pickable: false
    } );

    this.sky = new Rectangle( 0, 0, 0, 0 );
    this.addChild( this.sky );

    // Wait for bounds to fill in the grass
    this.topGrass = new Rectangle( 0, 0, 0, 0, { fill: 'rgb( 0, 118, 66 )' } );
    this.addChild( this.topGrass );

    this.bottomGrass = new Rectangle( 0, 0, 0, 0, { fill: 'rgb( 0, 173, 78 )' } );
    this.addChild( this.bottomGrass );

    // Wait for bounds to fill in the grass
    this.road = new Rectangle( 0, 0, 0, 0 );
    this.addChild( this.road );

    this.roadDashedLine = new Line( 0, 0, 0, 0, { stroke: 'rgb( 235, 234, 48 )', lineWidth: lineWidth } );
    this.addChild( this.roadDashedLine );

    if ( options ) {
      this.mutate( options );
    }
  }

  projectileMotion.register( 'BackgroundNode', BackgroundNode );

  return inherit( Node, BackgroundNode, {

    // Exactly fit the geometry to the screen so no matter what aspect ratio it will always show something.
    // Perhaps it will improve performance too?
    layout: function( offsetX, offsetY, width, height, layoutScale ) {
      var dashedLineY = ProjectileMotionConstants.VIEW_ORIGIN.y;

      this.sky.setRect( -offsetX, -offsetY, width / layoutScale, height / layoutScale );
      this.sky.fill = new LinearGradient( 0, 0, 0, 2 * height / 3 ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );

      this.road.setRect( -offsetX, dashedLineY - 0.5 * cementWidth, width / layoutScale, cementWidth );
      this.road.fill = new LinearGradient( 0, 0, 0, dashedLineY ).addColorStop( 0, 'rgb( 163, 172, 162 )' ).addColorStop( 1, 'rgb( 77, 77, 75 )' );

      this.topGrass.setRect( -offsetX, this.road.top - grassWidth, width / layoutScale, height / layoutScale );

      this.bottomGrass.setRect( -offsetX, dashedLineY, width / layoutScale, height / layoutScale );

      this.roadDashedLine.setLine( -offsetX, dashedLineY, width / layoutScale, dashedLineY );
    }
  } );
} );

