// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ControlPanel = require( 'PROJECTILE_MOTION/common/view/ControlPanel' );
  var TrajectoryNode = require( 'PROJECTILE_MOTION/common/view/TrajectoryNode' );
  var CannonNode = require( 'PROJECTILE_MOTION/common/view/CannonNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  // var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var Node = require( 'SCENERY/nodes/Node' );
  // var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function ProjectileMotionScreenView( model ) {

    var thisScreenView = this;

    ScreenView.call( thisScreenView );

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 200, 500 ), // empirically determined based off original sim
      25 // scale for meters, empirically determined based off original sim
    );

    // trajectories layer, so all trajectories are in front of control panel but behind measuring tape
    thisScreenView.trajectoriesLayer = new Node();

    function handleTrajectoryAdded( addedTrajectory ) {
      // Create and add the view representation for this trajectory
      var trajectoryNode = new TrajectoryNode( addedTrajectory, modelViewTransform );

      thisScreenView.trajectoriesLayer.addChild( trajectoryNode );

      // Add the removal listener for if and when this trajectory is removed from the model.
      model.trajectories.addItemRemovedListener( function removalListener( removedTrajectory ) {
        if ( removedTrajectory === addedTrajectory ) {
          thisScreenView.trajectoriesLayer.removeChild( trajectoryNode );
          model.trajectories.removeItemRemovedListener( removalListener );
        }
      } );
    }

    // Control panel
    thisScreenView.addChild( new ControlPanel( model, {
      x: thisScreenView.layoutBounds.maxX - 150,
      y: 15
    } ) );

    // all trajectories are in front of control panel and behind measuring tape
    thisScreenView.addChild( thisScreenView.trajectoriesLayer );

    // lets view listen to whether a trajectory has been added in the model
    model.trajectories.forEach( handleTrajectoryAdded );
    model.trajectories.addItemAddedListener( handleTrajectoryAdded );

    // add cannon
    thisScreenView.cannonNode = new CannonNode( model, modelViewTransform );
    thisScreenView.addChild( thisScreenView.cannonNode );

    // add common code tape measure
    thisScreenView.measuringTapeNode = new MeasuringTape(
      model.unitsProperty,
      model.measuringTapeProperty, {
        x: model.measuringTapeX,
        y: model.measuringTapeY,
        textColor: 'black',
        modelViewTransform: modelViewTransform
      } );

    thisScreenView.addChild( thisScreenView.measuringTapeNode );

    model.resetListenerProperty.link( function() {
      thisScreenView.measuringTapeNode.reset();
    } );

    // help with visual tests
    // var helperRectangle = new Rectangle( 0, -1, 20, 1, { fill: 'rgba(0,0,255,0.25)' } );
    // thisScreenView.addChild( helperRectangle );
    // helperRectangle.setRectBounds( modelViewTransform.modelToViewBounds( helperRectangle.getRectBounds() ) );
  }

  projectileMotion.register( 'ProjectileMotionScreenView', ProjectileMotionScreenView );

  return inherit( ScreenView, ProjectileMotionScreenView );
} );

