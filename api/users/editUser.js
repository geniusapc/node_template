const User = require('../../models/User');
const permission = require('../../utils/user/permission');

const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { userId } = req.params;

  const payload = { ...req.body };

  const user = await User.findById(userId);
  if (!user) throw new Error('Invalid User');

  if (payload.wallet && payload.wallet.balance) {
    payload.wallet = {
      ...payload.wallet,
      balance: user.wallet.balance + payload.wallet.balance,
    };
  }

  if (payload.roles || payload.permission) {
    const inputPermission = payload.permission || user.permission;
    const inputRole =
      payload.roles && payload.roles.length ? payload.roles : user.roles;
    const result = permission.find(
      (e) =>
        e.name === inputPermission &&
        inputRole.every((value) => e.roles.includes(value))
    );

    if (!result) throw new Error('Invalid permission/roles combination');
  }

  await User.updateOne({ _id: userId }, payload);

  const message = 'User edited successfully';
  return response(res, next, 200, null, message);
};
