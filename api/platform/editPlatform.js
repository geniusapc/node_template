const Platform = require('../../models/Platform');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  await Platform.updateOne({ _id: req.params.platformId }, req.body);

  const msg = 'Platform updated successfully';
  return response(res, next, 200, null, msg);
};
