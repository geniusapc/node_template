const NotFound = require('../middleware/pageNotFound');
const errorHandler = require('../middleware/errorHandler');
const welcome = require('./welcome');

module.exports = (app) => {
  app.use('/welcome', welcome);
  app.use(NotFound);
  app.use(errorHandler);
};
