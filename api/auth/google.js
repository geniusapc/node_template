const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const User = require('../../models/User');
const Platform = require('../../models/Platform');
const generateUniqueId = require('../../utils/randomCode/userUniqueCode');

module.exports = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (!user.isVerified || !user.isVerified.email)
      await User.updateOne({ _id: user._id }, { 'isVerified.email': true });
    const token = await user.authToken();
    return res.header({ 'x-auth-token': token }).send({
      status: 'success',
      message: 'logged in successfully',
      data: user,
    });
  }

  const uniqueId = await generateUniqueId();
  const platform = await Platform({ name: 'foodcrowdy' });

  let newUser = await User.create({
    ...req.body,
    'isVerified.email': true,
    password: uuidv4(),
    uniqueId,
    platformId: platform._id,
  });
  const token = await newUser.authToken();
  newUser = _.omit(newUser.toObject(), ['password']);

  return res.header({ 'x-auth-token': token }).send({
    status: 'success',
    message: 'logged in successfully',
    data: newUser,
  });
};
