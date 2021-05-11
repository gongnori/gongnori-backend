/**
 *  @function it returns random number between min, max
 *
 */

const makeRandomNumber = (min, max) => {
  return Math.min(Math.floor(max * Math.random()) + min, max);
};

module.exports = makeRandomNumber;
