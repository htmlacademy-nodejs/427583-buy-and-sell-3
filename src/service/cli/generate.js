'use strict';

const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle,
} = require(`../utils`);
const {
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
const chalk = require(`chalk`);

const path = require(`path`);
const FILE_SENTENCES_PATH = path.resolve(__dirname, `../../../data`, `sentences.txt`);
const FILE_TITLES_PATH = path.resolve(__dirname, `../../../data`, `titles.txt`);
const FILE_CATEGORIES_PATH = path.resolve(__dirname, `../../../data`, `categories.txt`);


const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    category: [categories[getRandomInt(0, categories.length - 1)]],
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.split(`\n`).filter((stringItem) => stringItem !== ``);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: GENERATE_COMMAND,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(Message.SUCCESS));
    } catch (err) {
      console.error(chalk.red(Message.ERROR));
    }
  }
};
