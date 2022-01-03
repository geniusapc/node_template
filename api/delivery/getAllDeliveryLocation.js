const DeliveryLocation = require('../../models/DeliveryLocation');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { permission } = req.user;
  let condition = {};

  const filter =
    permission === 'admin'
      ? []
      : ['-price', '-createdAt', '-updatedAt', '-address', '-type', '-__v'];

  if (req.cooperative)
    condition = { city: { $in: req.user.location }, type: 'door delivery' };

  const deliveryLocation = await DeliveryLocation.find(condition).select(
    filter
  );

  const msg = 'Delivery location retrieved successfully';
  return response(res, next, 200, deliveryLocation, msg);
};
