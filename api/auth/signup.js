const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

const User = require('../../models/User');
const Platform = require('../../models/Platform');
const sendRegisterMail = require('../../utils/email/registration');
const generateUniqueId = require('../../utils/randomCode/userUniqueCode');
const Cache = require('../../startup/redisConnection');
const { EMAILVERIFICATION } = require('../../constants');

module.exports = async (req, res) => {
  const { email, userName } = req.body;

  const emailExist = await User.findOne({ email });
  const userNameExist = await User.findOne({ userName });

  if (emailExist) throw new Error('Email already exists!');
  if (userNameExist) throw new Error('Username already exists!');

  const uniqueId = await generateUniqueId();

  const platform = await Platform({ name: 'foodcrowdy' });

  let newUser = await User.create({
    ...req.body,
    uniqueId,
    platformId: platform._id,
  });
  const token = await newUser.authToken();
  newUser = _.omit(newUser.toObject(), ['password']);

  const emailToken = uuidv4();
  const payload = JSON.stringify({ userId: newUser._id });
  await Cache.setex(`${EMAILVERIFICATION}${emailToken}`, 60 * 60, payload);
  await sendRegisterMail(newUser, emailToken);

  return res.header({ 'x-auth-token': token }).send({
    status: 'success',
    message: 'Registration successful',
    data: newUser,
  });
};
