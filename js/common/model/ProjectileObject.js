// Copyright 2013-2015, University of Colorado Boulder

/**
 * Projectile object model for the choice of different projectiles.
 * <p/>
 * The numeric values for specific solutions were arrived at by running lab experiments,
 * and are documented in doc/Beers-Law-Lab-design.pdf and doc/BeersLawLabData.xlsx.
 * <p/>
 * Note that this model does not use the Solute model from the Concentration screen, because
 * we have very different needs wrt color scheme, properties, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );

  // strings
  var cannonballString = 'Cannonball';
  var tankShellString = 'Tank Shell';
  var pumpkinString = 'Pumpkin';

  /**
   * @param {string} name
   * @param {number} mass - in kg
   * @param {number} diameter - in meters
   * @param {number} dragCoefficient
   * @param {Object} [options]
   * @constructor
   */
  function ProjectileObject( name, mass, diameter, dragCoefficient, type ) {

    this.name = name;
    this.mass = mass;
    this.diameter = diameter;
    this.dragCoefficient = dragCoefficient;
    this.type = type || null;

  }

  projectileMotion.register( 'ProjectileObject', ProjectileObject );

  inherit( Object, ProjectileObject );

  //-------------------------------------------------------------------------------------------
  // Specific projectile objects below ...
  //-------------------------------------------------------------------------------------------

  ProjectileObject.CANNONBALL = new ProjectileObject(
    cannonballString,
    ProjectileMotionConstants.CANNONBALL_MASS,
    ProjectileMotionConstants.CANNONBALL_DIAMETER,
    ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT,
    'cannonball'
  );

  ProjectileObject.TANK_SHELL = new ProjectileObject( tankShellString, 150, 0.15, 0.05, 'tankShell' );

  ProjectileObject.PUMPKIN = new ProjectileObject( pumpkinString, 5, 0.37, 0.6, 'pumpkin' );

  return ProjectileObject;
} );

