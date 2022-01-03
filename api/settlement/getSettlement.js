/* eslint eqeqeq:"off", func-names:"off" */
const Settlement = require('../../models/Settlement');

const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { platformId, permission } = req.user;

  let condition = {};

  if (permission !== 'admin') condition = { platformId };

  const settlement = await Settlement.find(condition);

  const message = 'Settlement retrieved  successfully';
  return response(res, next, 200, settlement, message);
};
