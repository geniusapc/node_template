const QuickMarket = require('../../models/QuickMarket');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const quickMarket = await QuickMarket.findOne({
    url: `/${req.params.url}`,
  })
    .populate('products.id', "platform  ")
    .select(['-updatedAt', '-__v']);

  const msg = 'Quick market retrieved successfully';
  return response(res, next, 200, quickMarket, msg);
};
