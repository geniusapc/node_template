const CooperativeGift = require('../../models/CooperativeGift');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { platformId: cooperativeId } = req.user;

  await CooperativeGift.create({ ...req.body, cooperativeId });

  const message = 'Gift uploaded successfully';
  return response(res, next, 200, null, message);
};
