const getUserByToken = require('../../utils/auth/userToken');
const { response } = require('../../utils/response');
const { PASSWORDRESET } = require('../../constants');

module.exports = async (req, res, next) => {
  const { password, token } = req.body;
  const user = await getUserByToken(PASSWORDRESET, token);

  user.password = password;
  await user.save();

  const msg = 'Password changed successfully';
  return response(res, next, 200, null, msg);
};
