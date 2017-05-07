// Copyright 2013-2015, University of Colorado Boulder

/**
 * Projectile panel is a control panel that allows users to choose which projectile to fire.
 * Also includes a checkbox whether there is air resistance
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var ProjectileObjectViewFactory = require( 'PROJECTILE_MOTION/common/view/ProjectileObjectViewFactory' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var altitudeString = require( 'string!PROJECTILE_MOTION/altitude' );
  var massString = require( 'string!PROJECTILE_MOTION/mass' );
  var kgString = require( 'string!PROJECTILE_MOTION/kg' );
  var diameterString = require( 'string!PROJECTILE_MOTION/diameter' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );
  var dragCoefficientString = require( 'string!PROJECTILE_MOTION/dragCoefficient' );

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  var TEXT_BACKGROUND_OPTIONS = {
    fill: 'white',
    stroke: 'lightGray',
    strokeWidth: 1
  };
  var DRAG_OBJECT_DISPLAY_RADIUS = 12;

  /**
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function DragProjectilePanel( labModel, options ) {
    // TODO: rename labModel to projectileMotionViewModel

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = _.extend( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, {}, options );

    /** 
     * Auxiliary function that creates vbox for a parameter label and readouts
     * @param {string} label
     * @param {Property.<number>} property - the property that is set and linked to
     * @param {Object} range, range has keys min and max
     * @param {Node} a view display to be shown with the value
     * @returns {VBox}
     * @private
     */
    function createParameterControlBox( labelString, unitsString, property, range, viewNode ) {
      // label
      var parameterLabel = new Text( labelString, LABEL_OPTIONS );

      // value text
      var valueText = new Text( unitsString ? StringUtils.format( pattern0Value1UnitsWithSpaceString, property.get().toFixed( 2 ), unitsString ) : property.get().toFixed( 2 ), LABEL_OPTIONS );

      // background for text
      var backgroundNode = new Rectangle(
        0, // x
        0, // y
        options.textDisplayWidth * 1.5, // width, widened
        valueText.height + 2 * options.textDisplayYMargin, // height
        1, // cornerXRadius
        1, // cornerYRadius
        TEXT_BACKGROUND_OPTIONS
      );

      // text node updates if property value changes
      property.link( function( value ) {
        valueText.setText( value );
        valueText.center = backgroundNode.center;
      } );

      var slider = new HSlider( property, range, {
        constrainValue: function( value ) { return Math.round( value * 100 ) / 100; }, // two decimal place accuracy
        majorTickLength: 5,
        trackSize: new Dimension2( options.minWidth - 2 * options.xMargin - 20, 0.5 ),
        thumbSize: new Dimension2( 16, 28 ),
        thumbTouchAreaXDilation: 6,
        thumbTouchAreaYDilation: 4 // smaller to prevent overlap with above number spinner buttons
      } );
      slider.addMajorTick( range.min );
      slider.addMajorTick( range.max );

      var valueNode = new Node( { children: [ backgroundNode, valueText ] } );

      if ( viewNode ) {
        var viewAndValueNodes = new HBox( { spacing: options.xMargin, children: [ viewNode, valueNode ] } );
        var strut = new HStrut( 200 ); // empirically determined. Accounts for horizontal changes in viewNode
        var valueAndDisplay = new VBox( { align: 'right', children: [ strut, viewAndValueNodes ] } );
        var xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueAndDisplay.width;
        return new VBox( { spacing: options.yMargin, children: [
            new HBox( { spacing: xSpacing, children: [ parameterLabel, valueAndDisplay ] } ),
            slider
        ] } );
      }

      else {
        xSpacing = options.minWidth - 2 * options.xMargin - parameterLabel.width - valueNode.width;
        return new VBox( { spacing: options.yMargin, children: [
            new HBox( { spacing: xSpacing, children: [ parameterLabel, valueNode ] } ),
            slider
        ] } );
      }
    }

    var dragObjectDisplay = new Node();
    dragObjectDisplay.addChild( new HStrut( DRAG_OBJECT_DISPLAY_RADIUS * 2 ) );

    var dragCoefficientBox = createParameterControlBox(
      dragCoefficientString,
      null,
      labModel.projectileDragCoefficientProperty,
      ProjectileMotionConstants.PROJECTILE_DRAG_COEFFICIENT_RANGE,
      dragObjectDisplay
    );

    labModel.projectileDragCoefficientProperty.link( function( dragCoefficient ) {
      if ( dragObjectDisplay.children.length > 1 ) {
        dragObjectDisplay.removeChildAt( 1 );
      }
      var objectView = ProjectileObjectViewFactory.createCustom( DRAG_OBJECT_DISPLAY_RADIUS, dragCoefficient );
      objectView.center = dragObjectDisplay.center;
      dragObjectDisplay.addChild( objectView );
    });

    var diameterBox = createParameterControlBox(
      diameterString,
      mString,
      labModel.projectileDiameterProperty,
      ProjectileMotionConstants.PROJECTILE_DIAMETER_RANGE
    );

    var massBox = createParameterControlBox(
      massString,
      kgString,
      labModel.projectileMassProperty,
      ProjectileMotionConstants.PROJECTILE_MASS_RANGE
    );

    var altitudeBox = createParameterControlBox(
      altitudeString,
      mString,
      labModel.altitudeProperty,
      ProjectileMotionConstants.ALTITUDE_RANGE
    );

    // The contents of the control panel
    var content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace,
      children: [
        dragCoefficientBox,
        diameterBox,
        massBox,
        altitudeBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'DragProjectilePanel', DragProjectilePanel );

  return inherit( Panel, DragProjectilePanel );
} );

