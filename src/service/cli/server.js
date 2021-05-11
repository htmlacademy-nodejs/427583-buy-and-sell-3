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
const routes = require(`../api`);

const app = express();
app.use(express.json());
app.use(API_PREFIX, routes);

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(Message.NOT_FOUND));

module.exports = {
  name: SERVER_COMMAND,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      await getMockData();
      app.listen(port, (err) => {
        if (err) {
          return console.error(chalk.red(Message.ERROR_CREATE_SERVER));
        }

        return console.info(chalk.green(`${Message.AWAITING_CONNECTIONS}${port}`));
      });
    } catch (err) {
      console.error(chalk.red(err));
      process.exit(1);
    }
  }
};
