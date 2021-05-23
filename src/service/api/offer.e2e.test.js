'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../constants`);

const mockData = [{
  "id": `yVJIq6`,
  "category": [`Журналы`],
  "description": `Не пытайтесь торговаться. Цену вещам я знаю. Две страницы заляпаны свежим кофе. Товар в отличном состоянии. Если найдёте дешевле — сброшу цену.`,
  "picture": `item05.jpg`,
  "title": `Продам отличную подборку фильмов на VHS.`,
  "type": `sale`,
  "sum": 12011,
  "comments": [{
    "id": `4Gw2OH`,
    "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту? А сколько игр в комплекте? Неплохо, но дорого. Совсем немного... А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
  }, {
    "id": `LYMH5W`,
    "text": `Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого. Вы что?! В магазине дешевле. А сколько игр в комплекте? Почему в таком ужасном состоянии? А где блок питания? Оплата наличными или перевод на карту?`
  }]
}, {
  "id": `pbDeqS`,
  "category": [`Животные`],
  "description": `Это настоящая находка для коллекционера! Даю недельную гарантию. Если товар не понравится — верну всё до последней копейки. Кажется, что это хрупкая вещь.`,
  "picture": `item010.jpg`,
  "title": `Отдам в хорошие руки подшивку «Мурзилка».`,
  "type": `sale`,
  "sum": 44596,
  "comments": [{
    "id": `MT3isd`,
    "text": `Совсем немного... А сколько игр в комплекте? Почему в таком ужасном состоянии? Неплохо, но дорого. С чем связана продажа? Почему так дешёво? А где блок питания? Вы что?! В магазине дешевле.`
  }, {
    "id": `LlSuu8`,
    "text": `А где блок питания? Неплохо, но дорого. Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле. Совсем немного...`
  }]
}, {
  "id": `6h3y0h`,
  "category": [`Игры`],
  "description": `Две страницы заляпаны свежим кофе. Бонусом отдам все аксессуары. Пользовались бережно и только по большим праздникам. Таких предложений больше нет!`,
  "picture": `item11.jpg`,
  "title": `Продам отличную подборку фильмов на VHS.`,
  "type": `offer`,
  "sum": 64711,
  "comments": [{
    "id": `A7CZ13`,
    "text": `Неплохо, но дорого. Совсем немного... Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии? А где блок питания? Оплата наличными или перевод на карту?`
  }, {
    "id": `8sG43K`,
    "text": `Неплохо, но дорого. Вы что?! В магазине дешевле. Совсем немного... Почему в таком ужасном состоянии? А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца. А где блок питания? Оплата наличными или перевод на карту?`
  }, {
    "id": `XqnRb9`,
    "text": `Неплохо, но дорого. А где блок питания? С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии? А сколько игр в комплекте? Совсем немного... Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`
  }, {
    "id": `2LksGH`,
    "text": `Оплата наличными или перевод на карту? Совсем немного... С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого. Вы что?! В магазине дешевле.`
  }]
}, {
  "id": `1OXMs1`,
  "category": [`Игры`],
  "description": `При покупке с меня бесплатная доставка в черте города. Мой дед не мог её сломать. Кому нужен этот новый телефон, если тут такое... Если товар не понравится — верну всё до последней копейки.`,
  "picture": `item11.jpg`,
  "title": `Продам коллекцию журналов «Огонёк».`,
  "type": `sale`,
  "sum": 92729,
  "comments": [{
    "id": `ExVzBo`,
    "text": `Оплата наличными или перевод на карту? Неплохо, но дорого. А сколько игр в комплекте? А где блок питания? Почему в таком ужасном состоянии? Совсем немного... Продаю в связи с переездом. Отрываю от сердца.`
  }, {
    "id": `eQkcy0`,
    "text": `Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту? Совсем немного... Неплохо, но дорого.`
  }]
}, {
  "id": `pfq24T`,
  "category": [`Разное`],
  "description": `Мой дед не мог её сломать. Пользовались бережно и только по большим праздникам. Продаю с болью в сердце... Если найдёте дешевле — сброшу цену.`,
  "picture": `item06.jpg`,
  "title": `Продам советскую посуду. Почти не разбита.`,
  "type": `sale`,
  "sum": 64948,
  "comments": [{
    "id": `dhWsQD`,
    "text": `С чем связана продажа? Почему так дешёво? Неплохо, но дорого. Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле. Совсем немного...`
  }]
}];

const createApi = () => {
  const app = express();
  const clonedData = JSON.parse(JSON.stringify(mockData));

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
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const app = createApi();

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
  const app = createApi();

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
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createApi();

  return request(app)
          .delete(`/offers/NOEXST`)
          .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createApi();

  return request(app)
          .post(`/offers/NOEXST/comments`)
          .send({
            text: `Неважно`
          })
          .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createApi();

  return request(app)
          .delete(`/offers/yVJIq6/comments/NOEXST`)
          .expect(HttpCode.NOT_FOUND);
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


describe(`API creates a comment if data is valid`, () => {
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
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createApi();

  return request(app)
          .post(`/offers/NOEXST/comments`)
          .send({
            text: `Неважно`
          })
          .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createApi();

  return request(app)
    .post(`/offers/6h3y0h/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

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
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createApi();

  return request(app)
          .delete(`/offers/6h3y0h/comments/NOEXST`)
          .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, () => {
  const app = createApi();

  return request(app)
          .delete(`/offers/NOEXST/comments/A7CZ13`)
          .expect(HttpCode.NOT_FOUND);
});
