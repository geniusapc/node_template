const _ = require('lodash');
const getUserByToken = require('../../utils/auth/userToken');
const { EMAILVERIFICATION } = require('../../constants');

module.exports = async (req, res) => {
  const { token } = req.body;

  let user = await getUserByToken(EMAILVERIFICATION, token);

  user.isVerified.email = true;
  await user.save();

  const authtoken = await user.authToken();
  user = _.omit(user.toObject(), ['password']);

  return res.header({ 'x-auth-token': authtoken }).send({
    status: 'success',
    message: 'Email verified successfully',
    data: user,
  });
};
