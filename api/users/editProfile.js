const User = require('../../models/User');

const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { id } = req.user;

  let user = await User.findByIdAndUpdate(id, req.body, { new: true });
  user = user.toObject();
  delete user.password;
  delete user.transactionPin;

  const message = 'Profile edited successfully';
  return response(res, next, 200, user, message);
};
