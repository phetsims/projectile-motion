// Copyright 2016, University of Colorado Boulder

/**
 * Cannon view. Angle can change when user drags the cannon
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );

  // constants
  var CANNON_LENGTH = 3;
  var CANNON_WIDTH = 0.7;


  /**
   * @param {Particle} particle
   * @param {String|color} color
   * @constructor
   */
  function CannonNode( model, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode, { pickable: true } );
    // debugger;

    // auxiliary functions for setting the coordinates of the rectangle
    thisNode.getX2 = function( angle ) {
      return modelViewTransform.modelToViewX( CANNON_LENGTH * Math.cos( angle * Math.PI / 180 ) + model.cannonX );
    };

    thisNode.getY2 = function( angle ) {
      return modelViewTransform.modelToViewY( CANNON_LENGTH * Math.sin( angle * Math.PI / 180 ) + model.cannonY );
    };

    // node drawn 
    thisNode.cannon = new Line(
      modelViewTransform.modelToViewX( model.cannonX ),
      modelViewTransform.modelToViewY( model.cannonY ),
      thisNode.getX2( model.angle ),
      thisNode.getY2( model.angle ), {
        stroke: 'rgba(0,0,0,0.4)',
        lineWidth: modelViewTransform.modelToViewDeltaX( CANNON_WIDTH )
      }
    );

    thisNode.addChild( thisNode.cannon );

    // watch for if the trajectory changes location
    model.angleProperty.link( function( angle ) {
      thisNode.cannon.x2 = thisNode.getX2( model.angle );
      thisNode.cannon.y2 = thisNode.getY2( model.angle );
    } );


  }

  projectileMotion.register( 'CannonNode', CannonNode );

  return inherit( Node, CannonNode );
} );

