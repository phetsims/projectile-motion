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
  var ControlPanel = require( 'PROJECTILE_MOTION/projectile-motion/view/ControlPanel' );
  var TrajectoryNode = require( 'PROJECTILE_MOTION/projectile-motion/view/TrajectoryNode' );
  var CannonNode = require( 'PROJECTILE_MOTION/projectile-motion/view/CannonNode' );
  // var TapeMeasureNode = require( 'PROJECTILE_MOTION/projectile-motion/view/TapeMeasureNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var MeasuringTape = require( 'SCENERY_PHET/MeasuringTape' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/projectile-motion/ProjectileMotionConstants' );

  // constants

  /**
   * @param {ProjectileMotionModel} projectileMotionModel
   * @constructor
   */
  function ProjectileMotionScreenView( projectileMotionModel ) {

    var thisScreenView = this;

    ScreenView.call( thisScreenView );

    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 200, 500 ), // empirically determined based off original sim
      25 // scale for meters, empirically determined based off original sim
    );

    // Reset All button
    thisScreenView.addChild( new ControlPanel( projectileMotionModel, {
      x: thisScreenView.layoutBounds.maxX - 150,
      y: 25
    } ) );

    // add trajectory
    thisScreenView.trajectoryNode = new TrajectoryNode( projectileMotionModel.trajectory, modelViewTransform );
    thisScreenView.addChild( thisScreenView.trajectoryNode );

    // add cannon
    thisScreenView.cannonNode = new CannonNode( projectileMotionModel, modelViewTransform );
    thisScreenView.addChild( thisScreenView.cannonNode );

    // add tool - tape measure
    // thisScreenView.tapeMeasureNode = new TapeMeasureNode( projectileMotionModel, modelViewTransform );
    // thisScreenView.addChild( thisScreenView.tapeMeasureNode );

    // add common code tape measure
    thisScreenView.measuringTapeNode = new MeasuringTape( 
      projectileMotionModel.unitsProperty, 
      projectileMotionModel.measuringTapeProperty, { 
        x: 150, // empirically determined
        y: 90, //empirically determined
        textColor: 'black',
        modelViewTransform: modelViewTransform
      } );
    thisScreenView.addChild( thisScreenView.measuringTapeNode );

    projectileMotionModel.resetListenerProperty.link( function() {
      thisScreenView.measuringTapeNode.reset();
    } );

    // help with visual debugging
    var helperRectangle = new Rectangle( 0, -1, 20, 1, { fill: 'rgba(0,0,255,0.25)' } );
    thisScreenView.addChild( helperRectangle );
    helperRectangle.setRectBounds( modelViewTransform.modelToViewBounds( helperRectangle.getRectBounds() ) );
  }

  projectileMotion.register( 'ProjectileMotionScreenView', ProjectileMotionScreenView );

  return inherit( ScreenView, ProjectileMotionScreenView );
} );

