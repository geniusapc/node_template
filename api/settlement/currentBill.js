/* eslint eqeqeq:"off", func-names:"off" */
const Payment = require('../../models/Payment');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { platformId } = req.user;

  const conditions = {
    status: 'successful',
    settlementInvoiceIsGenerated: { $not: { $eq: true } },
    platformId,
    paymentType: { $in: ['fcWallet', 'coopWallet'] },
    deliveryStatus: 'delivered',
  };

  const filter = ['orderRef', 'amount', 'platformId'];

  const settlement = await Payment.find(conditions).select(filter);

  const totalPrice = settlement.reduce((a, { amount }) => a + amount, 0);
  const orderRef = settlement.map((e) => e.orderRef);

  const data = {
    totalPrice,
    orderRef,
    platformId,
  };

  const message = 'Current Bill retrieved  successfully';
  return response(res, next, 200, data, message);
};
