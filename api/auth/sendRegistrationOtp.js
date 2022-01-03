const User = require('../../models/UnregisteredCoopMember');
const Cache = require('../../startup/redisConnection');
const { genRandNum } = require('../../utils/randomCode/randomCode');
const sendOtp = require('../../utils/sms/sendOtp');
const { NUMBERVERIFICATION } = require('../../constants');

module.exports = async (req, res) => {
  const { phoneNumber } = req.body;
  const user = await User.findOne({ phoneNumber });
  if (!user) throw new Error('Invalid User');

  const otp = String(genRandNum(4));
  const cacheKey = `${NUMBERVERIFICATION}${phoneNumber}`;
  const payload = JSON.stringify({ phoneNumber, otp, isVerified: false });
  await Cache.set(cacheKey, payload);

  await sendOtp({ otp, phoneNumber });
  return res.send({
    status: 'success',
    message: 'Otp sent successfully',
    data: null,
  });
};
