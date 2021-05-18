/**
 *  @function it returns random number between min, max
 *
 */

const makeRandomNumber = (min, max) => {
  return Math.min(Math.round((max - min) * Math.random()) + min, max);
};

module.exports = makeRandomNumber;
