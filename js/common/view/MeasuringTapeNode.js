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
  var Property = require( 'AXON/Property' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );


  /**
   * @constructor
   *
   * @param {MeasuringTape} measuringTape
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<Bounds2>} availableModelBoundsProperty - dragBounds for the charged particle
   * @param {Tandem} tandem
   */
  function MeasuringTapeNode( measuringTape, modelViewTransform ) {

    this.measuringTape = measuringTape;

    MeasuringTape.call( this, new Property( { name: 'meters', multiplier: 1 } ), measuringTape.isActiveProperty, {
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

