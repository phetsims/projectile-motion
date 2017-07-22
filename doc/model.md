# Projectile Motion - model description

This is a high-level description of the model used in Projectile Motion. It's intended for audiences that are not 
necessarily technical. Each screen has the same model, so the only difference is the levels of control over the 
projectile, environment, and vectors.

There is no limit to the number of projectiles the user may fire before needing to reset, but:
* There can only be three projectiles in the air at a time, so the fire button will be disabled if the user has hit 
that limit. The fire button will be enabled again when the first projectile has hit the ground.
* The trajectories on screen will fade out over time. The model only stores 5 trajectories at a time.
* If the same projectile is fired in a row, it counts as the same trajectory, and thus doesn't count against the limit of
5 trajectories. A projectile is the same if it has the same object type, diameter, drag coefficient, mass, initial height, 
speed, angle, gravity, and air density. Also, the projectile cannot be the same as a previous one if air density has changed 
when the previous one was in mid air.

Changes in air resistance, altitude, and gravity apply immediately, which means both the next 
projectile fired and the trajectories of projectiles currently in mid air are affected. The type of projectile, mass, 
diameter, and drag coefficient, height, angle, and initial speed only affect the next projectile fired. 

Vectors display the total or component velocity, acceleration, and force acted on the projectile. The length of the 
vectors are scaled to make them the most visible to a user, but they do not correspond to any units. To demonstrate, 
zooming in or out does not affect the length of the vectors.

For force specifically, total vectors indicate the total drag force and force of gravity separately. Component vectors 
indicate the components of drag force, as well as force gravity (which is in the y direction).

The model in this simulation includes a couple of numerical calculations relating to physical phenomena.

For drag, we used quadratic drag (Fdrag ~ v^2) which is valid in the high Reynold’s number limit appropriate for 
macroscopic objects like baseballs. Linear drag (Stoke's Law) is only valid in the very low Reynold's number limit 
(like micron-sized droplets in air). Furthermore, the drag coefficient depends on the Reynolds number, which we have 
assumed to be a constant.

Air density is 0 when air resistance is off, and when air resistance is on, air density is calculated based on altitude 
(defaults to sea level).
