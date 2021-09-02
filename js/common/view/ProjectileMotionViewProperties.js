// Copyright 2017-2021, University of Colorado Boulder

/**
 * View Properties that are specific to visibility of vectors
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';

const MIN_ZOOM = ProjectileMotionConstants.MIN_ZOOM;
const MAX_ZOOM = ProjectileMotionConstants.MAX_ZOOM;
const DEFAULT_ZOOM = ProjectileMotionConstants.DEFAULT_ZOOM;

class ProjectileMotionViewProperties {
  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      tandem: Tandem.OPTIONAL,
      forceProperties: true,
      accelerationProperties: true
    }, options );

    this.forceProperties = options.forceProperties;
    this.accelerationProperties = options.accelerationProperties;

    // @public whether total velocity vector is showing
    this.totalVelocityVectorOnProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'totalVelocityVectorOnProperty' ),
      phetioDocumentation: 'Whether or not to display the total velocity vectors for flying projectiles'
    } );

    // @public whether component velocity vectors are showing
    this.componentsVelocityVectorsOnProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'componentsVelocityVectorsOnProperty' ),
      phetioDocumentation: 'Whether or not to display the component velocity vectors for flying projectiles'
    } );

    if ( options.accelerationProperties ) {

      // @public whether total acceleration vector is shown
      this.totalAccelerationVectorOnProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'totalAccelerationVectorOnProperty' ),
        phetioDocumentation: 'Whether or not to display the total acceleration vectors for flying projectiles'
      } );

      // @public whether component acceleration vectors are showing
      this.componentsAccelerationVectorsOnProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'componentsAccelerationVectorsOnProperty' ),
        phetioDocumentation: 'Whether or not to display the component acceleration vectors for flying projectiles'
      } );
    }

    if ( options.forceProperties ) {

      // @public whether total force vector is showing
      this.totalForceVectorOnProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'totalForceVectorOnProperty' ),
        phetioDocumentation: 'Whether or not to display the total force vectors in a free body diagram for flying projectiles'
      } );

      // @public whether component force vectors are showing
      this.componentsForceVectorsOnProperty = new BooleanProperty( false, {
        tandem: options.tandem.createTandem( 'componentsForceVectorsOnProperty' ),
        phetioDocumentation: 'Whether or not to display the component force vectors in a free body diagram for flying projectiles'
      } );

    }

    // zoom Property
    this.zoomProperty = new NumberProperty( DEFAULT_ZOOM, {
      tandem: options.tandem.createTandem( 'zoomProperty' ),
      range: new Range( MIN_ZOOM, MAX_ZOOM ),
      phetioDocumentation: 'Used to adjust to visual zoom for this screen. Each new zoom level increases the value by a factor of 2.',
      phetioStudioControl: false // see https://github.com/phetsims/projectile-motion/issues/219
    } );

  }

  /**
   * Reset these Properties
   * @public
   * @override
   */
  reset() {
    this.totalVelocityVectorOnProperty.reset();
    this.componentsVelocityVectorsOnProperty.reset();

    if ( this.accelerationProperties ) {
      this.totalAccelerationVectorOnProperty.reset();
      this.componentsAccelerationVectorsOnProperty.reset();
    }
    if ( this.forceProperties ) {
      this.totalForceVectorOnProperty.reset();
      this.componentsForceVectorsOnProperty.reset();
    }
    this.zoomProperty.reset();
  }
}

projectileMotion.register( 'ProjectileMotionViewProperties', ProjectileMotionViewProperties );

export default ProjectileMotionViewProperties;