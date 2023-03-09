// Copyright 2016-2023, University of Colorado Boulder

/**
 * Toolbox from which the user can drag (or otherwise enable) tools.
 * The toolbox includes a measuring tape and a dataProbe tool.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import { DragListener, HBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import projectileMotion from '../../projectileMotion.js';
import DataProbeNode from './DataProbeNode.js';
import ProjectileMotionMeasuringTape from '../model/ProjectileMotionMeasuringTape.js';
import DataProbe from '../model/DataProbe.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  xMargin?: number;
  yMargin?: number;
  fill?: string;
  minWidth?: number;
};

type ToolboxPanelOptions = SelfOptions & PanelOptions & PickRequired<PanelOptions, 'tandem'>;

class ToolboxPanel extends Panel {

  /**
   * @param measuringTape - model for the measuring tape
   * @param dataProbe - model for the dataProbe tool
   * @param measuringTapeNode - view for the measuring tape
   * @param dataProbeNode - view for the dataProbe tool
   */
  public constructor( measuringTape: ProjectileMotionMeasuringTape, dataProbe: DataProbe, measuringTapeNode: MeasuringTapeNode,
                      dataProbeNode: DataProbeNode, transformProperty: Property<ModelViewTransform2>, providedOptions?: ToolboxPanelOptions ) {

    // The first object is an empty placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others

    //TODO: Combine with ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS - see https://github.com/phetsims/projectile-motion/issues/306
    const options = optionize<ToolboxPanelOptions, SelfOptions, PanelOptions>()( {
      xMargin: 12,
      yMargin: 18,
      fill: 'white',
      minWidth: 200
    }, providedOptions );

    // Create the icon Node for the dataProbe tool
    const dataProbeIconNode = DataProbeNode.createIcon( options.tandem.createTandem( 'dataProbeIconNode' ) );
    dataProbeIconNode.cursor = 'pointer';
    dataProbeIconNode.scale( 0.4 );

    // Create the icon image for the measuringTape
    const measuringTapeIconNode = MeasuringTapeNode.createIcon( {
      tandem: options.tandem.createTandem( 'measuringTapeIconNode' )
    } );
    measuringTapeIconNode.cursor = 'pointer';
    measuringTapeIconNode.scale( 0.8 );

    // The content panel with the two icons
    const panelContent = new HBox( {
      spacing: 30,
      children: [ dataProbeIconNode, measuringTapeIconNode ],
      excludeInvisibleChildrenFromBounds: false
    } );

    // add the panelContent
    super( panelContent, options );

    // listens to the isUserControlled Property of the dataProbe tool
    // return the dataProbe to the toolboxPanel if not user Controlled and its position is located within the toolbox panel
    dataProbeNode.isUserControlledProperty.lazyLink( isUserControlled => {
      assert && assert( dataProbeNode.parent instanceof ScreenView );
      assert && assert( dataProbeNode.parent === this.parent );

      const dataProbeNodeBounds = dataProbeNode.getJustDataProbeBounds(); //globalToParentBounds( dataProbeNode.getGlobalBounds() );
      const toolboxBounds = dataProbeNode.globalToParentBounds( this.getGlobalBounds() );
      if ( !isUserControlled && this.visible && toolboxBounds.intersectsBounds( dataProbeNodeBounds.eroded( 5 ) ) ) {
        dataProbe.isActiveProperty.set( false );
      }
    } );

    // When pressed, forwards dragging to the actual dataProbe Node
    dataProbeIconNode.addInputListener( DragListener.createForwardingListener( event => {
      dataProbe.isActiveProperty.set( true );

      // offset when pulling out of the toolbox so that the pointer isn't on top of the tool. Convert to parent point
      // because the DataProbeNode's DragListener is applying its pointer offset in the parent coordinate frame (see https://github.com/phetsims/scenery/issues/1014)
      const parentPoint = this.globalToParentPoint( event.pointer.point ).plusXY( -180, 0 );
      dataProbe.positionProperty.value = transformProperty.value.viewToModelPosition( parentPoint );
      dataProbeNode.dragListener.press( event, dataProbeNode );
    }, { allowTouchSnag: true } ) );

    // dataProbe visibility has the opposite visibility of the dataProbeIcon
    dataProbe.isActiveProperty.link( active => {
      dataProbeIconNode.visible = !active;
    } );

    // listens to the isUserControlled Property of the measuring tape
    // return the measuring tape to the toolboxPanel if not user Controlled and its position is located within the toolbox panel
    measuringTapeNode.isBaseUserControlledProperty.lazyLink( isUserControlled => {
      assert && assert( measuringTapeNode.parent instanceof ScreenView );
      assert && assert( measuringTapeNode.parent === this.parent );

      const tapeBaseBounds = measuringTapeNode.localToParentBounds( measuringTapeNode.getLocalBaseBounds() );
      const toolboxBounds = measuringTapeNode.globalToParentBounds( this.getGlobalBounds() );
      if ( !isUserControlled && this.visible && toolboxBounds.intersectsBounds( tapeBaseBounds.eroded( 5 ) ) ) {
        measuringTape.isActiveProperty.set( false );
      }
    } );

    // determine the distance (in model coordinates) between the tip and the base position of the measuring tape
    const tipToBasePosition = measuringTape.tipPositionProperty.get().minus( measuringTape.basePositionProperty.get() );

    // Add the listener that will allow the user to click on this and forward the dragging to the actual measuring tape node
    measuringTapeIconNode.addInputListener( DragListener.createForwardingListener( event => {

      measuringTape.isActiveProperty.set( true );

      const tapeBasePosition = measuringTapeNode.globalToParentPoint( measuringTapeNode.localToGlobalPoint( measuringTapeNode.getLocalBaseCenter() ) );
      const initialViewPosition = measuringTapeNode.globalToParentPoint( event.pointer.point ).minus( tapeBasePosition );
      measuringTape.basePositionProperty.set( transformProperty.get().viewToModelPosition( initialViewPosition ) );
      measuringTape.tipPositionProperty.set( measuringTape.basePositionProperty.get().plus( tipToBasePosition ) );

      measuringTapeNode.startBaseDrag( event );

    }, { allowTouchSnag: true } ) );

    // measuringTape visibility has the opposite visibility of the measuringTape Icon
    measuringTape.isActiveProperty.link( active => {
      measuringTapeIconNode.visible = !active;
    } );

    // Links for the toolboxPanel and its tools last for the lifetime of the sim, so they don't need to be disposed
  }
}

projectileMotion.register( 'ToolboxPanel', ToolboxPanel );
export default ToolboxPanel;