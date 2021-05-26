'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../constants`);
const {offerMockData} = require(`../mocks/mocks`);


const createApi = () => {
  const app = express();
  const clonedData = JSON.parse(JSON.stringify(offerMockData));

  app.use(express.json());
  offer(app, new OfferService(clonedData), new CommentService());

  return app;
};


describe(`API returns a list of all offers`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals "yVJIq6"`, () => expect(response.body[0].id).toBe(`yVJIq6`));
});

describe(`API returns an offer with given id`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/yVJIq6`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Продам отличную подборку фильмов на VHS."`,
      () => expect(response.body.title)
            .toBe(`Продам отличную подборку фильмов на VHS.`));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
                      .post(`/offers`)
                      .send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers count is changed`, () => request(app)
                                          .get(`/offers`)
                                          .expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createApi();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {

      const badOffer = {...newOffer};
      delete badOffer[key];

      await request(app)
              .post(`/offers`)
              .send(badOffer)
              .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
                      .put(`/offers/yVJIq6`)
                      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offer is really changed`, () => request(app)
                                          .get(`/offers/yVJIq6`)
                                          .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`)));

  test(`API returns status code 404 when trying to change non-existent offer`, () => {
    const validOffer = {
      category: `Это`,
      title: `валидный`,
      description: `объект`,
      picture: `объявления`,
      type: `однако`,
      sum: 404
    };

    return request(app)
            .put(`/offers/NOEXST`)
            .send(validOffer)
            .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
    const invalidOffer = {
      category: `Это`,
      title: `невалидный`,
      description: `объект`,
      picture: `объявления`,
      type: `нет поля sum`
    };

    return request(app)
            .put(`/offers/NOEXST`)
            .send(invalidOffer)
            .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API correctly deletes an offer`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/pfq24T`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`pfq24T`));
  test(`Offer count is 4 now`, () => request(app)
                                      .get(`/offers`)
                                      .expect((res) => expect(res.body.length).toBe(4)));

  test(`API refuses to delete non-existent offer`, () => {
    return request(app)
            .delete(`/offers/NOEXST`)
            .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API returns a list of comments to given offer`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/6h3y0h/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(4));
  test(`First comment's id is "A7CZ13"`, () => expect(response.body[0].id).toBe(`A7CZ13`));
});

describe(`API creates a comment`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
                      .post(`/offers/6h3y0h/comments`)
                      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app)
                                            .get(`/offers/6h3y0h/comments`)
                                            .expect((res) => expect(res.body.length).toBe(5)));

  test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
    return request(app)
            .post(`/offers/NOEXST/comments`)
            .send(newComment)
            .expect(HttpCode.NOT_FOUND);
  });

  test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
    return request(app)
            .post(`/offers/6h3y0h/comments`)
            .send({})
            .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API correctly deletes a comment`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/6h3y0h/comments/A7CZ13`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`A7CZ13`));
  test(`Comments count is 4 now`, () => request(app)
                                          .get(`/offers/6h3y0h/comments`)
                                          .expect((res) => expect(res.body.length).toBe(4))
  );

  test(`API refuses to delete non-existent comment`, () => {
    return request(app)
            .delete(`/offers/6h3y0h/comments/NOEXST`)
            .expect(HttpCode.NOT_FOUND);
  });

  test(`API refuses to delete a comment to non-existent offer`, () => {
    return request(app)
            .delete(`/offers/NOEXST/comments/A7CZ13`)
            .expect(HttpCode.NOT_FOUND);
  });
});

