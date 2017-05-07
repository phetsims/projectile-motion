// Copyright 2016, University of Colorado Boulder

/**
 * Fire button that adds a projectile.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

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
    // TODO: replace with real image
    // options.content = new Image( fireImage );
    options.content = ProjectileMotionConstants.RANDOM_ICON_FACTORY.createIcon();
    options.content.scale( options.iconWidth / options.content.width );

    RectangularPushButton.call( this, options );

  }

  projectileMotion.register( 'FireButton', FireButton );

  return inherit( RectangularPushButton, FireButton );
} );

