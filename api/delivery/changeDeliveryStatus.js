const Payment = require('../../models/Payment');
const Invoice = require('../../models/Invoice');
const giftToken = require('../../utils/cashToken/giftToken');
const { response } = require('../../utils/response');

const sendDeliveryStatus = () => {};

module.exports = async (req, res, next) => {
  const { id } = req.user;
  const { deliveryStatus, orderRef } = req.body;

  const invoice = await Invoice.findOne({ orderRef });
  const payment = await Payment.findOne({ orderRef });

  if (!payment || !invoice) throw new Error('Invalid orderRef');

  if (payment.deliveryStatus === 'delivered')
    throw new Error('Item has already been delivered');

  await Payment.updateOne(
    { orderRef, status: 'successful' },
    {
      deliveryStatus,
      $push: { processingInfo: { type: deliveryStatus, confirmedBy: id } },
    }
  );

  await giftToken(invoice);
  sendDeliveryStatus(invoice);
  const msg = 'delivery status updated successfully';
  return response(res, next, 200, null, msg);
};
