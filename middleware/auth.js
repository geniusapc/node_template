const jwt = require('jsonwebtoken');
const { throwError } = require('../utils/response');
const { JWT_KEY } = require('../config/keys');
const User = require('../models/User');


// /* eslint consistent-return: "off" */
module.exports.loginAuth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) throwError(400, 'NO_TOKEN', 'Access denied. No token provided');

  try {
    const decoded = jwt.verify(token, JWT_KEY);

    const user = await User.findById(decoded._id).select([
      'roles',
      'permission',
    ]);

    if (!user) throwError(403, 'INVALID_ACCOUNT', 'Account does not exist');

    req.user = user;
  } catch {
    throwError(401, 'INVALID_TOKEN', 'Invalid token');
  }
  next();
};

