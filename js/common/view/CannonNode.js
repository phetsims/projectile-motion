// Copyright 2002-2016, University of Colorado Boulder

/**
 * Cannon view.
 * Angle can change when user drags the cannon tip. Height can change when user drags cannon base.
 *
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );

  // constants
  var CANNON_LENGTH = ProjectileMotionConstants.CANNON_LENGTH;
  var CANNON_WIDTH = ProjectileMotionConstants.CANNON_WIDTH;
  var ANGLE_RANGE = ProjectileMotionConstants.CANNON_ANGLE_RANGE;
  var HEIGHT_RANGE = ProjectileMotionConstants.CANNON_HEIGHT_RANGE;
  var HEIGHT_LEADER_LINE_POSITION = -2;
  var LABEL_OPTIONS = ProjectileMotionConstants.LABEL_TEXT_OPTIONS;

  /**
   * @param {Property.<number>} heightProperty - height of the cannon
   * @param {Property.<number>} angleProperty - angle of the cannon, in degrees
   * @param {ModelViewTransform2} modelViewTransform - meters to units, inverted y
   * @constructor
   */
  function CannonNode( heightProperty, angleProperty, modelViewTransform ) {
    Node.call( this );

    // auxiliary functions, closures for getting the second coordinates of the line
    // TODO: remove when you use rotate
    function getX2() {
      return modelViewTransform.modelToViewX( CANNON_LENGTH * Math.cos( angleProperty.get() * Math.PI / 180 ) );
    }

    function getY2() {
      return modelViewTransform.modelToViewY( CANNON_LENGTH * Math.sin( angleProperty.get() * Math.PI / 180 ) + heightProperty.get() );
    }

    // TODO: use image and rotation, fix pickable area. See FaucetNode
    // draw cannon
    var cannon = new Line(
      modelViewTransform.modelToViewX( 0 ),
      modelViewTransform.modelToViewY( heightProperty.get() ),
      getX2(),
      getY2(), {
        stroke: 'white',
        lineWidth: modelViewTransform.modelToViewDeltaX( CANNON_WIDTH )
      }
    );
    this.addChild( cannon );

    // add line for indicating the height
    var heightLeaderLine = new Line(
      modelViewTransform.modelToViewX( HEIGHT_LEADER_LINE_POSITION ),
      modelViewTransform.modelToViewY( 0 ),
      modelViewTransform.modelToViewX( HEIGHT_LEADER_LINE_POSITION ),
      modelViewTransform.modelToViewY( heightProperty.get() ), {
        stroke: 'black',
        lineDash: [ 5, 5 ],
        lineWidth: 1
      }
    );
    this.addChild( heightLeaderLine );

    // draw the line caps for the height leader line
    
    var topCapShape = new Shape();
    topCapShape.moveTo( 0, 0 );
    topCapShape.lineTo( 0, 5 );
    topCapShape.moveTo( -6, 0 );
    topCapShape.lineTo( 6, 0 );

    var heightLeaderLineTopCap = new Path( topCapShape, {
        stroke: 'black',
        lineWidth: 2
    } );
    this.addChild( heightLeaderLineTopCap );

    var bottomCapShape = new Shape();
    bottomCapShape.moveTo( 0, 0 );
    bottomCapShape.lineTo( 0, -5 );
    bottomCapShape.moveTo( -6, 0 );
    bottomCapShape.lineTo( 6, 0 );
    
    var heightLeaderLineBottomCap = new Path( bottomCapShape, {
        stroke: 'black',
        lineWidth: 2
    } );
    heightLeaderLineBottomCap.x = heightLeaderLine.x1;
    heightLeaderLineBottomCap.y = heightLeaderLine.y1;
    this.addChild( heightLeaderLineBottomCap );

    // height readout
    var heightLabel = new Text( StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( heightProperty.get(), 2 ), mString ), LABEL_OPTIONS );
    heightLabel.centerX = heightLeaderLine.x1;
    this.addChild( heightLabel );

    // add invisible node for dragging height
    var adjustableHeightArea = new Circle( modelViewTransform.modelToViewDeltaX( CANNON_WIDTH ) * 1.5, {
      x: cannon.x1,
      y: cannon.y1,
      pickable: true,
      cursor: 'pointer'
    } );
    this.addChild( adjustableHeightArea );

    // add invisible node for dragging angle
    var rotatableArea = new Circle( modelViewTransform.modelToViewDeltaX( CANNON_WIDTH ) * 1.5, {
      x: getX2(),
      y: getY2(),
      pickable: true,
      cursor: 'pointer'
    } );
    this.addChild( rotatableArea );

    // watch for if angle changes
    angleProperty.link( function() {
      cannon.x2 = getX2();
      cannon.y2 = getY2();
      adjustableHeightArea.x = cannon.x1;
      adjustableHeightArea.y = cannon.y1;
      rotatableArea.x = cannon.x2;
      rotatableArea.y = cannon.y2;
    } );

    // watch for if height changes
    heightProperty.link( function( height ) {
      cannon.y1 = modelViewTransform.modelToViewY( height );
      cannon.y2 = getY2();
      heightLeaderLine.y2 = cannon.y1;
      heightLeaderLineTopCap.x = heightLeaderLine.x2;
      heightLeaderLineTopCap.y = heightLeaderLine.y2;
      heightLabel.text = StringUtils.format( pattern0Value1UnitsWithSpaceString, Util.toFixedNumber( height, 2 ), mString );
      heightLabel.y = heightLeaderLine.y2 - 5;
      adjustableHeightArea.y = cannon.y1;
      rotatableArea.y = cannon.y2;
    } );

    // @private variables used for drag handlers
    var startPoint;
    var startAngle;
    var mousePoint;
    var startHeight;

    // drag the tip of the cannon to change angle
    rotatableArea.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = rotatableArea.globalToParentPoint( event.pointer.point );
        startAngle = angleProperty.get(); // degrees
      },

      drag: function( event ) {
        mousePoint = rotatableArea.globalToParentPoint( event.pointer.point );

        // find vector angles between mouse drag start and current points, to the base of the cannon
        var startPointAngle = new Vector2( startPoint.x - cannon.x1, startPoint.y - cannon.y1 ).angle();
        var mousePointAngle = new Vector2( mousePoint.x - cannon.x1, mousePoint.y - cannon.y1 ).angle();
        var angleChange = startPointAngle - mousePointAngle; // radians
        var angleChangeInDegrees = angleChange * 180 / Math.PI; // degrees

        var unboundedNewAngle = startAngle + angleChangeInDegrees;

        // mouse dragged angle is within angle range
        if ( ANGLE_RANGE.contains( unboundedNewAngle ) ) {
          angleProperty.set( Util.roundSymmetric( unboundedNewAngle ) );
        }
        // the current, unchanged, angle is closer to max than min
        else if ( ANGLE_RANGE.max + ANGLE_RANGE.min < 2 * angleProperty.get() ) {
          angleProperty.set( ANGLE_RANGE.max );
        }
        // the current, unchanged, angle is closer or same distance to min than max
        else {
          angleProperty.set( ANGLE_RANGE.min );
        }

      }

    } ) );

    // drag the base of the cannon to change height
    adjustableHeightArea.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = adjustableHeightArea.globalToParentPoint( event.pointer.point );
        startHeight = cannon.y1; // view units
      },

      drag: function( event ) {
        mousePoint = adjustableHeightArea.globalToParentPoint( event.pointer.point );
        var heightChange = mousePoint.y - startPoint.y;

        var unboundedNewHeight = modelViewTransform.viewToModelY( startHeight + heightChange );

        // mouse dragged height is within height range
        if ( HEIGHT_RANGE.contains( unboundedNewHeight ) ) {
          heightProperty.set( Util.roundSymmetric( unboundedNewHeight ) );
        }
        // the current, unchanged, height is closer to max than min
        else if ( HEIGHT_RANGE.max + HEIGHT_RANGE.min < 2 * heightProperty.get() ) {
          heightProperty.set( HEIGHT_RANGE.max );
        }
        // the current, unchanged, height is closer or same distance to min than max
        else {
          heightProperty.set( HEIGHT_RANGE.min );
        }
      }
    } ) );
  }

  projectileMotion.register( 'CannonNode', CannonNode );

  return inherit( Node, CannonNode );
} );

