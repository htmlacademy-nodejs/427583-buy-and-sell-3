'use strict';

const {HELP_COMMAND} = require(`../constants`);
const chalk = require(`chalk`);

module.exports = {
  name: HELP_COMMAND,
  run() {
    const text = `
      Программа запускает http-сервер и формирует файл с данными для api.
      Гайд:
        server <command>
        Команды:
        --version:            выводит номер версии
        --help:               печатает этот текст
        --generate <count>    формирует файл mocks.json
    `;

    console.info(chalk.gray(text));
  }
};
