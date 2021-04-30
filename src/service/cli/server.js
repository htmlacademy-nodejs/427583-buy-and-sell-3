'use strict';

const {
  SERVER_COMMAND,
  DEFAULT_PORT,
  FILE_NAME,
  HttpCode,
  Message
} = require(`../constants`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const express = require(`express`);

const app = express();
app.use(express.json());

app.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
});

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(Message.NOT_FOUND));

module.exports = {
  name: SERVER_COMMAND,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return console.error(chalk.red(Message.ERROR_CREATE_SERVER));
      }

      return console.info(chalk.green(`${Message.AWAITING_CONNECTIONS}${port}`));
    });
  }
};
