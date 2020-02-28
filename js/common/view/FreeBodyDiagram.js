// Copyright 2019-2020, University of Colorado Boulder

/**
 * The free body force diagram attached to the ProjectileNode when displaying force vectors. Takes two Properties to
 * listen to. One for the total force vectors, and one for the components. If neither are on, then this Node will be
 * invisible, as there is nothing to show.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import projectileMotion from '../../projectileMotion.js';
import ProjectileMotionConstants from '../ProjectileMotionConstants.js';

// constants
const FORCE_ARROW_OPTIONS = {
  fill: 'black',
  stroke: null,
  tailWidth: 2,
  headWidth: 6
};

const FORCE_SCALAR = 3;

const FREE_BODY_RADIUS = 3;
const FREE_BODY_OFFSET = new Vector2( -40, -40 ); // distance from free body to projectile
const FORCES_BOX_DILATION = 7;

const TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.35 )';
const LABEL_OPTIONS = ProjectileMotionConstants.LABEL_TEXT_OPTIONS;

const xDragForceText = new RichText( 'F<sub>dx</sub>', LABEL_OPTIONS );
const yDragForceText = new RichText( 'F<sub>dy</sub>', LABEL_OPTIONS );
const forceGravityText = new RichText( 'F<sub>g</sub>', LABEL_OPTIONS );
const totalDragForceText = new RichText( 'F<sub>d</sub>', LABEL_OPTIONS );


/**
 * @param {Object} [options]
 * @constructor
 */
class FreeBodyDiagram extends Node {

  /**
   * @param {Property.<Object>} viewPointProperty - see ProjectileNode.viewPointProperty for more info
   * @param {Property.<boolean>} totalForceProperty
   * @param {Property.<boolean>} componentsForceProperty
   * @param {Object} [options]
   */
  constructor( viewPointProperty, totalForceProperty, componentsForceProperty, options ) {

    super( options );

    // forces view
    const forcesBox = new Rectangle( 0, 0, 10, 50, {
      fill: TRANSPARENT_WHITE,
      lineWidth: 0
    } );
    this.addChild( forcesBox );

    const diagramContainer = new Node();
    this.addChild( diagramContainer );

    const freeBody = new Circle( FREE_BODY_RADIUS, { x: 0, y: 0, fill: 'black' } );

    // The component force vectors
    const freeBodyComponentVectorsNode = new Node();

    const xDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyComponentVectorsNode.addChild( xDragForceArrow );

    const xDragForceLabel = new Node( { children: [ xDragForceText ] } );
    freeBodyComponentVectorsNode.addChild( xDragForceLabel );

    const yDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyComponentVectorsNode.addChild( yDragForceArrow );

    const yDragForceLabel = new Node( { children: [ yDragForceText ] } );
    freeBodyComponentVectorsNode.addChild( yDragForceLabel );

    const forceGravityArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    const forceGravityLabel = new Node( { children: [ forceGravityText ] } );

    const freeBodyTotals = new Node();

    const totalDragForceArrow = new ArrowNode( 0, 0, 0, 0, FORCE_ARROW_OPTIONS );
    freeBodyTotals.addChild( totalDragForceArrow );

    const totalDragForceLabel = new Node( { children: [ totalDragForceText ] } );
    freeBodyTotals.addChild( totalDragForceLabel );

    // Update the free body diagram
    const multilink = Property.multilink( [
      componentsForceProperty,
      totalForceProperty,
      viewPointProperty
    ], ( componentsVisible, totalVisible, viewPoint ) => {
      const viewPosition = viewPoint.viewPosition;
      const dataPoint = viewPoint.dataPoint;

      // only visible is one of the Properties is on
      this.visible = componentsVisible || totalVisible;

      if ( componentsVisible || totalVisible ) {
        diagramContainer.children = [ freeBody ].concat( componentsVisible ? [ freeBodyComponentVectorsNode ] : [] )
          .concat( [ forceGravityArrow, forceGravityLabel ] )
          .concat( totalVisible ? [ freeBodyTotals ] : [] );

        freeBody.x = viewPosition.x + FREE_BODY_OFFSET.x;
        freeBody.y = viewPosition.y + FREE_BODY_OFFSET.y;

        if ( componentsVisible ) {
          xDragForceArrow.setTailAndTip( freeBody.x,
            freeBody.y,
            freeBody.x - FORCE_SCALAR * dataPoint.dragForce.x,
            freeBody.y
          );
          xDragForceLabel.right = xDragForceArrow.tipX - 5;
          xDragForceLabel.y = xDragForceArrow.tipY;

          yDragForceArrow.setTailAndTip( freeBody.x,
            freeBody.y,
            freeBody.x,
            freeBody.y + FORCE_SCALAR * dataPoint.dragForce.y
          );
          yDragForceLabel.left = yDragForceArrow.tipX + 5;
          yDragForceLabel.y = yDragForceArrow.tipY;
        }

        forceGravityArrow.setTailAndTip( freeBody.x,
          freeBody.y,
          freeBody.x,
          freeBody.y - FORCE_SCALAR * dataPoint.forceGravity
        );
        forceGravityLabel.left = forceGravityArrow.tipX + 5;
        forceGravityLabel.y = forceGravityArrow.tipY;

        if ( totalVisible ) {
          const xTotalForce = dataPoint.dragForce.x;
          const yTotalForce = dataPoint.dragForce.y;
          totalDragForceArrow.setTailAndTip( freeBody.x,
            freeBody.y,
            freeBody.x - FORCE_SCALAR * xTotalForce,
            freeBody.y + FORCE_SCALAR * yTotalForce
          );
          totalDragForceLabel.right = totalDragForceArrow.tipX - 5;
          totalDragForceLabel.bottom = totalDragForceArrow.tipY - 5;
        }

        forcesBox.setRectBounds( diagramContainer.getChildBounds().dilated( FORCES_BOX_DILATION ) );
      }
    } );

    const viewPointListener = point => {
      const dragForceExists = point.dataPoint.airDensity > 0;
      xDragForceLabel.visible = dragForceExists;
      yDragForceLabel.visible = dragForceExists;
      totalDragForceLabel.visible = dragForceExists;
    };
    viewPointProperty.link( viewPointListener );

    this.disposeFreeBodyDiagram = () => {
      viewPointProperty.unlink( viewPointListener );
      multilink.dispose();
      xDragForceArrow.dispose();
      yDragForceArrow.dispose();
      totalDragForceArrow.dispose();
      forceGravityArrow.dispose();
      xDragForceLabel.dispose();
      yDragForceLabel.dispose();
      forceGravityLabel.dispose();
      totalDragForceLabel.dispose();
    };
  }

  /**
   * @override
   * @public
   */
  dispose() {
    this.disposeFreeBodyDiagram();
    super.dispose();
  }
}

projectileMotion.register( 'FreeBodyDiagram', FreeBodyDiagram );
export default FreeBodyDiagram;