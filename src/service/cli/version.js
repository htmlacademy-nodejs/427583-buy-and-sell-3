'use strict';

const {VERSION_COMMAND} = require(`../constants`);
const packageJsonFile = require(`../../../package.json`);
const chalk = require(`chalk`);

module.exports = {
  name: VERSION_COMMAND,
  run() {
    const version = packageJsonFile.version;
    console.info(chalk.blue(version));
  }
};
