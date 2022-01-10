/* eslint no-unused-vars:"off" */
const logger = require('../config/logger');
const { errorResponse } = require('../utils/response');

module.exports = (err, req, res, next) => {
  const error = err
  switch (err.name) {
    case 'Error':
      error.status = err.status || 400;
      break;
    case 'MongoError':
      error.status = 400;
      break;
    case 'ValidationError':
      error.status = 422;
      error.message = err.message.split(':')[2] || err.details[0].message; // Mongo and Joi validator
      break;
    default:
      logger.error(err);
      error.status = 500;
  }

  return errorResponse(res, err.status, err.message, err.type);
};
