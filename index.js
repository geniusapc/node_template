require('./middleware/unCaughtErrors');
require('dotenv').config();
const debug = require('debug');
const express = require('express');
const app = express();
const db = require('./config/db');
const cronJobs = require('./cron/index');
const { PORT } = require('./config/keys');
const requiredKeys = require('./middleware/requiredKeys');
const startupMiddlewares = require('./middleware/startUpMiddlewares');
const routes = require('./routes');


debug.enable('app:start')
const log = debug('app:start')


const main = async () => {
  requiredKeys();
  startupMiddlewares(app);
  await db();
  routes(app);
  cronJobs();
  app.listen(PORT, () => {
    log(`Listening on port ${PORT}`);
  });
};

main();
