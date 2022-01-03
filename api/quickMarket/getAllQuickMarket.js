const QuickMarket = require('../../models/QuickMarket');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const quickMarket = await QuickMarket.find({})
    .select(['-updatedAt', '-__v'])
    .sort({ title: 1 });

  const msg = 'Quick market retrieved successfully';
  return response(res, next, 200, quickMarket, msg);
};
