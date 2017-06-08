// Copyright 2016, University of Colorado Boulder

/**
 * View for the target.
 * X position can change when user drags the cannon, y remains constant (on the ground)
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var metersString = require( 'string!PROJECTILE_MOTION/meters' );

  // constants
  var TARGET_DIAMETER = ProjectileMotionConstants.TARGET_LENGTH;
  var TARGET_WIDTH = ProjectileMotionConstants.TARGET_WIDTH;
  var LABEL_OPTIONS = _.defaults( { fill: 'white' }, ProjectileMotionConstants.LABEL_TEXT_OPTIONS );


  /**
   * @param {Score} score - model of the target and scoring algorithms
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function TargetNode( score, modelViewTransform ) {
    Node.call( this );

    var targetXProperty = score.targetXProperty;

    var viewRadius = modelViewTransform.modelToViewDeltaX( TARGET_DIAMETER ) / 2;

    var outerCircle = new Circle( viewRadius, { fill: 'red', stroke: 'black', lineWidth: 1 } );
    var middleCircle = new Circle( viewRadius * 2 / 3, { fill: 'white', stroke: 'black', lineWidth: 0.5 } );
    var innerCircle = new Circle( viewRadius / 3, { fill: 'red', stroke: 'black', lineWidth: 0.5 } );

    // draw target view
    var target = new Node( {
      pickable: true,
      cursor: 'pointer',
      children: [
        outerCircle,
        middleCircle,
        innerCircle
      ]
    } );

    target.scale( 1, TARGET_WIDTH / TARGET_DIAMETER );

    target.center = modelViewTransform.modelToViewPosition( new Vector2( score.targetXProperty.get(), 0 ) );

    this.addChild( target );

    // @private variables used in drag handler
    var startPoint;
    var startX;
    var mousePoint;

    // drag target to change horizontal position
    target.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = target.globalToParentPoint( event.pointer.point );
        startX = target.centerX; // view units
      },

      drag: function( event ) {
        mousePoint = target.globalToParentPoint( event.pointer.point );

        // change in x, view units
        var xChange = mousePoint.x - startPoint.x;

        targetXProperty.set( modelViewTransform.viewToModelX( startX + xChange ) );
      }

    } ) );

    // text readout for horizontal distance from fire, which is origin, which is base of cannon
    var distanceLabel = new Text( StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( targetXProperty.get(), 2 ), metersString ), LABEL_OPTIONS );
    this.addChild( distanceLabel );

    // score indicator, currently text
    var scoreIndicator = new Text( 'Score!', { font: new PhetFont( { size: 40, weight: 'bold' } ), fill: 'white' } );
    scoreIndicator.centerX = 450;
    scoreIndicator.centerY = 100;
    this.addChild( scoreIndicator );

    // listen to horizontal position changes
    score.targetXProperty.link( function( targetX ) {
      target.centerX = modelViewTransform.modelToViewX( targetX );
      distanceLabel.text = StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( targetXProperty.get(), 2 ), metersString );
      distanceLabel.centerX = target.centerX;
      distanceLabel.top = target.bottom + 2;
    } );

    // listen to model for whether score indicator should be shown
    score.scoreVisibleProperty.link( function( visible ) {
      scoreIndicator.visible = visible;
    } );

  }

  projectileMotion.register( 'TargetNode', TargetNode );

  return inherit( Node, TargetNode );
} );

