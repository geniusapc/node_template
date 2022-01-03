const User = require('../../models/User');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .select(['-transactionPin', '-password'])
    .lean();

  const message = 'Profile retrieved successfully';
  return response(res, next, 200, user, message);
};
