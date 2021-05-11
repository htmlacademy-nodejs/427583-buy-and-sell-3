'use strict';

const {
  PictureRestrict,
  SumRestrict,
  DEFAULT_COUNT,
  FILE_NAME,
  Message,
  GENERATE_COMMAND,
  MAX_ID_LENGTH,
} = require(`../constants`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../utils`);
const {OfferType} = require(`../mocks/mocks`);
const chalk = require(`chalk`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const MAX_COMMENTS = 4;

const FILE_SENTENCES_PATH = path.resolve(__dirname, `../../../data`, `sentences.txt`);
const FILE_TITLES_PATH = path.resolve(__dirname, `../../../data`, `titles.txt`);
const FILE_CATEGORIES_PATH = path.resolve(__dirname, `../../../data`, `categories.txt`);
const FILE_COMMENTS_PATH = path.resolve(__dirname, `../../../data`, `comments.txt`);

const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments).slice((0, getRandomInt(1, 3))).join(` `)
  }))
);

const generateOffers = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    category: [categories[getRandomInt(0, categories.length - 1)]],
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
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
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(Message.SUCCESS));
    } catch (err) {
      console.error(chalk.red(Message.ERROR));
    }
  }
};
