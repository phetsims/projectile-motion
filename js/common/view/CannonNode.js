// Copyright 2016-2017, University of Colorado Boulder

/**
 * Cannon view.
 * Angle can change when user drags the cannon tip. Height can change when user drags cannon base.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Range = require( 'DOT/Range' );
  var platform = require( 'PHET_CORE/platform' );

  // image
  var cannonBaseBottomImage = require( 'mipmap!PROJECTILE_MOTION/cannon_base_bottom.png' );
  var cannonBaseTopImage = require( 'mipmap!PROJECTILE_MOTION/cannon_base_top.png' );
  var cannonBarrelImage = require( 'mipmap!PROJECTILE_MOTION/cannon_barrel.png' );
  var cannonBarrelTopImage = require( 'image!PROJECTILE_MOTION/cannon_barrel_top.png' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var pattern0Value1UnitsString = require( 'string!PROJECTILE_MOTION/pattern0Value1Units' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var degreesSymbolString = require( 'string!PROJECTILE_MOTION/degreesSymbol' );

  // constants
  var CANNON_LENGTH = 4;
  var ELLIPSE_WIDTH = 400; // empirically determined in view coordinates
  var ELLIPSE_HEIGHT = 50; // empirically determinedin view coordinates
  var ANGLE_RANGE = ProjectileMotionConstants.CANNON_ANGLE_RANGE;
  var HEIGHT_RANGE = ProjectileMotionConstants.CANNON_HEIGHT_RANGE;
  var HEIGHT_LEADER_LINE_POSITION = -2.6;
  var CROSSHAIR_LENGTH = 120;
  var LABEL_OPTIONS = ProjectileMotionConstants.LABEL_TEXT_OPTIONS;
  var BRIGHT_GRAY_COLOR = new Color( 230, 230, 230, 1 );
  var DARK_GRAY_COLOR = new Color( 103, 103, 103, 1 );
  var TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.6 )';
  var ANGLE_RANGE_MINS = [ 25, -5, -20, -40 ]; // angle range minimums, corresponding to height through their index
  var CUEING_ARROW_OPTIONS = {
    fill: 'rgb( 100, 200, 255 )',
    stroke: 'black',
    lineWidth: 1,
    tailWidth: 8,
    headWidth: 14,
    headHeight: 6,
    cursor: 'pointer'
  };
  var MUZZLE_FLASH_SCALE = 2;
  var MUZZLE_FLASH_OPACITY_DELTA = 0.04;
  var MUZZLE_FLASH_DURATION_OF_FRAMES = 16;
  var MUZZLE_FLASH_START = 1 - MUZZLE_FLASH_DURATION_OF_FRAMES * MUZZLE_FLASH_OPACITY_DELTA;

  /**
   * @param {Property.<number>} heightProperty - height of the cannon
   * @param {Property.<number>} angleProperty - angle of the cannon, in degrees
   * @param {Emitter} muzzleFlashStepper - emits whenever model steps
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {ScreenView} screenView
   * @param {Object} [options]
   * @constructor
   */
  function CannonNode( heightProperty, angleProperty, muzzleFlashStepper, transformProperty, screenView, options ) {
    var self = this;

    options = _.extend( {
      renderer: platform.mobileSafari ? 'canvas' : null
    }, options );

    Node.call( this, options );

    // the cannon, muzzle flash, and pedestal are not visible under ground
    var clippedByGroundNode = new Node( {
      x: transformProperty.get().modelToViewX( 0 ),
      y: transformProperty.get().modelToViewY( 0 ),
      cursor: 'pointer'
    } );

    // shape used for ground circle and top of pedestal
    var ellipseShape = Shape.ellipse( 0, 0, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2 );

    // ground circle, which shows the "inside" of the circular hole that the cannon is sitting in
    var groundFill = new LinearGradient( -ELLIPSE_WIDTH / 2, 0, ELLIPSE_WIDTH / 2, 0 )
      .addColorStop( 0.0, 'gray' )
      .addColorStop( 0.3, 'white' )
      .addColorStop( 1, 'gray' );
    var groundCircle = new Path( ellipseShape, {
      x: clippedByGroundNode.x,
      y: transformProperty.get().modelToViewY( 0 ),
      fill: groundFill,
      stroke: BRIGHT_GRAY_COLOR
    } );

    // side of the cylinder
    var sideFill = new LinearGradient( -ELLIPSE_WIDTH / 2, 0, ELLIPSE_WIDTH / 2, 0 )
      .addColorStop( 0.0, DARK_GRAY_COLOR )
      .addColorStop( 0.3, BRIGHT_GRAY_COLOR )
      .addColorStop( 1, DARK_GRAY_COLOR );
    var cylinderSide = new Path( null, { fill: sideFill, stroke: BRIGHT_GRAY_COLOR } );
    clippedByGroundNode.addChild( cylinderSide );

    // top of the cylinder
    var cylinderTop = new Path( ellipseShape, { fill: DARK_GRAY_COLOR, stroke: BRIGHT_GRAY_COLOR } );
    clippedByGroundNode.addChild( cylinderTop );

    // cannon

    var cannonBarrel = new Node();
    clippedByGroundNode.addChild( cannonBarrel );

    // A copy of the top part of the cannon barrel to 1) grab and change angle and 2) layout the cannonBarrel
    var cannonBarrelTop = new Image( cannonBarrelTopImage, { centerY: 0, opacity: 0 } );
    var cannonBarrelBase = new Image( cannonBarrelImage, { centerY: 0, right: cannonBarrelTop.right } );

    cannonBarrel.addChild( cannonBarrelBase );
    cannonBarrel.addChild( cannonBarrelTop );

    var cannonBase = new Node();
    clippedByGroundNode.addChild( cannonBase );

    var cannonBaseBottom = new Image( cannonBaseBottomImage, { top: 0, centerX: 0 } );
    cannonBase.addChild( cannonBaseBottom );
    var cannonBaseTop = new Image( cannonBaseTopImage, { bottom: 0, centerX: 0 } );
    cannonBase.addChild( cannonBaseTop );

    // scale everything according to the length of the cannon barrel
    clippedByGroundNode.setScaleMagnitude( transformProperty.get().modelToViewDeltaX( CANNON_LENGTH ) / cannonBarrelTop.width );

    // add dashed line for indicating the height
    var heightLeaderLine = new Line(
      transformProperty.get().modelToViewX( HEIGHT_LEADER_LINE_POSITION ),
      transformProperty.get().modelToViewY( 0 ),
      transformProperty.get().modelToViewX( HEIGHT_LEADER_LINE_POSITION ),
      transformProperty.get().modelToViewY( heightProperty.get() ), {
        stroke: 'black',
        lineDash: [ 5, 5 ],
      }
    );
    
    // added arrows for indicating height
    var heightLeaderArrows = new ArrowNode(
      transformProperty.get().modelToViewX( HEIGHT_LEADER_LINE_POSITION ),
      transformProperty.get().modelToViewY( 0 ),
      transformProperty.get().modelToViewX( HEIGHT_LEADER_LINE_POSITION ),
      transformProperty.get().modelToViewY( heightProperty.get() ), {
        headHeight: 5,
        headWidth: 5,
        tailWidth: 0,
        lineWidth: 0,
        doubleHead: true
      }
    );


    // draw the line caps for the height leader line

    var heightLeaderLineTopCap = new Line( -6, 0, 6, 0, {
      stroke: 'black',
      lineWidth: 2
    } );

    var heightLeaderLineBottomCap = new Line( -6, 0, 6, 0, {
      stroke: 'black',
      lineWidth: 2
    } );
    heightLeaderLineBottomCap.x = heightLeaderArrows.tipX;
    heightLeaderLineBottomCap.y = transformProperty.get().modelToViewY( 0 );

    // height readout
    var heightLabelBackground = new Rectangle( 0, 0, 0, 0, { fill: TRANSPARENT_WHITE } );
    var heightLabelOptions = _.extend( {
      pickable: true,
      cursor: 'pointer',
      maxWidth: 40 // empirically determined
    }, LABEL_OPTIONS );
    var heightLabel = new Text( StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
      value: Util.toFixedNumber( heightProperty.get(), 2 ),
      units: mString
    } ), heightLabelOptions );
    heightLabel.setMouseArea( heightLabel.bounds.dilatedXY( 8, 10 ) );
    heightLabel.setTouchArea( heightLabel.bounds.dilatedXY( 10, 12 ) );
    heightLabel.centerX = heightLeaderArrows.tipX;

    // cueing arrow for dragging height
    var heightCueingTopArrow = new ArrowNode( 0, -12, 0, -27, CUEING_ARROW_OPTIONS );
    var heightCueingBottomArrow = new ArrowNode( 0, 17, 0, 32, CUEING_ARROW_OPTIONS );
    var heightCueingArrows = new Node( { children: [ heightCueingTopArrow, heightCueingBottomArrow ] } );
    heightCueingArrows.centerX = heightLeaderArrows.tipX;

    // @private for use in inherit methods
    this.isIntroScreen = ( heightProperty.initialValue !== 0 );
    this.heightCueingArrows = heightCueingArrows;

    // cueing arrow only visible on intro screen
    heightCueingArrows.visible = this.isIntroScreen;

    // angle indicator
    var angleIndicator = new Node();
    angleIndicator.x = clippedByGroundNode.x;

    // crosshair view
    var crosshairShape = new Shape()
      .moveTo( -CROSSHAIR_LENGTH / 4, 0 )
      .lineTo( CROSSHAIR_LENGTH, 0 )
      .moveTo( 0, -CROSSHAIR_LENGTH )
      .lineTo( 0, CROSSHAIR_LENGTH );

    var crosshair = new Path( crosshairShape, { stroke: 'gray' } );
    angleIndicator.addChild( crosshair );

    var darkerCrosshairShape = new Shape()
      .moveTo( -CROSSHAIR_LENGTH / 15, 0 )
      .lineTo( CROSSHAIR_LENGTH / 15, 0 )
      .moveTo( 0, -CROSSHAIR_LENGTH / 15 )
      .lineTo( 0, CROSSHAIR_LENGTH / 15 );

    var darkerCrosshair = new Path( darkerCrosshairShape, { stroke: 'black', lineWidth: 3 } );
    angleIndicator.addChild( darkerCrosshair );

    // view for the angle arc
    var angleArc = new Path( null, { stroke: 'gray' } );
    angleIndicator.addChild( angleArc );

    // angle readout
    var angleLabelBackground = new Rectangle( 0, 0, 0, 0, { fill: TRANSPARENT_WHITE } );
    angleIndicator.addChild( angleLabelBackground );
    var angleLabel = new Text( StringUtils.fillIn( pattern0Value1UnitsString, {
      value: Util.toFixedNumber( angleProperty.get(), 2 ),
      units: degreesSymbolString
    } ), LABEL_OPTIONS );
    angleLabel.bottom = -5;
    angleLabel.left = CROSSHAIR_LENGTH * 2 / 3 + 10;
    angleIndicator.addChild( angleLabel );

    // muzzle flash

    // the flames are the shape of tear drops
    var tearDropShapeStrength = 3;
    var flameShape = new Shape();
    var radius = 100; // in view coordinates
    flameShape.moveTo( -radius, 0 );
    var t;
    for ( t = Math.PI / 24; t < 2 * Math.PI; t += Math.PI / 24 ) {
      var x = Math.cos( t ) * radius;
      var y = Math.sin( t ) * Math.pow( Math.sin( 0.5 * t ), tearDropShapeStrength ) * radius;
      flameShape.lineTo( x, y );
    }
    flameShape.lineTo( -radius, 0 );

    // create paths based on shape
    var outerFlame = new Path( flameShape, { fill: 'rgb( 255, 255, 0 )', stroke: null } );
    var innerFlame = new Path( flameShape, { fill: 'rgb( 255, 200, 0 )', stroke: null } );
    innerFlame.setScaleMagnitude( 0.7 );
    outerFlame.left = 0;
    innerFlame.left = 0;
    var muzzleFlash = new Node( { opacity: 0, x: cannonBarrelTop.right, y: 0, children: [ outerFlame, innerFlame ] } );
    cannonBarrel.addChild( muzzleFlash );

    this.muzzleFlashStage = 1; // 0 means animation starting, 1 means animation ended.
    
    function stepMuzzleFlash() {
      if ( self.muzzleFlashStage < 1 ) {
        muzzleFlash.opacity = self.muzzleFlashStage;
        muzzleFlash.setScaleMagnitude( self.muzzleFlashStage * self.muzzleFlashStage * MUZZLE_FLASH_SCALE );
        self.muzzleFlashStage = self.muzzleFlashStage + MUZZLE_FLASH_OPACITY_DELTA;
      }
      else {
        muzzleFlash.opacity = 0;
      }
    }

    // Listen to the muzzleFlashStepper to step the muzzle flash animation
    muzzleFlashStepper.addListener( stepMuzzleFlash );

    // rendering order
    this.setChildren( [
      groundCircle,
      clippedByGroundNode,
      heightLeaderLine,
      heightLeaderArrows,
      heightLeaderLineTopCap,
      heightLeaderLineBottomCap,
      heightLabelBackground,
      heightLabel,
      heightCueingArrows,
      angleIndicator//,
    ] );

    // Observe changes in model angle and update the cannon view
    angleProperty.link( function( angle ) {
      cannonBarrel.setRotation( -angle * Math.PI / 180 );
      var arcShape = angle > 0
        ? Shape.arc( 0, 0, CROSSHAIR_LENGTH * 2 / 3, 0, -angle * Math.PI / 180, true )
        : Shape.arc( 0, 0, CROSSHAIR_LENGTH * 2 / 3, 0, -angle * Math.PI / 180 );
      angleArc.setShape( arcShape );
      angleLabel.text = StringUtils.fillIn( pattern0Value1UnitsString, {
        value: Util.toFixedNumber( angleProperty.get(), 2 ),
        units: degreesSymbolString
      } );
      angleLabelBackground.setRectWidth( angleLabel.width + 2 );
      angleLabelBackground.setRectHeight( angleLabel.height );
      angleLabelBackground.center = angleLabel.center;
    } );

    // starts at 1, but is updated by modelViewTransform.
    var scaleMagnitude = 1;

    // Function to transform everything to the right height
    var updateHeight = function( height ) {
      var viewHeightPoint = Vector2.createFromPool( 0, transformProperty.get().modelToViewY( height ) );
      var heightInClipCoordinates = clippedByGroundNode.globalToLocalPoint( screenView.localToGlobalPoint( viewHeightPoint ) ).y;
      viewHeightPoint.freeToPool();
      cannonBarrel.y = heightInClipCoordinates;
      cannonBase.y = heightInClipCoordinates;
      cylinderTop.y = cannonBase.bottom - ELLIPSE_HEIGHT / 4;

      var sideShape = new Shape();
      sideShape.moveTo( -ELLIPSE_WIDTH / 2, 0 )
        .lineTo( -ELLIPSE_WIDTH / 2, cylinderTop.y )
        .ellipticalArc( 0, cylinderTop.y, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2, 0, Math.PI, 0, true )
        .lineTo( ELLIPSE_WIDTH / 2, 0 )
        .ellipticalArc( 0, 0, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2, 0, 0, Math.PI, false )
        .close();
      cylinderSide.setShape( sideShape );

      var clipArea = new Shape();
      clipArea.moveTo( -ELLIPSE_WIDTH / 2, 0 )
        .lineTo( -ELLIPSE_WIDTH / 2, -ELLIPSE_WIDTH * 50 ) // high enough to include how high the cannon could be
        .lineTo( ELLIPSE_WIDTH * 2, -ELLIPSE_WIDTH * 50 ) // high enough to include how high the cannon could be
        .lineTo( ELLIPSE_WIDTH * 2, 0 )
        .lineTo( ELLIPSE_WIDTH / 2, 0 )
        .ellipticalArc( 0, 0, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT / 2, 0, 0, Math.PI, false )
        .close();
      clippedByGroundNode.setClipArea( clipArea );

      heightLeaderArrows.setTailAndTip(
        heightLeaderArrows.tailX,
        heightLeaderArrows.tailY,
        heightLeaderArrows.tipX,
        transformProperty.get().modelToViewY( height )
      );
      heightLeaderLine.setLine( heightLeaderArrows.tailX, heightLeaderArrows.tailY, heightLeaderArrows.tipX, heightLeaderArrows.tipY );
      heightLeaderLineTopCap.x = heightLeaderArrows.tipX;
      heightLeaderLineTopCap.y = heightLeaderArrows.tipY;
      heightLabel.text = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
        value: Util.toFixedNumber( height, 2 ),
        units: mString
      } );
      heightLabel.centerX = heightLeaderArrows.tipX;
      heightLabel.y = heightLeaderArrows.tipY - 5;
      heightLabelBackground.setRectWidth( heightLabel.width + 2 );
      heightLabelBackground.setRectHeight( heightLabel.height );
      heightLabelBackground.center = heightLabel.center;
      heightCueingArrows.y = heightLabel.centerY;

      angleIndicator.y = transformProperty.get().modelToViewY( height );
    };

    // Observe changes in model height and update the cannon view
    heightProperty.link( function( height ) {
      updateHeight( height );
      if ( height < 4 && angleProperty.get() < ANGLE_RANGE_MINS[ height ] ) {
        angleProperty.set( ANGLE_RANGE_MINS[ height ] );
      }
    } );

    // Observe changes in modelviewtransform and update the view
    transformProperty.link( function( transform ) {
      scaleMagnitude = transformProperty.get().modelToViewDeltaX( CANNON_LENGTH ) / cannonBarrelTop.width;
      clippedByGroundNode.setScaleMagnitude( scaleMagnitude );
      groundCircle.setScaleMagnitude( scaleMagnitude );
      updateHeight( heightProperty.get() );
    } );

    // Links in CannonNode last for the lifetime of the sim, so they don't need to be disposed

    // @private variables used for drag handlers
    var startPoint;
    var startAngle;
    var mousePoint;
    var startHeight;

    // drag the tip of the cannon to change angle
    cannonBarrelTop.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        startPoint = screenView.globalToLocalPoint( event.pointer.point );
        startAngle = angleProperty.get(); // degrees
      },

      drag: function( event ) {
        mousePoint = screenView.globalToLocalPoint( event.pointer.point );

        // find vector angles between mouse drag start and current points, to the base of the cannon
        var startPointAngle = Vector2.createFromPool(
          startPoint.x - clippedByGroundNode.x,
          startPoint.y - transformProperty.get().modelToViewY( heightProperty.get() )
        ).angle();
        var mousePointAngle = Vector2.createFromPool(
          mousePoint.x - clippedByGroundNode.x,
          mousePoint.y - transformProperty.get().modelToViewY( heightProperty.get() )
        ).angle();
        var angleChange = startPointAngle - mousePointAngle; // radians
        var angleChangeInDegrees = angleChange * 180 / Math.PI; // degrees

        var unboundedNewAngle = startAngle + angleChangeInDegrees;

        var angleRange = heightProperty.get() < 4 ? new Range( ANGLE_RANGE_MINS[ heightProperty.get() ], 90 ) : ANGLE_RANGE;

        // mouse dragged angle is within angle range
        if ( angleRange.contains( unboundedNewAngle ) ) {
          var delta = options.preciseCannonDelta ? 1 : 5;
          angleProperty.set( Util.roundSymmetric( unboundedNewAngle / delta ) * delta );
        }
        // the current, unchanged, angle is closer to max than min
        else if ( angleRange.max + angleRange.min < 2 * angleProperty.get() ) {
          angleProperty.set( angleRange.max );
        }
        // the current, unchanged, angle is closer or same distance to min than max
        else {
          angleProperty.set( angleRange.min );
        }

      },

      allowTouchSnag: true

    } ) );

    // drag handler for controlling the height
    var heightDragHandler = new SimpleDragHandler( {
      start: function( event ) {
        startPoint = screenView.globalToLocalPoint( event.pointer.point );
        startHeight = transformProperty.get().modelToViewY( heightProperty.get() ); // view units
      },

      drag: function( event ) {
        mousePoint = screenView.globalToLocalPoint( event.pointer.point );
        var heightChange = mousePoint.y - startPoint.y;

        var unboundedNewHeight = transformProperty.get().viewToModelY( startHeight + heightChange );

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
      },

      end: function( event ) {
        heightCueingArrows.visible = false;
      },

      allowTouchSnag: true

    } );

    // multiple parts of the cannon can be dragged to change height
    cannonBase.addInputListener( heightDragHandler );
    cylinderSide.addInputListener( heightDragHandler );
    cylinderTop.addInputListener( heightDragHandler );
    cannonBarrelBase.addInputListener( heightDragHandler );
    heightLabel.addInputListener( heightDragHandler );
    heightCueingArrows.addInputListener( heightDragHandler );
  }

  projectileMotion.register( 'CannonNode', CannonNode );

  return inherit( Node, CannonNode, {

    /**
     * Reset this cannon
     * @public
     * @override
     */
    reset: function() {
      this.muzzleFlashStage = 1;
      this.heightCueingArrows.visible = this.isIntroScreen;
    },

    /**
     * Make the muzzle flash
     * @public
     */
    flashMuzzle: function() {
      this.muzzleFlashStage = MUZZLE_FLASH_START;
    }
  } );
} );

