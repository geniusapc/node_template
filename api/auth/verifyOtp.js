const Cache = require('../../startup/redisConnection');
const { NUMBERVERIFICATION } = require('../../constants');
/* eslint consistent-return:"off" */
module.exports = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const cacheKey = `${NUMBERVERIFICATION}${phoneNumber}`;

  let cache = await Cache.get(cacheKey);

  try {
    cache = JSON.parse(cache);
  } catch {
    throw new Error('Invalid otp');
  }

  if (!cache || cache.otp !== otp) throw new Error('Invalid otp');
  if (cache.isVerified) throw new Error('otp already verified');

  const payload = JSON.stringify({ phoneNumber, otp, isVerified: true });
  await Cache.setex(cacheKey, 60 * 60 * 24, payload);

  return res.send({
    status: 'success',
    message: 'Otp verified successfully',
    data: null,
  });
};
