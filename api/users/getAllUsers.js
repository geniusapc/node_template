const User = require('../../models/User');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { permission, platformId } = req.user;
  const { platform } = req.query;

  let condition = {};
  const filter = ['-__v', '-updatedAt', '-password', '-transactionPin'];

  if (platform) condition.platformId = platform;

  if (permission !== 'admin') {
    condition = { permission: 'cooperative', platformId };
  }

  const users = await User.find(condition).select(filter);

  const message = 'Users retrieved successfully';
  return response(res, next, 200, users, message);
};
