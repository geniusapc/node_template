const Payment = require('../../models/Payment');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { orderRef } = req.params;
  const invoice = await Payment.findOne({ orderRef })
  .populate('confirmedBy', ["name", "email"])
  .populate('processingInfo.confirmedBy', ["name", "email"])
  .populate('invoice');

  const message = invoice ? 'Order retrieved successfully' : 'order not found';
  return response(res, next, 200, invoice, message);
};
