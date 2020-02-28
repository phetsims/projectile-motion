// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Drag' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import projectileMotionStrings from '../projectile-motion-strings.js';
import projectileMotion from '../projectileMotion.js';
import DragModel from './model/DragModel.js';
import DragIconNode from './view/DragIconNode.js';
import DragScreenView from './view/DragScreenView.js';

const screenDragString = projectileMotionStrings.screen.drag;

/**
 * @param {Tandem} tandem
 * @constructor
 */
function DragScreen( tandem ) {

  const options = {
    name: screenDragString,
    backgroundColorProperty: new Property( 'white' ),
    homeScreenIcon: new DragIconNode(),
    tandem: tandem
  };

  Screen.call( this,
    function() { return new DragModel( tandem.createTandem( 'model' ) ); },
    function( model ) { return new DragScreenView( model, tandem.createTandem( 'view' ) ); },
    options
  );
}

projectileMotion.register( 'DragScreen', DragScreen );

inherit( Screen, DragScreen );
export default DragScreen;