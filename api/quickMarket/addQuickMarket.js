const QuickMarket = require('../../models/QuickMarket');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const randomNumber = Math.floor(Math.random() * 1000);

  req.body.url = `/${req.body.title.replace(/ /g, '-')}-${randomNumber}`;

  const quickMarket = await QuickMarket.create(req.body);

  const msg = 'Quick market created successfully';
  return response(res, next, 200, quickMarket, msg);
};
