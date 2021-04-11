'use strict';

const {SERVER_COMMAND, DEFAULT_PORT, FILE_NAME} = require(`../constants`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const http = require(`http`);

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILE_NAME)
      }
  }
};

module.exports = {
  name: SERVER_COMMAND,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          return console.error(chalk.red(`Ошибка при создании сервера`, err));
        }

        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });
  }
};
