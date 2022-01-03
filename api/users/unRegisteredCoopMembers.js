const UnregisteredCoopMember = require('../../models/UnregisteredCoopMember');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { permission, platformId: cooperativeId } = req.user;
  const filter = ['-__v', '-updatedAt'];

  let condition = { cooperativeId };

  if (permission === 'admin') condition = {};
  const users = await UnregisteredCoopMember.find(condition).select(filter);

  const message = 'users retrieved successfully';
  return response(res, next, 200, users, message);
};
