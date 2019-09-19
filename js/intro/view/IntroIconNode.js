// Copyright 2017, University of Colorado Boulder

/**
 * icon node for the 'Intro' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Path = require( 'SCENERY/nodes/Path' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Screen = require( 'JOIST/Screen' );
  const Shape = require( 'KITE/Shape' );

  // images
  const humanImage = require( 'image!PROJECTILE_MOTION/uncentered_human_1.png' );

  // constants
  const SCREEN_ICON_SIZE = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE;
  const NAV_ICON_SIZE = Screen.MINIMUM_NAVBAR_ICON_SIZE;
  const PATH_WIDTH = 2;
  const PATH_COLOR = 'blue';

  /**
   * @constructor
   * @param {string} type - 'nav' or 'screen'
   */
  function IntroIconNode( type ) {

    Rectangle.call( this, 0, 0, 0, 0 );

    assert && assert( type === 'nav' || type === 'screen', 'invalid value for type: ' + type );

    // the nav bar icon has a larger PhET girl than that of the home screen icon
    
    if ( type === 'nav' ) {
      var width = NAV_ICON_SIZE.width;
      var height = NAV_ICON_SIZE.height;
      var trajectoryShape = new Shape();
      trajectoryShape.moveTo( 0 + PATH_WIDTH, height * 0.8 )
        .quadraticCurveTo( width * 0.2, height * 0.6, width / 2, height / 2 );
      var trajectoryPath = new Path( trajectoryShape, { lineWidth: PATH_WIDTH * 2, stroke: PATH_COLOR } );
      this.addChild( trajectoryPath );
      var phetGirl = new Image( humanImage, { maxWidth: width * 0.7, centerX: width * 0.55, centerY: height * 0.45 } );
      phetGirl.setRotation( -Math.PI / 30 );
      this.addChild( phetGirl );
    }
    else {
      width = SCREEN_ICON_SIZE.width;
      height = SCREEN_ICON_SIZE.height;
      trajectoryShape = new Shape();
      trajectoryShape.moveTo( width * 0.08, height - PATH_WIDTH )
        .quadraticCurveTo( width * 0.2, height * 0.6, width / 2, height / 2 );
      trajectoryPath = new Path( trajectoryShape, { lineWidth: PATH_WIDTH * 4, stroke: PATH_COLOR } );
      this.addChild( trajectoryPath );
      phetGirl = new Image( humanImage, { centerX: width * 0.55, centerY: height * 0.4 } );
      phetGirl.scale( width * 0.6 / phetGirl.width );
      phetGirl.setRotation( -Math.PI / 30 );
      this.addChild( phetGirl );
    }

    // create the background
    const backgroundFill = new LinearGradient( 0, 0, 0, height ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
    this.mutate( { fill: backgroundFill } );
    this.setRectWidth( width );
    this.setRectHeight( height );
  }

  projectileMotion.register( 'IntroIconNode', IntroIconNode );

  return inherit( Rectangle, IntroIconNode );
} );