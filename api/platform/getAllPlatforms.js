const Platform = require('../../models/Platform');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { permission } = req.query;

  const condition = {};

  if (permission) {
    condition.permission = permission;
  }
  const cooperatives = await Platform.find(condition)
    .sort({ createdAt: -1 })
    .select([
      'permission',
      'authUrl',
      'paymentUrl',
      'paymentVerificationUrl',
      'name',
      'logo',
      'accessKey',
    ]);
  return response(res, next, 200, cooperatives);
};
