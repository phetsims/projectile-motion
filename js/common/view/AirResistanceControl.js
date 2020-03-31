// Copyright 2020, University of Colorado Boulder

/**
 * Scenery node that shows the background, including the sky, grass, and road.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectileMotionStrings from '../../projectileMotionStrings.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';

const airResistanceString = projectileMotionStrings.airResistance;
const dragCoefficientString = projectileMotionStrings.dragCoefficient;

// constants
const AIR_RESISTANCE_ICON = ProjectileMotionConstants.AIR_RESISTANCE_ICON;

class AirResistanceControl extends VBox {

  /**
   * @param {Property.<boolean>} airResistanceOnProperty
   * @param {Property.<number>} projectileDragCoefficientProperty
   * @param {Object} [options]
   */
  constructor( airResistanceOnProperty, projectileDragCoefficientProperty, options ) {
    options = merge( {
      labelOptions: {},
      minWidth: 100,
      xMargin: 5,
      align: 'left',

      tandem: Tandem.REQUIRED
    }, options );

    const dragCoefficientReadout = new Text( '', merge( {}, options.labelOptions, {
      maxWidth: options.minWidth - 2 * options.xMargin,
      tandem: options.tandem.createTandem( 'dragCoefficientReadout' ),
      phetioComponentOptions: { textProperty: { phetioReadOnly: true } } // because this display shouldn't be edited
    } ) );

    dragCoefficientReadout.setBoundsMethod( 'accurate' );

    // air resistance
    const airResistanceText = new Text( airResistanceString, merge( {}, options.labelOptions, {
      tandem: options.tandem.createTandem( 'text' )
    } ) );
    const airResistanceCheckboxContent = new HBox( {
      spacing: options.xMargin,
      children: [ airResistanceText, new Node( { children: [ AIR_RESISTANCE_ICON ] } ) ]
    } );

    const airResistanceCheckbox = new Checkbox( airResistanceCheckboxContent, airResistanceOnProperty, {
      maxWidth: options.minWidth - 3 * options.xMargin, // left, right, and spacing between text and icon
      boxWidth: 18,
      tandem: options.tandem.createTandem( 'checkbox' )
    } );

    // disabling and enabling drag and altitude controls depending on whether air resistance is on
    airResistanceOnProperty.link( airResistanceOn => {
      const opacity = airResistanceOn ? 1 : 0.5;
      dragCoefficientReadout.setOpacity( opacity );
    } );

    // Listen to changes in model drag coefficient and update the view text
    projectileDragCoefficientProperty.link( value => {
      dragCoefficientReadout.setText( dragCoefficientString + ': ' + Utils.toFixed( value, 2 ) );
    } );

    assert && assert( !options.children, 'AirResistanceControl sets its own children' );
    options.children = [ airResistanceCheckbox, dragCoefficientReadout ];

    super( options );
  }
}

projectileMotion.register( 'AirResistanceControl', AirResistanceControl );

export default AirResistanceControl;