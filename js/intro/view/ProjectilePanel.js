// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HSlider = require( 'SUN/HSlider' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );

  // strings
  var massString = 'Mass';
  var diameterString = 'Diameter';
  var dragCoefficientString = 'Drag Coefficient';
  var airResistanceString = 'Air Resistance';

  // constants
  var LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;

  /**
   * Control panel constructor
   * @param {ProjectileMotionModel} model
   * @constructor
   */
  function ProjectilePanel( projectileMotionLabModel, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        horizontalMin: 120,
        xMargin: 10,
        yMargin: 10,
        fill: ProjectileMotionConstants.PANEL_FILL_COLOR
      },
      options );

    // auxiliary function that creates the string for a text label
    // @param {String} label
    // @param {Number} value
    // @return {String}
    var createLabelText = function( label, value ) {
      return label + ': ' + value.toFixed( 2 );
    };

    // auxiliary function that creates vbox for a parameter label and slider
    // @param {String} label
    // @param {Property} property
    // @param {Object} range, range has keys min and max
    // @return {VBox}
    var createParameterControlBox = function( label, property, range ) {
      var parameterLabel = new Text( createLabelText( label, property.value ), LABEL_OPTIONS );
      property.link( function( v ) {
        parameterLabel.text = createLabelText( label, v );
      } );
      var setParameterSlider = new HSlider( property, range );
      return new VBox( { spacing: 2, children: [ parameterLabel, setParameterSlider ] } );
    };

    var massBox = createParameterControlBox(
      massString,
      projectileMotionLabModel.massProperty,
      ProjectileMotionConstants.MASS_RANGE
    );

    var diameterBox = createParameterControlBox(
      diameterString,
      projectileMotionLabModel.diameterProperty,
      ProjectileMotionConstants.DIAMETER_RANGE
    );

    var dragCoefficientBox = createParameterControlBox(
      dragCoefficientString,
      projectileMotionLabModel.dragCoefficientProperty,
      ProjectileMotionConstants.DRAG_COEFFICIENT_RANGE
    );

    var airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, projectileMotionLabModel.airResistanceOnProperty );

    // The contents of the control panel
    var content = new VBox( {
      align: 'center',
      spacing: 5,
      children: [
        massBox,
        diameterBox,
        airResistanceCheckBox,
        dragCoefficientBox
      ]
    } );

    var customizeVBox = new VBox( {
      // spacing: 10,
      children: [
        new HStrut( options.horizontalMin ),
        content
      ]
    } );

    Panel.call( this, customizeVBox, options );
  }

  projectileMotion.register( 'ProjectilePanel', ProjectilePanel );

  return inherit( Panel, ProjectilePanel );
} );

