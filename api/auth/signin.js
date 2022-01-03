const User = require('../../models/User');

module.exports = async (req, res) => {
  const { email, password } = req.body;

  const validUser = await User.findOne({ email });
  if (!validUser) throw new Error('Invalid credentials');

  const user = await validUser.comparePassword(password);
  if (!user) throw new Error('Invalid credentials');

  const token = await validUser.authToken();

  return res.header({ 'x-auth-token': token }).send({
    status: 'success',
    message: 'login successful',
    data: validUser,
  });
};
