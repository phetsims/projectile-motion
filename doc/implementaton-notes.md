# Projectile Motion - implementation notes

This document contains miscellaneous notes related to the implementation of Projectile Motion. It
supplements the internal (source code) documentation, and (hopefully) provides insight into
"big picture" implementation issues.  The audience for this document is software developers who are familiar
with JavaScript and PhET simulation development (as described in [PhET Development Overview](https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md)).

First, read [model.md](https://github.com/phetsims/projectile-motion/blob/master/doc/model.md), which provides
a high-level description of the simulation model.

## General

This section describes how this simulation uses patterns that are common to most PhET simulations.

**Model-view transform**: Many PhET simulations have a model-view transform that maps between model and view coordinate frames
(see [ModelViewTransform2](https://github.com/phetsims/phetcommon/blob/master/js/view/ModelViewTransform2.js)).
This simulation uses a model-view transform to convert from model units (meters) to view units (in the ScreenView coordinates).
The zoom Property can change this model-view transform, which means a meter may map to a larger or smaller number of view units.

**Memory management**: The only things that are dynamic and require disposal are Trajectory, TrajectoryNode, ProjectileNode, and the "reward stars" created in TargetNode. All other observer/observable relationships exist for the lifetime of the sim, so there is no need to call the various memory-management functions associated with these objects (unlink, dispose, detach, etc.).

## Structure

Most of the code, both in model and view, is within the common folder, because the model and  view across screens is
generally the same. What differs across each screen is the level of control the user has. For instance, they can fine-tune 
the angle on the cannon on the Lab screen, but on other screens they can only change it by a delta of 5 degrees. They can only
view certain vectors on certain screens, and they can only change things such as drag coefficient, altitude, gravity, etc. on
certain screens. The previous changes are specified as arguments or options from individual screens' model or screen view to the common model
or screen view constructor. Right-side panels for each screen are different, so these are their own constructor, instantiated by
individual ScreenViews, and are then passed to the common ScreenView constructor.

## Projectile object benchmarks

Only the Intro and Lab screens feature different projectile benchmarks (e.g. PUMPKIN, PIANO), and the
benchmark being used/about to be fired is stored in the ProjectileMotionModel.selectedProjectileObjectTypeProperty. Even though
the Drag and Vectors screens don't feature benchmarks, they, along with the custom option on the Lab screen, still have inherent
projectileObjectTypes( INTRO, VECTORS, and CUSTOM, respectively ). Since each screen has a different default object type, it is 
passed as an argument to the model constructor.

View the full list of projectile object benchmarks at [ProjectileObjectType.js](https://github.com/phetsims/projectile-motion/blob/master/js/common/model/ProjectileObjectType.js).

ProjectileObjectType contains the model information for each type of projectile object, and to create the corresponding view (which may
be an image or node), ProjectileNode calls on methods in ProjectileObjectViewFactory.

## Keeping track of trajectories and projectiles

A Trajectory keeps track of the path and the projectile objects that fly on it. Each time a Trajectory is created, a 
TrajectoryNode is created. Each time a projectile is added to a Trajectory, TrajectoryNode creates and stores a ProjectileNode.

First, read a general explanation at [model.md](https://github.com/phetsims/projectile-motion/blob/master/doc/model.md). It starts with
"There is no limit to the number of projectiles".

This means that a new Trajectory is created if the fire button is pressed *and* if this new projectile fired is not the same as the previous one.
If the fire button is pressed and the new projectile fired is the same as the previous, a projectile is added to the previous Trajectory.

Also, if air resistance, altitude, or gravity are changed when there are projectiles in air, this generates new paths, so for 
each Trajectory that has multiple projectiles, new Trajectories are created for every projectile after the first.

