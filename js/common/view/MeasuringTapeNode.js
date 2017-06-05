// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for a draggable measuring tape, subtype of SCENERY_PHET.MeasuringTape
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var Property = require( 'AXON/Property' );

  // strings
  var metersString = require( 'string!PROJECTILE_MOTION/meters');

  /**
   * @constructor
   *
   * @param {ProjectileMotionMeasuringTape} measuringTape
   * @param {ModelViewTransform2} modelViewTransform
   */
  function MeasuringTapeNode( measuringTape, modelViewTransform ) {

    this.measuringTape = measuringTape;

    MeasuringTape.call( this, new Property( { name: metersString, multiplier: 1 } ), measuringTape.isActiveProperty, {
      modelViewTransform: modelViewTransform,
      basePositionProperty: measuringTape.basePositionProperty,
      tipPositionProperty: measuringTape.tipPositionProperty,
      isTipDragBounded: true,
      textColor: 'black'
    } );
  }

  projectileMotion.register( 'MeasuringTapeNode', MeasuringTapeNode );

  return inherit( MeasuringTape, MeasuringTapeNode );
} );

