'use strict';

const DEFAULT_COMMAND = `--help`;

const GENERATE_COMMAND = `--generate`;

const HELP_COMMAND = `--help`;

const VERSION_COMMAND = `--version`;

const SERVER_COMMAND = `--server`;

const DEFAULT_PORT = 3000;

const USER_ARGV_INDEX = 2;

const ExitCode = {
  error: 1,
  success: 0,
};

const DEFAULT_COUNT = 1;

const FILE_NAME = `mocks.json`;

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  min: 1,
  max: 16,
};

const Message = {
  ERROR: `Can't write data to file...`,
  SUCCESS: `Operation success. File created.`,
  NOT_FOUND: `Not found`,
  ERROR_CREATE_SERVER: `Server creation error`,
  AWAITING_CONNECTIONS: `Ожидаю соединений на `,
};

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401
};

module.exports = {
  DEFAULT_COMMAND,
  GENERATE_COMMAND,
  HELP_COMMAND,
  VERSION_COMMAND,
  SERVER_COMMAND,
  DEFAULT_PORT,
  USER_ARGV_INDEX,
  ExitCode,
  DEFAULT_COUNT,
  FILE_NAME,
  SumRestrict,
  PictureRestrict,
  Message,
  HttpCode,
};
