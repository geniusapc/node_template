/* eslint eqeqeq:"off", func-names:"off" */
const Payment = require('../../models/Payment');

const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { id } = req.user;
  const invoice = await Payment.find({ userId: id }).populate('invoice');

  const message = 'Payment retrieved successfully';
  return response(res, next, 200, invoice, message);
};
