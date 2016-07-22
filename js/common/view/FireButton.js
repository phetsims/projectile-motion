// Copyright 2016, University of Colorado Boulder

/**
 * Cannon view. Angle can change when user drags the cannon
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // images
  var fireImage = require( 'image!PROJECTILE_MOTION/PlumPuddingAtom-screen-icon.png' );

  
  /**
   * @constructor
   */
  function FireButton( options ) {
    options = options || {};

    options = _.extend( {
      baseColor: 'rgb( 255, 0, 0 )', // red
      // minWidth: 50,
      // minHeight: 45,
      iconWidth: 20 // width of icon, used for scaling, the aspect ratio will determine height
    }, options );

    // fire button icon
    options.content = new Image( fireImage );
    options.content.scale( options.iconWidth / options.content.width );

    RectangularPushButton.call( this, options );

  }

  projectileMotion.register( 'FireButton', FireButton );

  return inherit( RectangularPushButton, FireButton );
} );

