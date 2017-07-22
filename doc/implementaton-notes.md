# Projectile Motion - implementation notes

This document contains miscellaneous notes related to the implementation of Function Builder. It
supplements the internal (source code) documentation, and (hopefully) provides insight into
"big picture" implementation issues.  The audience for this document is software developers who are familiar
with JavaScript and PhET simulation development (as described in [PhET Development Overview]
(http://bit.ly/phet-html5-development-overview)).

First, read [model.md](https://github.com/phetsims/projectile-motion/blob/master/doc/model.md), which provides
a high-level description of the simulation model.


## General

This section describes how this simulation uses patterns that are common to most PhET simulations.

**Model-view transform**: Many PhET simulations have a model-view transform that maps between model and view coordinate frames
(see [ModelViewTransform2](https://github.com/phetsims/phetcommon/blob/master/js/view/ModelViewTransform2.js)).
This simulation uses a model-view transform to convert from model units (meters) to view units (in the ScreenView coordinates).
Also, the zoom property can change this model-view transform.

**Memory management**: Many observer/observable relationships exist for the lifetime of the sim. So there is no need to call the various
memory-management functions associated with objects (unlink, dispose, detach, etc.) for properties linked to by the
tracer tool, measuring tape, cannon, David, target, and controls. Otherwise, the observer/observable relationships
involved in objects that are created many times, such as trajectories, projectiles, and the animation stars on the
target are disposed at the right time.

## Structure

Most of the code, both model and view, for the sim is within the common folder, because the model and general view across screens is the
same. What differs across each screen is the level of control the user has--for instance, whether they can fine tune adjust
the angle on the cannon, whether they can show different vectors, and whether they can change things such as drag coefficient,
altitude, gravity, etc.

## Projectile object benchmarks

Only the Intro and Lab screens feature different projectile benchmarks (e.g. PUMPKIN, PIANO ), and the
benchmark being used/about to be fired is stored in the ProjectileMotionModel.selectedProjectileObjectTypeProperty. However,
the Intro and Vectors screen, as well as the custom option on Lab, still have inherent projectileObjectTypes( INTRO, VECTORS, and CUSTOM,
respectively ). So each screen has a different default object type, so it is passed as an argument to the model constructor.
View the full list of projectile object benchmarks at [ProjectileObjectType.js](https://github.com/phetsims/projectile-motion/blob/master/js/common/modelProjectileObjectType.js).

ProjectileObjectType contains the model information for each type of projectile object, and ProjectileObjectViewFactory 
is called on by ProjectileNode to create the view for the projectile object correspondingly.

## Keeping track of trajectories and projectiles

A Trajectory keeps track of the path and the projectile objects that fly on it. Each time a Trajectory is created, a TrajectoryNode is created. Each time a projectile is added to Trajectory, a ProjectileNode is created
and added to its corresponding TrajectoryNode.

First, there is no limit to the number of projectiles the user may fire before needing to reset, but:
* There can only be three projectiles in the air at a time, so the fire button will be disabled if the user has hit 
that limit. The fire button will be enabled again when the first projectile has hit the ground.
* The trajectories on screen will fade out over time. The model only stores 5 trajectories at a time.
* If the same projectile is fired in a row, it counts as the same trajectory. A projectile is the same if it has the 
same object type, diameter, drag coefficient, mass, initial height, speed, angle, gravity, and air density. Also, the
projectile cannot be the same as a previous one if air density has changed when the previous one was in air.

That means, a new trajectory is created if the fire button is pressed, and if this new projectile fired is not the same as the previous one.
If the fire button is pressed and the new projectile fired is the same, a projectile is added to the previous Trajectory.

Also, air resistance, altitude, and/or gravity are changed when there are projectiles in air, and there is a Trajectory that has
multiple projectiles, new Trajectories are created for every projectile after the first.

