const mongoose = require('mongoose');
const debug = require('debug')('app:start');
const { MONGODB_URI } = require('../config/keys');

module.exports = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  debug('connected to database');
};
