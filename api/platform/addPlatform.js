const { v4: uuidv4 } = require('uuid');
const Platform = require('../../models/Platform');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  req.body.apiKey = uuidv4();
  await Platform.create(req.body);

  const msg = 'Platform created successfully';
  return response(res, next, 200, null, msg);
};
