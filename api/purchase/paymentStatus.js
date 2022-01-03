const Payment = require('../../models/Payment');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const paymentStatus = await Payment.findOne({
    orderRef: req.params.orderRef,
    status: 'successful',
  }).select({ status: 1 });
  const message = paymentStatus ? 'Payment successfully' : 'Payment failed';
  return response(res, next, 200, paymentStatus, message);
};
