/**
 * @function it returns random number between min and max
 * @param {number} min - minimum value of random number
 * @param {number} max - maximum value of random number
 * @return {number} - random number
 */

const makeRandomNumber = (min, max) => {
  return Math.min(Math.round((max - min) * Math.random()) + min, max);
};

module.exports = makeRandomNumber;
