// Copyright 2017, University of Colorado Boulder

/**
 * icon node for the 'Vectors' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );

  // constants
  var SCREEN_ICON_SIZE = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE;
  var NAV_ICON_SIZE = Screen.MINIMUM_NAVBAR_ICON_SIZE;
  var VELOCITY_ARROW_FILL = 'rgb( 50, 255, 50 )';
  var ACCELERATION_ARROW_FILL = 'rgb( 255, 255, 50 )';
  var ARROW_TAIL_WIDTH = 6;
  var ARROW_HEAD_WIDTH = 12;
  var ARROW_HEAD_HEIGHT = 12;

  /**
   * @param {string} type - 'nav' or 'screen'
   * @constructor
   */
  function VectorsIconNode( type ) {

    Rectangle.call( this, 0, 0, 0, 0 );

    assert && assert( type === 'nav' || type === 'screen', 'invalid value for type: ' + type );
    
    // the nav bar icon has larger projectile object and vectors than those of the home screen icon
    if ( type === 'nav' ) {
      var width = NAV_ICON_SIZE.width;
      var height = NAV_ICON_SIZE.height;
      var projectileX = width * 0.4;
      var projectileY = height / 2;
      var projectile = new Circle( height / 4, { x: projectileX, y: projectileY, fill: 'black' } );
      this.addChild( projectile );
      var arrowScale = 1.5;
      var velocityArrow = new ArrowNode( projectileX, projectileY, width * 0.7, height * 0.1, {
        pickable: false,
        fill: VELOCITY_ARROW_FILL,
        tailWidth: ARROW_TAIL_WIDTH * arrowScale,
        headWidth: ARROW_HEAD_WIDTH * arrowScale,
        headHeight: ARROW_HEAD_HEIGHT * arrowScale
      } );
      this.addChild( velocityArrow );
      var accelerationArrow = new ArrowNode( projectileX, projectileY, projectileX, height * 0.9, {
        pickable: false,
        fill: ACCELERATION_ARROW_FILL,
        tailWidth: ARROW_TAIL_WIDTH * arrowScale,
        headWidth: ARROW_HEAD_WIDTH * arrowScale,
        headHeight: ARROW_HEAD_HEIGHT * arrowScale
      } );
      this.addChild( accelerationArrow );
    }
    else {
      width = SCREEN_ICON_SIZE.width;
      height = SCREEN_ICON_SIZE.height;
      projectileX = width * 0.4;
      projectileY = height / 2;
      projectile = new Circle( height / 6, { x: projectileX, y: projectileY, fill: 'black' } );
      this.addChild( projectile );
      arrowScale = 4;
      velocityArrow = new ArrowNode( projectileX, projectileY, width * 0.7, height * 0.2, {
        pickable: false,
        fill: VELOCITY_ARROW_FILL,
        tailWidth: ARROW_TAIL_WIDTH * arrowScale,
        headWidth: ARROW_HEAD_WIDTH * arrowScale,
        headHeight: ARROW_HEAD_HEIGHT * arrowScale
      } );
      this.addChild( velocityArrow );
      accelerationArrow = new ArrowNode( projectileX, projectileY, projectileX, height * 0.85, {
        pickable: false,
        fill: ACCELERATION_ARROW_FILL,
        tailWidth: ARROW_TAIL_WIDTH * arrowScale,
        headWidth: ARROW_HEAD_WIDTH * arrowScale,
        headHeight: ARROW_HEAD_HEIGHT * arrowScale
      } );
      this.addChild( accelerationArrow );
    }

    // create the background
    var backgroundFill = new LinearGradient( 0, 0, 0, height ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
    this.mutate( { fill: backgroundFill } );
    this.setRectWidth( width );
    this.setRectHeight( height );
  }

  projectileMotion.register( 'VectorsIconNode', VectorsIconNode );

  return inherit( Rectangle, VectorsIconNode );
} );