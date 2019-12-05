// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the 'Lab' screen.
 *
 * @author Andrea Lin(PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const EditableProjectileObjectType = require( 'PROJECTILE_MOTION/lab/model/EditableProjectileObjectType' );
  const inherit = require( 'PHET_CORE/inherit' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionModel = require( 'PROJECTILE_MOTION/common/model/ProjectileMotionModel' );
  const ProjectileObjectType = require( 'PROJECTILE_MOTION/common/model/ProjectileObjectType' );
  const Property = require( 'AXON/Property' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function LabModel( tandem ) {

    const objectTypesTandem = tandem.createTandem( 'objectTypes' );

    // @public - wrap the object types in an editable case of sorts for clarity and ease. This is because
    // the lab screen in the only screen where values of multiple objecty types can be customized.
    this.objectTypes = [
      EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.CUSTOM, {
        tandem: objectTypesTandem.createTandem( 'editableCustom' )
      } ),
      EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.CANNONBALL, {
        tandem: objectTypesTandem.createTandem( 'editableCannonball' )
      } ),
      EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.TANK_SHELL, {
        tandem: objectTypesTandem.createTandem( 'editableTankShell' )
      } ),
      EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.GOLF_BALL, {
        tandem: objectTypesTandem.createTandem( 'editableGolfBall' )
      } ),
      EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.BASEBALL, {
        tandem: objectTypesTandem.createTandem( 'editableBaseball' )
      } ),
      EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.FOOTBALL, {
        tandem: objectTypesTandem.createTandem( 'editableFootball' )
      } ),
      EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.PUMPKIN, {
        tandem: objectTypesTandem.createTandem( 'editablePumpkin' )
      } ),
      EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.HUMAN, {
        tandem: objectTypesTandem.createTandem( 'editableHuman' )
      } ),
      EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.PIANO, {
        tandem: objectTypesTandem.createTandem( 'editablePianp' )
      } ),
      EditableProjectileObjectType.fromProjectileObjectType( ProjectileObjectType.CAR, {
        tandem: objectTypesTandem.createTandem( 'editableCar' )
      } )
    ];

    const initialObjectType = this.objectTypes[ 1 ];

    // @private {Property.<ProjectileObjectType>} save the most recent type
    this.lastTypeProperty = new Property( initialObjectType );

    ProjectileMotionModel.call( this, initialObjectType, false, this.objectTypes, tandem );

    // Once the state is set, set again values determined by the object type, as they may be out of sync from view
    // listeners (such as NumberControl.enabledRangeObserver) called during the state set, see https://github.com/phetsims/projectile-motion/issues/213
    if ( _.hasIn( window, 'phet.phetIo.phetioEngine.phetioStateEngine.stateSetEmitter' ) ) {
      phet.phetIo.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => this.updateModelValuesFromCurrentObjectType() );
    }
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
        this.objectTypes[ i ].reset();
      }
      this.lastTypeProperty.reset();
    },

    /**
     * @public
     * Update model values that are editable in the sim that are based on the projectile object type. Only
     * values from ProjectileObjectTypes need to be set here, since they change based on the selected projectile type.
     * The gravity and altitude (etc), though editable on the Lab screen, are not updated based on the current projectile
     * object type.
     */
    updateModelValuesFromCurrentObjectType: function() {

      const currentProjectileObjectType = this.selectedProjectileObjectTypeProperty.value;
      this.projectileMassProperty.set( currentProjectileObjectType.mass );
      this.projectileDiameterProperty.set( currentProjectileObjectType.diameter );
      this.projectileDragCoefficientProperty.set( currentProjectileObjectType.dragCoefficient );
    },

    /**
     * Set mass, diameter, and drag coefficient when selected projectile object type changes from saved values
     * @protected
     * @override
     *
     * @param {ProjectileObjectType} selectedProjectileObjectType - contains information such as mass, diameter, etc.
     */
    setProjectileParameters: function( selectedProjectileObjectType ) {

      // {ProjectileObjectType}
      const lastType = this.lastTypeProperty.value;

      // first, save values for last type
      lastType.mass = this.projectileMassProperty.get();
      lastType.diameter = this.projectileDiameterProperty.get();
      lastType.dragCoefficient = this.projectileDragCoefficientProperty.get();

      // then, apply saved values for this type
      this.updateModelValuesFromCurrentObjectType();

      // finally, save this type so we know what the last type was when type changes
      this.lastTypeProperty.value = selectedProjectileObjectType;
    }
  } );
} );


