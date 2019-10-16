// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the 'Lab' screen.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  const ProjectileObjectType = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectType' );
  const StringProperty = require( 'AXON/StringProperty' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function LabModel( tandem ) {

    // @public
    this.objectTypes = [
      ProjectileObjectType.CUSTOM,
      ProjectileObjectType.CANNONBALL,
      ProjectileObjectType.TANK_SHELL,
      ProjectileObjectType.GOLF_BALL,
      ProjectileObjectType.BASEBALL,
      ProjectileObjectType.FOOTBALL,
      ProjectileObjectType.PUMPKIN,
      ProjectileObjectType.HUMAN,
      ProjectileObjectType.PIANO,
      ProjectileObjectType.CAR
    ];

    // @public {Object} with objects by type
    this.savedValues = {};

    // populate the savedValues with default values for each benchmark
    for ( let i = 0; i < this.objectTypes.length; i++ ) {
      const objectType = this.objectTypes[ i ];
      assert && assert( objectType.benchmark, 'all objectTypes need  benchmark' );
      this.savedValues[ objectType.benchmark ] = {
        mass: objectType.mass,
        diameter: objectType.diameter,
        dragCoefficient: objectType.dragCoefficient
      };
    }

    const initialObjectType = this.objectTypes[ 1 ];

    // @private {Property.<string>} save the most recent benchmark (e.g. pumpkin, human, etc.) used
    this.lastTypeProperty = new StringProperty( initialObjectType.benchmark );

    ProjectileMotionModel.call( this, initialObjectType, false, tandem );
  }

  projectileMotion.register( 'LabModel', LabModel );

  return inherit( ProjectileMotionModel, LabModel, {

    /**
     * Reset these Properties
     * @public
     * @override
     */
    reset: function() {
      ProjectileMotionModel.prototype.reset.call( this );

      // reset saved values
      for ( let i = 0; i < this.objectTypes.length; i++ ) {
        const objectType = this.objectTypes[ i ];
        this.savedValues[ objectType.benchmark ].mass = objectType.mass;
        this.savedValues[ objectType.benchmark ].diameter = objectType.diameter;
        this.savedValues[ objectType.benchmark ].dragCoefficient = objectType.dragCoefficient;
      }
      this.lastTypeProperty.reset();
    },

    /**
     * Set mass, diameter, and drag coefficient when selected projectile object type changes from saved values
     * @private
     * @override
     *
     * @param {ProjectileObjectType} selectedProjectileObjectType - contains information such as mass, diameter, etc.
     */
    setProjectileParameters: function( selectedProjectileObjectType ) {

      // {string}
      const lastType = this.lastTypeProperty.value;

      // first, save values for last type
      this.savedValues[ lastType ].mass = this.projectileMassProperty.get();
      this.savedValues[ lastType ].diameter = this.projectileDiameterProperty.get();
      this.savedValues[ lastType ].dragCoefficient = this.projectileDragCoefficientProperty.get();

      // then, apply saved values for this type
      this.projectileMassProperty.set( this.savedValues[ selectedProjectileObjectType.benchmark ].mass );
      this.projectileDiameterProperty.set( this.savedValues[ selectedProjectileObjectType.benchmark ].diameter );
      this.projectileDragCoefficientProperty.set( this.savedValues[ selectedProjectileObjectType.benchmark ].dragCoefficient );

      // finally, save this type so we know what the last type was when type changes
      this.lastTypeProperty.value = selectedProjectileObjectType.benchmark;
    }
  } );
} );


