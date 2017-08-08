// Copyright 2016-2017, University of Colorado Boulder

/**
 * Model for the 'Lab' screen.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  var ProjectileObjectType = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectType' );

  /**
   * @constructor
   */
  function LabModel() {

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
    this.savedValues = { custom: {
      mass: this.objectTypes[0].mass,
      diameter: this.objectTypes[0].diameter,
      dragCoefficient: this.objectTypes[0].dragCoefficient
    } };

    // populate the savedValues with default values for each benchmark
    for ( var i = 1; i < this.objectTypes.length; i++ ) {
      var objectType = this.objectTypes[i];
      this.savedValues[ objectType.benchmark ] = {
        mass: objectType.mass,
        diameter: objectType.diameter,
        dragCoefficient: objectType.dragCoefficient
      };
    }

    // @public {string} save the most recent benchmark (e.g. pumpkin, human, etc.) used
    this.lastType = this.objectTypes[ 1 ].benchmark;

    ProjectileMotionModel.call( this, this.objectTypes[ 1 ], false );

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
      this.savedValues.custom.mass = this.objectTypes[0].mass;
      this.savedValues.custom.diameter = this.objectTypes[0].diameter;
      this.savedValues.custom.dragCoefficient = this.objectTypes[0].dragCoefficient;
      for ( var i = 1; i < this.objectTypes.length; i++ ) {
        var objectType = this.objectTypes[i];
        this.savedValues[ objectType.benchmark ].mass = objectType.mass;
        this.savedValues[ objectType.benchmark ].diameter = objectType.diameter;
        this.savedValues[ objectType.benchmark ].dragCoefficient = objectType.dragCoefficient;
      }
      this.lastType = this.objectTypes[ 2 ].benchmark;
    },

    /**
     * Set mass, diameter, and drag coefficient when selected projectile object type changes from saved values
     * @private
     * @override
     *
     * @param {ProjectileObjectType} selectedProjectileObjectType - contains information such as mass, diameter, etc.
     */
    setProjectileParameters: function( selectedProjectileObjectType ) {

      // first, save values for last type
      if ( this.lastType ) {
        this.savedValues[this.lastType].mass = this.projectileMassProperty.get();
        this.savedValues[this.lastType].diameter = this.projectileDiameterProperty.get();
        this.savedValues[this.lastType].dragCoefficient = this.projectileDragCoefficientProperty.get();
      }
      else {
        this.savedValues.custom.mass = this.projectileMassProperty.get();
        this.savedValues.custom.diameter = this.projectileDiameterProperty.get();
        this.savedValues.custom.dragCoefficient = this.projectileDragCoefficientProperty.get();
      }

      // then, apply saved values for this type
      if ( selectedProjectileObjectType.benchmark ) {
        this.projectileMassProperty.set( this.savedValues[selectedProjectileObjectType.benchmark].mass );
        this.projectileDiameterProperty.set( this.savedValues[selectedProjectileObjectType.benchmark].diameter );
        this.projectileDragCoefficientProperty.set( this.savedValues[selectedProjectileObjectType.benchmark].dragCoefficient );
      }
      else {
        this.projectileMassProperty.set( this.savedValues.custom.mass );
        this.projectileDiameterProperty.set( this.savedValues.custom.diameter );
        this.projectileDragCoefficientProperty.set( this.savedValues.custom.dragCoefficient );
      }

      // finally, save this type so we know what the last type was when type changes
      this.lastType = selectedProjectileObjectType.benchmark;
    }

  } );
} );


