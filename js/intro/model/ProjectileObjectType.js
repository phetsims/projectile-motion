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
  var cannonballString = require( 'string!PROJECTILE_MOTION/cannonball');
  var tankShellString = require( 'string!PROJECTILE_MOTION/tankShell');
  var pumpkinString = require( 'string!PROJECTILE_MOTION/pumpkin');

  /**
   * @param {string} name
   * @param {number} mass - in kg
   * @param {number} diameter - in meters
   * @param {number} dragCoefficient
   * @param {Object} [options]
   * @constructor
   */
  function ProjectileObjectType( name, mass, diameter, dragCoefficient, type ) {

    this.name = name;
    this.mass = mass;
    this.diameter = diameter;
    this.dragCoefficient = dragCoefficient;
    this.type = type || null;

  }

  projectileMotion.register( 'ProjectileObjectType', ProjectileObjectType );

  inherit( Object, ProjectileObjectType );

  //-------------------------------------------------------------------------------------------
  // Specific projectile objects below ...
  //-------------------------------------------------------------------------------------------

  ProjectileObjectType.CANNONBALL = new ProjectileObjectType(
    cannonballString,
    ProjectileMotionConstants.CANNONBALL_MASS,
    ProjectileMotionConstants.CANNONBALL_DIAMETER,
    ProjectileMotionConstants.CANNONBALL_DRAG_COEFFICIENT,
    'cannonball'
  );

  ProjectileObjectType.TANK_SHELL = new ProjectileObjectType( tankShellString, 150, 0.15, 0.05, 'tankShell' );

  ProjectileObjectType.PUMPKIN = new ProjectileObjectType( pumpkinString, 5, 0.37, 0.6, 'pumpkin' );

  return ProjectileObjectType;
} );

