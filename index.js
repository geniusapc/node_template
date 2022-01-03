require('./startup/unCaughtErrors');
const debug = require('debug')('app:start');
const express = require('express');
require('dotenv').config();
const app = express();
const db = require('./startup/db');
const cronJobs = require('./cron/index');
const { PORT } = require('./config/keys');




/* eslint-disable */
const main = async () => {
  require('./startup/requiredKeys')();
  require('./startup/startUpMiddlewares')(app);
  await db();
  require('./routes')(app);
  cronJobs();
  const server = app.listen(PORT, () => {
    debug(`Listening on port ${PORT}`);
  });
};

main();
