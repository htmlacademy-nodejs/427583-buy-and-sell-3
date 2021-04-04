'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  const arrayCopy = someArray.slice();

  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [arrayCopy[i], arrayCopy[randomPosition]] = [arrayCopy[randomPosition], arrayCopy[i]];
  }

  return arrayCopy;
};

module.exports = {
  getRandomInt,
  shuffle
};
