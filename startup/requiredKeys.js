const logger = require('./logger');
const config = require('../config/keys');

const requiredSecretKeys = () => {
  const keys = ['MONGODB_URI'];
  for (let index = 0; index < keys.length; index++) {
    if (!config[keys[index]]) {
      // Notifies you when you start the app without the neccessary environment variables
      logger.error(`FATAL ERROR: ${keys[index]} is not set.`);
    }
  }

 
};

module.exports = requiredSecretKeys;
