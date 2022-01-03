const cron = require('node-cron');
const logger = require('../startup/logger');

module.exports = async () => {
  cron.schedule('55 23 28 2 *', async () => {
    logger.info(`Doing a work; time: ${Date()}`);
    // do work
  });
};
