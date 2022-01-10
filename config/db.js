const mongoose = require('mongoose');
const debug = require('debug')('app:start');
const logger = require('./logger');
const { MONGODB_URI } = require('./keys');

module.exports = async () => {

  await mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => debug('connected to database'))
    .catch((e) => {
      debug('Error: error connecting to db');
      logger.error(e);
    });
};
