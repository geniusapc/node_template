const Platform = require('../../models/Platform');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { platformId } = req.user;

  const cooperative = await Platform.findById(platformId).select([
    'name',
    'logo',
    'plateform',
    'permission',
    'deliveryWebhookUrl',
    'authUrl',
  ]);

  return response(res, next, 200, cooperative);
};
