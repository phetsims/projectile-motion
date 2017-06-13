// Copyright 2016, University of Colorado Boulder

/**
 * A Scenery node that can be used to control the zoom factor.
 *
 * @author John Blanco
 * @author Sharfudeen Ashraf (for Ghent University)
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' ); // TODO: change thumb touch area x and ys, if needed, see https://github.com/phetsims/projectile-motion/issues/12
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {Property.<number>} zoomProperty - property that indicates how far zoomed in the simulation is, between
   * @param {number} minZoom - the furthest out the sim can be zoomed
   * @param {number} maxZoom - the furthest in the sim can be zoomed
   * @constructor
   */
  function ZoomControl( zoomProperty, minZoom, maxZoom ) {

    var zoomSliderOptions = {
      thumbSize: new Dimension2( 18, 22 ),
      trackSize: new Dimension2( 100, 1 )
    };
    var zoomSlider = new HSlider( zoomProperty, { min: minZoom, max: maxZoom }, zoomSliderOptions );
    zoomSlider.rotation = -Math.PI / 2;

    var sideLength = 24; // length of one side of the button, empirically determined
    var symbolLength = 0.5 * sideLength;
    var symbolLineWidth = 0.12 * sideLength;

    var plusSymbolShape = new Shape()
      .moveTo( symbolLength / 2, 0 )
      .lineTo( symbolLength / 2, symbolLength )
      .moveTo( 0, symbolLength / 2 )
      .lineTo( symbolLength, symbolLength / 2 );

    var minusSymbolShape = new Shape()
      .moveTo( -symbolLength / 2, 0 )
      .lineTo( symbolLength / 2, 0 );

    var symbolOptions = {
      lineWidth: symbolLineWidth,
      stroke: 'black',
      centerX: sideLength / 2,
      centerY: sideLength / 2
    };

    var plusButton = createZoomControlButton( new Path( plusSymbolShape, symbolOptions ), { xMargin: 6, yMargin: 6 }, function() {
      zoomProperty.set( Util.clamp( zoomProperty.get() + 0.1, minZoom, maxZoom ) );
    } );

    var minusButton = createZoomControlButton( new Path( minusSymbolShape, symbolOptions ), { xMargin: 6, yMargin: 10 }, function() {
      zoomProperty.set( Util.clamp( zoomProperty.get() - 0.1, minZoom, maxZoom ) );
    } );

    // Temporarily set the zoom to a value that puts the knob roughly half way up so that the initial layout of the
    // VBox will work.
    var originalZoomValue = zoomProperty.get();
    zoomProperty.set( 4 );

    // vertical panel
    VBox.call( this, {
      children: [ plusButton, zoomSlider, minusButton ],
      align: 'center',
      resize: false,
      spacing: 12
    } );

    // restore the zoom to its original value
    zoomProperty.set( originalZoomValue );
  }

  projectileMotion.register( 'ZoomControl', ZoomControl );

  // @private @returns {RectangularPushButton} from content and listener
  function createZoomControlButton( contentNode, marginOptions, listener ) {
    return new RectangularPushButton( {
      content: contentNode,
      cornerRadius: 2,
      xMargin: marginOptions.xMargin,
      yMargin: marginOptions.yMargin,
      baseColor: 'white',
      listener: listener
    } );
  }

  return inherit( VBox, ZoomControl );
} );

