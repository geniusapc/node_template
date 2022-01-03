const Payment = require('../../models/Payment');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { permission, platformId } = req.user;
  const { startDate, endDate, orderRef, status } = req.query;

  let condition = {};

  if (orderRef) condition.orderRef = { $in: orderRef };
  if (platformId) condition.platformId = platformId;
  if (status) condition.status = status;

  if (startDate && endDate)
    condition.createdAt = { $gt: startDate, $lt: endDate };

  if (permission !== 'admin') {
    condition = {
      ...condition,
      platformId,
      paymentType: { $ne: 'flutterwave' },
    }; // coop admin see all payment that is not flutter payment
  }

  const invoice = await Payment.find(condition)
    .sort({ createdAt: -1 })
    .populate('invoice');

  const message = 'Payment retrieved successfully';
  return response(res, next, 200, invoice, message);
};
