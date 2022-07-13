// import projectileMotion from "../projectileMotion";

const StatUtils = {
  randomFromNormal: (mean, stardardDeviation) => {
    var u = 0,
      v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return (
      mean +
      stardardDeviation *
        Math.sqrt(-2.0 * Math.log(u)) *
        Math.cos(2.0 * Math.PI * v)
    );
  },
};

// projectileMotion.register("StatUtils", StatUtils);

export default StatUtils;
