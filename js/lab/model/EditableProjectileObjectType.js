// Copyright 2019, University of Colorado Boulder

/**
 * ProjectileObjectType subtype that contains editable (mutable) properties of the projectile type
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileObjectType = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectType' );
  const EditableProjectileObjectTypeIO = require( 'PROJECTILE_MOTION/lab/model/EditableProjectileObjectTypeIO' );
  const Tandem = require( 'TANDEM/Tandem' );

  class EditableProjectileObjectType extends ProjectileObjectType {

    /**
     * @param {string|null} name - name of the object, such as 'Golf ball', or null if it doesn't have a name
     * @param {number} mass - in kg
     * @param {number} diameter - in meters
     * @param {number} dragCoefficient
     * @param {string|null} benchmark - identifier of the object benchmark, such as 'tankShell', also considered a
     *                                      'name' for it like for Tandems. null for screens with only one object type
     * @param {boolean} rotates - whether the object rotates or just translates in air
     * @param {Object} [options]
     */
    constructor( name, mass, diameter, dragCoefficient, benchmark, rotates, options ) {

      // Options contains data about range and rounding for mass, diameter, drag coefficient.
      // defaults to those of custom objects for screens that don't have benchmarks
      options = merge( {
        tandem: Tandem.required,
        phetioType: EditableProjectileObjectTypeIO
      }, options );

      super( name, mass, diameter, dragCoefficient, benchmark, rotates, options );

      // @public - These overwrite the supertype values, but as a way to declare them as writeable fields.
      this.mass = mass;
      this.diameter = diameter;
      this.dragCoefficient = dragCoefficient;

      // @public (IO type) - these mutable values also store their initial values
      this.initialMass = mass;
      this.initialDiameter = diameter;
      this.initialDragCoefficient = dragCoefficient;
    }

    /**
     * Reset the editable pieces of the objecty type
     * @public
     */
    reset() {
      this.mass = this.initialMass;
      this.diameter = this.initialDiameter;
      this.dragCoefficient = this.initialDragCoefficient;
    }

    /**
     *
     * @param {ProjectileObjectType} projectileObjectType
     * @param {Tandem} tandem
     * @returns {EditableProjectileObjectType}
     */
    static fromProjectileObjectType( projectileObjectType, tandem ) {
      return new EditableProjectileObjectType(
        projectileObjectType.name,
        projectileObjectType.mass,
        projectileObjectType.diameter,
        projectileObjectType.dragCoefficient,
        projectileObjectType.benchmark,
        projectileObjectType.rotates,
        merge( projectileObjectType.options, {
          phetioType: EditableProjectileObjectTypeIO,
          tandem: tandem
        } ) );
    }
  }

  projectileMotion.register( 'EditableProjectileObjectType', EditableProjectileObjectType );

  return EditableProjectileObjectType;
} );

