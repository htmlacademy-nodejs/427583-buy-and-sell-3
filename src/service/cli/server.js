'use strict';

const {
  SERVER_COMMAND,
  DEFAULT_PORT,
  HttpCode,
  Message,
  API_PREFIX
} = require(`../constants`);
const chalk = require(`chalk`);
const express = require(`express`);
const getMockData = require(`../lib/get-mock-data`);
const getApiRoutes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const app = express();

const logger = getLogger({name: `api`});

module.exports = {
  name: SERVER_COMMAND,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const routes = await getApiRoutes();

    app.use(express.json());
    app.use(API_PREFIX, routes);
    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send(Message.NOT_FOUND);
      logger.error(`${Message.ROUTE_NOT_FOUND}${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);
      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });

      return next();
    });

    try {
      await getMockData();

      app.listen(port, (err) => {
        if (err) {
          return logger.error(chalk.red(Message.ERROR_CREATE_SERVER));
        }

        return logger.info(chalk.green(`${Message.AWAITING_CONNECTIONS}${port}`));
      });
    } catch (err) {
      logger.error(chalk.red(err));
      process.exit(1);
    }
  }
};
