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

const fillDbWithContent = (userValues, categoryValues, offerValues, offerCategoryValues, commentValues) => {
  return `
    INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
    ${userValues};
    INSERT INTO categories(name) VALUES
    ${categoryValues};
    ALTER TABLE offers DISABLE TRIGGER ALL;
    INSERT INTO offers(title, description, type, sum, picture, user_id) VALUES
    ${offerValues};
    ALTER TABLE offers ENABLE TRIGGER ALL;
    ALTER TABLE offer_categories DISABLE TRIGGER ALL;
    INSERT INTO offer_categories(offer_id, category_id) VALUES
    ${offerCategoryValues};
    ALTER TABLE offer_categories ENABLE TRIGGER ALL;
    ALTER TABLE comments DISABLE TRIGGER ALL;
    INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
    ${commentValues};
    ALTER TABLE comments ENABLE TRIGGER ALL;
  `;
};


const getPictureFileName = (number) => number > 9 ? `item${number}.jpg` : `item0${number}.jpg`;

module.exports = {
  getRandomInt,
  shuffle,
  fillDbWithContent,
  getPictureFileName
};
