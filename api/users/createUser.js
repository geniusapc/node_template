const { v4: uuidv4 } = require('uuid');
const User = require('../../models/User');
const Platform = require('../../models/Platform');
const forgotpassword = require('../../utils/email/forgotpassword');
const { generateUserToken } = require('../../utils/auth/userToken');
const { PASSWORDRESET } = require('../../constants');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { name, email, platformId, phoneNumber, location } = req.body;

  const emailExist = await User.findOne({ email });
  if (emailExist) throw new Error('Email already exists!');

  const platform = await Platform.findOne({ _id: platformId });
  if (!platform) throw new Error('Invalid platform');

  const allUsers = await User.find({})
    .sort({ createdAt: 1 })
    .select(['userName', 'uniqueId'])
    .lean();

  const user = new User({
    name,
    email,
    location,
    platformId,
    password: uuidv4(),
    phoneNumber,
  });

  user.generateUsername(allUsers, name);
  user.generateUniqueId(allUsers);

  const newUser = await user.save();
  const token = await generateUserToken(PASSWORDRESET, newUser, {
    'isVerified.email': true,
  });
  await forgotpassword(newUser, token);

  const message = 'User created successfully';
  return response(res, next, 200, newUser, message);
};
