'use strict';

const {
  PictureRestrict,
  SumRestrict,
  DEFAULT_COUNT,
  Message,
  FILL_COMMAND,
  OfferType
} = require(`../constants`);

const {
  getRandomInt,
  shuffle,
  fillDbWithContent,
  getPictureFileName
} = require(`../utils`);

const {mockUsers} = require(`../mocks/mocks`);

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const path = require(`path`);

const MAX_COMMENTS = 4;

const FILE_NAME = `fill-db.sql`;
const FILE_SENTENCES_PATH = path.resolve(__dirname, `../../../data`, `sentences.txt`);
const FILE_TITLES_PATH = path.resolve(__dirname, `../../../data`, `titles.txt`);
const FILE_CATEGORIES_PATH = path.resolve(__dirname, `../../../data`, `categories.txt`);
const FILE_COMMENTS_PATH = path.resolve(__dirname, `../../../data`, `comments.txt`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.split(`\n`).filter((stringItem) => stringItem !== ``);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, offerId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    offerId,
    text: shuffle(comments)
            .slice(0, getRandomInt(1, 3))
            .join(``)
  }))
);

const generateOffers = (count, titles, categoryCount, userCount, sentences, comments) => (
  Array(count).fill({}).map((_, index) => ({
    category: [getRandomInt(1, categoryCount)],
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
  }))
);

module.exports = {
  name: FILL_COMMAND,
  async run(args) {
    const [sentences, titles, categories, commentSentences] = await Promise.all([
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const offers = generateOffers(countOffer, titles, categories.length, mockUsers.length, sentences, commentSentences);

    const comments = offers.flatMap((offer) => offer.comments);

    const offerCategories = offers.map((offer, index) => ({offerId: index + 1, categoryId: offer.category[0]}));

    const userValues = mockUsers.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const offerValues = offers.map(
        ({title, description, type, sum, picture, userId}) =>
          `('${title}', '${description}', '${type}', ${sum}, '${picture}', ${userId})`
    ).join(`,\n`);

    const offerCategoryValues = offerCategories.map(
        ({offerId, categoryId}) =>
          `(${offerId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, offerId}) =>
          `('${text}', ${userId}, ${offerId})`
    ).join(`,\n`);

    const content = fillDbWithContent(
        userValues,
        categoryValues,
        offerValues,
        offerCategoryValues,
        commentValues
    );

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(Message.SUCCESS));
    } catch (err) {
      console.error(chalk.red(Message.ERROR));
    }
  }
};
