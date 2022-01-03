const _ = require('lodash');
const User = require('../../models/User');
const UnregisteredCoopMember = require('../../models/UnregisteredCoopMember');
const Cache = require('../../startup/redisConnection');
const { NUMBERVERIFICATION } = require('../../constants');
const generateUniqueId = require('../../utils/randomCode/userUniqueCode');

module.exports = async (req, res) => {
  const { password, transactionPin, phoneNumber } = req.body;

  const cacheKey = `${NUMBERVERIFICATION}${phoneNumber}`;

  let result;

  result = await Cache.get(cacheKey);
  try {
    result = JSON.parse(result);
  } catch {
    result = {};
  }
  if (!result || !result.isVerified)
    throw new Error('Phone number has not been verified');

  const user = await UnregisteredCoopMember.find({
    phoneNumber: result.phoneNumber,
  });
  if (!user) throw Error('Invalid account');

  const userIsValid = await User.findOne({ email: user.email });
  if (userIsValid) throw Error('User already exist');

  const uniqueId = await generateUniqueId();

  let newUser = await User.create({
    password,
    phoneNumber,
    transactionPin,
    uniqueId,
    isVerified: true,
    email: user.email,
    name: user.name,
    permission: user.permission,
    wallet: { status: 'enabled', balance: user.walletBalance },
    platformId: user.cooperativeId,
  });

  await Cache.del(cacheKey);
  await UnregisteredCoopMember.findByIdAndDelete(user._id);

  const jwtToken = await newUser.authToken();
  newUser = _.omit(newUser.toObject(), ['password']);

  return res.header({ 'x-auth-token': jwtToken }).send({
    status: 'success',
    message: 'Registration successful',
    data: newUser,
  });
};
