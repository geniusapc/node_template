const { v4: uuidv4 } = require('uuid');
const sha256 = require('../../utils/auth/sha256');
const Platform = require('../../models/Platform');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { platformId } = req.user;
  const apiKey = uuidv4();
  const cooperative = await Platform.findByIdAndUpdate(
    platformId,
    { apiKey },
    { new: true }
  );
  const accessKey = sha256(cooperative._id.toHexString(), cooperative.apiKey);
  const clientId = cooperative._id;
  const msg = 'Access key generated succesfully';
  return response(res, next, 200, { clientId, accessKey }, msg);
};
