// Copyright 2016, University of Colorado Boulder

/**
 * an object that, once instantiated (and thus seeded), can be used to generate random icons for use in PhET simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Random = require( 'DOT/Random' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NUM_SHAPES = 2;
  var NUM_SEGMENTS_PER_SHAPE = 5;

  /**
   * {number} [seed] - optional seed for the random number generator
   * @constructor
   */
  function RandomIconFactory( seed ) {
    this.random = new Random( { seed: seed } );
  }

  projectileMotion.register( 'RandomIconFactory', RandomIconFactory );

  return inherit( Object, RandomIconFactory, {

    /**
     * create a random icon with an optional caption
     * @param {string} [caption]
     */
    createIcon: function( caption ) {
      var self = this;
      var maxX = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
      var maxY = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;

      // add the background
      var background = new Rectangle( 0, 0, maxX, maxY, 0, 0, {
        fill: this.generateRandomLinearGradient( maxX, maxY )
      } );

      // set a clip area, since sometimes the random control points can cause the shape to go outside the icon bounds
      background.clipArea = new Shape.rect( 0, 0, maxX, maxY );

      // create the artwork
      _.times( NUM_SHAPES, function() {
        var shape = self.generateRandomShape( NUM_SEGMENTS_PER_SHAPE, maxX, maxY );
        background.addChild( new Path( shape, {
          fill: self.generateRandomLinearGradient( maxX, maxY ),
          stroke: self.generateRandomColor()
        } ) );
      } );

      // add the caption, if specified
      if ( caption ) {
        var captionNode = new Text( caption, {
          fill: 'white',
          stroke: 'black',
          font: new PhetFont( 40 ) // size empirically determined for one character, scaled to fit below
        } );
        var wScale = ( ( background.width * 0.9 ) / captionNode.width );
        var hScale = ( ( background.height * 0.9 ) / captionNode.height );
        captionNode.scale( Math.min( wScale, hScale ) );
        captionNode.centerX = background.width / 2;
        captionNode.centerY = background.height / 2;
        background.addChild( captionNode );
      }

      return background;
    },

    // @private, function to generate a random color
    generateRandomColor: function() {
      var r = Math.floor( this.random.nextDouble() * 256 );
      var g = Math.floor( this.random.nextDouble() * 256 );
      var b = Math.floor( this.random.nextDouble() * 256 );
      return new Color( r, g, b );
    },

    // utility function to generate a random linear gradient
    generateRandomLinearGradient: function( maxX, maxY ) {
      var vertical = Math.random() > 0.5;
      var gradient;
      if ( vertical ) {
        gradient = new LinearGradient( this.random.nextDouble() * maxX, 0, this.random.nextDouble() * maxX, maxY );
      }
      else {
        gradient = new LinearGradient( 0, this.random.nextDouble() * maxY, maxX, this.random.nextDouble() * maxY );
      }
      gradient.addColorStop( 0, this.generateRandomColor() );
      gradient.addColorStop( 1, this.generateRandomColor() );
      return gradient;
    },

    // utility function to generate a random point
    generateRandomPoint: function( maxX, maxY ) {
      return new Vector2( this.random.nextDouble() * maxX, this.random.nextDouble() * maxY );
    },

    // utility function to generate a random shape segment
    addRandomSegment: function( shape, maxX, maxY ) {
      var decider = this.random.nextDouble();
      var endpoint = this.generateRandomPoint( maxX, maxY );
      var controlPoint1;
      var controlPoint2;
      if ( decider < 0.33 ) {
        // add a line segment
        shape.lineToPoint( endpoint );
      }
      else if ( decider < 0.66 ) {
        // add a quadratic curve
        controlPoint1 = this.generateRandomPoint( maxX, maxY );
        shape.quadraticCurveTo( controlPoint1.x, controlPoint1.y, endpoint.x, endpoint.y );
      }
      else {
        // add a cubic curve
        controlPoint1 = this.generateRandomPoint( maxX, maxY );
        controlPoint2 = this.generateRandomPoint( maxX, maxY );
        shape.cubicCurveTo( controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endpoint.x, endpoint.y );
      }
    },

    // utility function to generate random shape
    generateRandomShape: function( numSegments, maxX, maxY ) {
      var shape = new Shape();
      shape.moveToPoint( this.generateRandomPoint( maxX, maxY ) );
      for ( var i = 0; i < numSegments; i++ ) {
        this.addRandomSegment( shape, maxX, maxY );
      }
      shape.close();
      return shape;
    }


  } );
} );