'use strict';

const fs = require(`fs`);
const {
  getRandomInt,
  shuffle,
} = require(`../utils`);
const {
  TITLES,
  SENTENCES,
  CATEGORIES,
  OfferType
} = require(`../mocks/mocks`);
const {
  PictureRestrict,
  SumRestrict,
  DEFAULT_COUNT,
  FILE_NAME,
  Message,
  GENERATE_COMMAND
} = require(`../constants`);


const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
    description: shuffle(SENTENCES).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

module.exports = {
  name: GENERATE_COMMAND,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(Message.ERROR);
      }

      return console.info(Message.SUCCESS);
    });
  }
};
