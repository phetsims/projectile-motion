// Copyright 2022, University of Colorado Boulder

/**
 * ScreenView for the 'Stats' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import ProjectileMotionScreenView from '../../common/view/ProjectileMotionScreenView.js';
import ProjectileMotionViewProperties from '../../common/view/ProjectileMotionViewProperties.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionStrings from '../../ProjectileMotionStrings.js';
import StatsProjectileControlPanel from './StatsProjectileControlPanel.js';
import StatsControlPanel from './StatsControlPanel.js';
import FireHundredButton from './FireHundredButton.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import Panel from '../../../../sun/js/Panel.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ProjectileMotionConstants from '../../common/ProjectileMotionConstants.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';

// constants
const X_MARGIN = 10; //refactor into common view
const TEXT_FONT = ProjectileMotionConstants.PANEL_LABEL_OPTIONS.font;
const angleStandardDeviationString = ProjectileMotionStrings.angleStandardDeviation;
const speedStandardDeviationString = ProjectileMotionStrings.speedStandardDeviation;

class StatsScreenView extends ProjectileMotionScreenView {
  /**
   * @param {StatsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    options = merge( {
      addFlatirons: false,
      cannonNodeOptions: { preciseCannonDelta: true }
    }, options );

    // contains Properties about vector visibility, used in super class
    const visibilityProperties = new ProjectileMotionViewProperties( {
      tandem: tandem.createTandem( 'viewProperties' ),
      forceProperties: false
    } );

    // acts as listParent for the projectile dropdown box
    const comboBoxListParent = new Node();

    const projectilePanel = new StatsProjectileControlPanel(
      model.objectTypes,
      model.selectedProjectileObjectTypeProperty,
      comboBoxListParent,
      model.projectileMassProperty,
      model.projectileDiameterProperty,
      model.projectileDragCoefficientProperty,
      model.airResistanceOnProperty,
      { tandem: tandem.createTandem( 'projectileControlPanel' ) }
    );

    // fire 100 button
    const fireHundredButton = new FireHundredButton( {
      minWidth: 50,
      iconWidth: 30,
      minHeight: 40,
      listener: () => {
        model.startFiringMultiple( 20 );
      },
      bottom: 0,
      left: 0,
      tandem: tandem.createTandem( 'fireHundredButton' ),
      phetioDocumentation: 'button to launch 100 projectiles'
    } );

    super(
      model,
      projectilePanel,
      new StatsControlPanel( visibilityProperties, {
        tandem: tandem.createTandem( 'vectorsControlPanel' )
      } ),
      visibilityProperties,
      tandem,
      options,
      ProjectileMotionConstants.MAX_NUMBER_OF_TRAJECTORIES_STATS,
      true, //constantTrajectoryOpacity
      false //showPaths
    );

    // @private
    this.projectilePanel = projectilePanel;
    this.fireHundredButton = fireHundredButton;

    // insert dropdown right on top of the right-side panels
    this.insertChild(
      this.indexOfChild( this.topRightPanel ) + 1,
      comboBoxListParent
    );

    model.fireEnabledProperty.link( enable => {
      this.fireHundredButton.setEnabled( enable );
    } );

    //creating the launch angle standard deviation panel

    const degreesString = MathSymbols.DEGREES;
    const metersPerSecondString = ProjectileMotionStrings.metersPerSecond;

    const pattern0Value1UnitsString =
      ProjectileMotionStrings.pattern0Value1Units;
    const pattern0Value1UnitsWithSpaceString =
      ProjectileMotionStrings.pattern0Value1UnitsWithSpace;

    // results in '{{value}} m/s'
    const valuePatternSpeed = StringUtils.fillIn(
      pattern0Value1UnitsWithSpaceString,
      {
        units: metersPerSecondString
      }
    );

    // results in '{{value}} degrees'
    const valuePatternAngle = StringUtils.fillIn(
      pattern0Value1UnitsString,
      {
        units: degreesString
      }
    );

    //initial speed standard deviation slider
    const speedStandardDeviationPanelTandem = tandem.createTandem( 'speedStandardDeviationPanel' );

    const speedStandardDeviationNumberControl = new NumberControl(
      speedStandardDeviationString,
      model.initialSpeedStandardDeviationProperty,
      ProjectileMotionConstants.SPEED_STANDARD_DEVIATION_RANGE,
      {
        titleNodeOptions: {
          font: TEXT_FONT,
          maxWidth: 120 // empirically determined
        },
        numberDisplayOptions: {
          valuePattern: valuePatternSpeed,
          align: 'right',
          textOptions: {
            font: TEXT_FONT
          },
          maxWidth: 80 // empirically determined
        },
        sliderOptions: {
          constrainValue: value => Utils.roundToInterval( value, 0.1 ),
          trackSize: new Dimension2( 120, 0.5 ), // width is empirically determined
          thumbSize: new Dimension2( 13, 22 )
        },
        arrowButtonOptions: {
          scale: 0.56,
          touchAreaXDilation: 20,
          touchAreaYDilation: 20
        },
        tandem: speedStandardDeviationPanelTandem.createTandem( 'numberControl' ),
        phetioDocumentation:
          'the control for the standard deviation of the initial speed'
      }
    );

    // panel under the cannon, controls initial speed of projectiles
    const speedStandardDeviationPanel = new Panel(
      speedStandardDeviationNumberControl,
      merge(
        {
          left: this.layoutBounds.left + X_MARGIN,
          bottom: this.layoutBounds.bottom - 10,
          tandem: speedStandardDeviationPanelTandem
        },
        ProjectileMotionConstants.INITIAL_SPEED_PANEL_OPTIONS
      )
    );

    //initial angle standard deviation slider
    const angleStandardDeviationPanelTandem = tandem.createTandem( 'angleStandardDeviationPanel' );

    const angleStandardDeviationNumberControl = new NumberControl(
      angleStandardDeviationString,
      model.initialAngleStandardDeviationProperty,
      ProjectileMotionConstants.ANGLE_STANDARD_DEVIATION_RANGE,
      {
        titleNodeOptions: {
          font: TEXT_FONT,
          maxWidth: 120 // empirically determined
        },
        numberDisplayOptions: {
          valuePattern: valuePatternAngle,
          align: 'right',
          textOptions: {
            font: TEXT_FONT
          },
          maxWidth: 80 // empirically determined
        },
        sliderOptions: {
          constrainValue: value => Utils.roundSymmetric( value ),
          trackSize: new Dimension2( 120, 0.5 ), // width is empirically determined
          thumbSize: new Dimension2( 13, 22 )
        },
        arrowButtonOptions: {
          scale: 0.56,
          touchAreaXDilation: 20,
          touchAreaYDilation: 20
        },
        tandem: angleStandardDeviationPanelTandem.createTandem( 'numberControl' ),
        phetioDocumentation:
          'the control for the standard deviation of the launch angle'
      }
    );

    // panel under the cannon, controls initial speed of projectiles
    const angleStandardDeviationPanel = new Panel(
      angleStandardDeviationNumberControl,
      merge(
        {
          left: this.layoutBounds.left + X_MARGIN,
          bottom: this.layoutBounds.bottom - 10,
          tandem: angleStandardDeviationPanelTandem
        },
        ProjectileMotionConstants.INITIAL_SPEED_PANEL_OPTIONS
      )
    );

    this.addChild( this.fireHundredButton );
    this.addChild( speedStandardDeviationPanel );
    this.addChild( angleStandardDeviationPanel );

    angleStandardDeviationPanel.left = speedStandardDeviationPanel.right + X_MARGIN;

    this.eraserButton.left = angleStandardDeviationPanel.right + 30;
    this.fireButton.left = this.eraserButton.right + X_MARGIN;
    this.fireHundredButton.bottom = this.eraserButton.bottom;
    this.fireHundredButton.left = this.fireButton.right + X_MARGIN;
    this.timeControlNode.left = this.fireHundredButton.right + 40;

    this.removeChild( this.initialSpeedPanel );
  }

  /**
   * Layout
   * @param {Bounds2} viewBounds
   * @public (joist-internal)
   * @override
   */
  layout( viewBounds ) {
    this.projectilePanel.hideComboBoxList();
    super.layout( viewBounds );
  }
}

projectileMotion.register( 'StatsScreenView', StatsScreenView );
export default StatsScreenView;
