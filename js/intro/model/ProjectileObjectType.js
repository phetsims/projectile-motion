// Copyright 2013-2015, University of Colorado Boulder

/**
 * Projectile object that contains properties of the projectile
 * Creates constants that are used by projectile choice dropdown on the Intro Screen.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );

  // strings
  var cannonballString = require( 'string!PROJECTILE_MOTION/cannonball' );
  var tankShellString = require( 'string!PROJECTILE_MOTION/tankShell' );
  var pumpkinString = require( 'string!PROJECTILE_MOTION/pumpkin' );
  var baseballString = require( 'string!PROJECTILE_MOTION/baseball' );
  var buickString = require( 'string!PROJECTILE_MOTION/buick' );

  /**
   * @param {string} name - name of the object, such as 'Tank Shell'
   * @param {number} mass - in kg
   * @param {number} diameter - in meters
   * @param {number} dragCoefficient
   * @param {string || null} type - identifier of the object type, such as 'tankShell'
   * @param {boolean} rotates - whether the object rotates or just translates in air
   * @constructor
   */
  function ProjectileObjectType( name, mass, diameter, dragCoefficient, type, rotates ) {

    this.name = name;
    this.mass = mass;
    this.diameter = diameter;
    this.dragCoefficient = dragCoefficient;
    this.type = type || null;
    this.rotates = rotates || false;

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
    'cannonball',
    false
  );

  ProjectileObjectType.TANK_SHELL = new ProjectileObjectType( tankShellString, 150, 0.15, 0.05, 'tankShell', true );

  ProjectileObjectType.PUMPKIN = new ProjectileObjectType( pumpkinString, 5, 0.37, 0.6, 'pumpkin', false );

  ProjectileObjectType.BASEBALL = new ProjectileObjectType( baseballString, 0.145, 0.074, 0.4, 'baseball', false );

  ProjectileObjectType.BUICK = new ProjectileObjectType( buickString, 1500, 2.5, 1.28, 'buick', true ); // Use 1.28 instead of 1.3 to remain within range

  return ProjectileObjectType;
} );

