'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);

const route = new Router();

module.exports = (app, categoryService) => {
  route.get(`/`, async (req, res) => {
    const categories = await categoryService.findAll();
    res.status(HttpCode.OK)
      .json(categories);
  });

  app.use(`/category`, route);
};
