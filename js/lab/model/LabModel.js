// Copyright 2016-2020, University of Colorado Boulder

/**
 * Model for the 'Lab' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileMotionModel from '../../common/model/ProjectileMotionModel.js';
import ProjectileObjectType from '../../common/model/ProjectileObjectType.js';
import projectileMotion from '../../projectileMotion.js';
import EditableProjectileObjectType from './EditableProjectileObjectType.js';

/**
 * @param {Tandem} tandem
 * @constructor
 */
function LabModel( tandem ) {

  const objectTypesTandem = tandem.createTandem( 'objectTypes' );

  // @public - wrap the object types in an editable case of sorts for clarity and ease. This is because
  // the lab screen in the only screen where values of multiple object types can be customized.
  this.objectTypes = [
    EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.CUSTOM,
      objectTypesTandem.createTandem( 'editableCustom' ) ),
    EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.CANNONBALL,
      objectTypesTandem.createTandem( 'editableCannonball' ) ),
    EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.TANK_SHELL,
      objectTypesTandem.createTandem( 'editableTankShell' ) ),
    EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.GOLF_BALL,
      objectTypesTandem.createTandem( 'editableGolfBall' ) ),
    EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.BASEBALL,
      objectTypesTandem.createTandem( 'editableBaseball' ) ),
    EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.FOOTBALL,
      objectTypesTandem.createTandem( 'editableFootball' ) ),
    EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.PUMPKIN,
      objectTypesTandem.createTandem( 'editablePumpkin' ) ),
    EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.HUMAN,
      objectTypesTandem.createTandem( 'editableHuman' ) ),
    EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.PIANO,
      objectTypesTandem.createTandem( 'editablePiano' ) ),
    EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.CAR,
      objectTypesTandem.createTandem( 'editableCar' ) )
  ];

  const initialObjectType = this.objectTypes[ 1 ];

  ProjectileMotionModel.call( this, initialObjectType, false, this.objectTypes, tandem );

  // Dynamically save the current values onto the current, editable object type..
  this.projectileMassProperty.lazyLink( currentValue => {
    this.selectedProjectileObjectTypeProperty.value.mass = currentValue;
  } );
  this.projectileDiameterProperty.lazyLink( currentValue => {
    this.selectedProjectileObjectTypeProperty.value.diameter = currentValue;
  } );
  this.projectileDragCoefficientProperty.lazyLink( currentValue => {
    this.selectedProjectileObjectTypeProperty.value.dragCoefficient = currentValue;
  } );

  // Once the state is set, set again values determined by the object type, as they may be out of sync from view
  // listeners (such as NumberControl.enabledRangeObserver) called during the state set, see https://github.com/phetsims/projectile-motion/issues/213
  Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( ( state, scopeTandem ) => {
    tandem.hasAncestor( scopeTandem ) && this.resetModelValuesToInitial();
  } );
}

projectileMotion.register( 'LabModel', LabModel );

inherit( ProjectileMotionModel, LabModel, {

  /**
   * Reset these Properties
   * @public
   * @override
   */
  reset: function() {
    ProjectileMotionModel.prototype.reset.call( this );

    // reset saved values
    for ( let i = 0; i < this.objectTypes.length; i++ ) {
      this.objectTypes[ i ].reset();
    }
  },

  /**
   * @public
   * Update model values that are editable in the sim that are based on the projectile object type. Only
   * values from ProjectileObjectTypes need to be set here, since they change based on the selected projectile type.
   * The gravity and altitude (etc), though editable on the Lab screen, are not updated based on the current projectile
   * object type. Reset back to the initial value, not the current value. Note that setting PhET-iO state will set that
   * value as the initial state, just like PropertyIO.js
   */
  resetModelValuesToInitial: function() {

    const currentProjectileObjectType = this.selectedProjectileObjectTypeProperty.value;
    this.projectileMassProperty.set( currentProjectileObjectType.initialMass );
    this.projectileDiameterProperty.set( currentProjectileObjectType.initialDiameter );
    this.projectileDragCoefficientProperty.set( currentProjectileObjectType.initialDragCoefficient );
  }
} );

export default LabModel;