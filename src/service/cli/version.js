'use strict';

const {VERSION_COMMAND} = require(`../constants`);
const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: VERSION_COMMAND,
  run() {
    const version = packageJsonFile.version;
    console.info(version);
  }
};
