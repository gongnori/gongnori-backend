/**
 * @function it returns random number between min, max
 * @param {number} min
 * @param {number} max
 * @return {number} random number
 */

const makeRandomNumber = (min, max) => {
  return Math.min(Math.round((max - min) * Math.random()) + min, max);
};

module.exports = makeRandomNumber;
