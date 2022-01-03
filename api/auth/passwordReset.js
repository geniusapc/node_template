const User = require('../../models/User');
const sendResetPasswordMail = require('../../utils/email/forgotpassword');
const sendAccountNotFoundMail = require('../../utils/email/accountNotFound');
const { generateUserToken } = require('../../utils/auth/userToken');

const { PASSWORDRESET } = require('../../constants');

module.exports = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const token = await generateUserToken(PASSWORDRESET, user);
    await sendResetPasswordMail(user, token);
  } else {
    await sendAccountNotFoundMail(email);
  }

  return res.send({
    status: 'success',
    message: 'Password reset email sent successfully',
    data: null,
  });
};
