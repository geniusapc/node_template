const CooperativeGift = require('../../models/CooperativeGift');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const condition = { cooperativeId: req.user.platformId };
  const select = ['-__v', '-updatedAt'];
  const { visibility } = req.query;
  if (visibility) condition.visibility = visibility;

  const cooperatives = await CooperativeGift.find(condition).select(select);

  const message = 'Gifts retrived successfully';
  return response(res, next, 200, cooperatives, message);
};
