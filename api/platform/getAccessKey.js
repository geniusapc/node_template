const Platform = require('../../models/Platform');
const sha256 = require('../../utils/auth/sha256');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { platformId } = req.user;

  const cooperative = await Platform.findById(platformId).select([
    'apiKey',
  ]);

  const accessKey = sha256(cooperative._id.toHexString(), cooperative.apiKey);
  const clientId = cooperative._id;

  return response(res, next, 200, { clientId, accessKey });
};
