const logger = require('../config/logger');
const config = require('../config/keys');

const requiredSecretKeys = () => {
  const keys = ['MONGODB_URI'];
  for (let index = 0; index < keys.length; index++) {
    if (!config[keys[index]]) {
      logger.error(`FATAL ERROR: ${keys[index]} is not set.`);
    }
  }

 
};

module.exports = requiredSecretKeys;
