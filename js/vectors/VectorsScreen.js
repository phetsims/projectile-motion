// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Vectors' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import projectileMotionStrings from '../projectileMotionStrings.js';
import projectileMotion from '../projectileMotion.js';
import VectorsModel from './model/VectorsModel.js';
import VectorsIconNode from './view/VectorsIconNode.js';
import VectorsScreenView from './view/VectorsScreenView.js';

const screenVectorsString = projectileMotionStrings.screen.vectors;

/**
 * @param {Tandem} tandem
 * @constructor
 */
function VectorsScreen( tandem ) {

  const options = {
    name: screenVectorsString,
    backgroundColorProperty: new Property( 'white' ),
    homeScreenIcon: new VectorsIconNode( 'screen' ),
    navigationBarIcon: new VectorsIconNode( 'nav' ),
    tandem: tandem
  };

  Screen.call( this,
    function() { return new VectorsModel( tandem.createTandem( 'model' ) ); },
    function( model ) { return new VectorsScreenView( model, tandem.createTandem( 'view' ) ); },
    options
  );
}

projectileMotion.register( 'VectorsScreen', VectorsScreen );

inherit( Screen, VectorsScreen );
export default VectorsScreen;