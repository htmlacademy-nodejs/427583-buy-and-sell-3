'use strict';

const {Router} = require(`express`);
const {
  CategoryService,
  CommentService,
  OfferService,
  SearchService
} = require(`../data-service`);
const category = require(`../api/category`);
const offer = require(`../api/offer`);
const search = require(`../api/search`);
const getMockData = require(`../lib/get-mock-data`);

const getApiRoutes = async () => {
  const app = new Router();
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  offer(app, new OfferService(mockData), new CommentService());
  search(app, new SearchService(mockData));

  return app;
};

module.exports = getApiRoutes;
