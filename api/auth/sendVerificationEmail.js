const crypto = require('crypto');
const User = require('../../models/UnregisteredCoopMember');
const sendVerificationMail = require('../../utils/email/registration');
const Cache = require('../../startup/redisConnection');

module.exports = async (req, res) => {
  const emailToken = crypto.randomBytes(64).toString('hex');
  const user = await User.findOne({ email: req.body.email });

  if (user && !user.isVerified) {
    await Cache.set(user._id, { emailToken });
    await sendVerificationMail(user, emailToken);
  }

  return res.send({
    status: 'success',
    message: 'Email sent successfully',
    data: null,
  });
};
