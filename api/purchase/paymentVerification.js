const { v4: uuidv4 } = require('uuid');
const Invoice = require('../../models/Invoice');
const Payment = require('../../models/Payment');
const sendMail = require('../../utils/email/paymentReceipt');

const { purchaseAlert } = require('../../utils/sms/purchaseAlert');
const { response } = require('../../utils/response');
const reduceProductQuantity = require('../../utils/product/reduceProductQuantity');

module.exports = async (req, res, next) => {
  const { platformId } = req.user;
  const { orderRef, paymentType, amount } = req.body;

  const invoice = await Invoice.findOne({ orderRef }).lean();
  if (!invoice) throw new Error(`Order reference ${orderRef} not found`);

  const result = await Payment.findOne({ orderRef });
  if (result) throw new Error('Payment has been verified already');

  if (amount < invoice.totalPrice)
    throw new Error('Amount is less than invoice amount');

  const payload = {
    platformId,
    orderRef,
    paymentType,
    amount,
    status: 'successful',
    paymentRef: uuidv4(),
    userId: invoice.user.id,
    invoice: invoice._id,
  };

  const paymentDetails = await Payment.create(payload);

  await Invoice.updateOne({ orderRef }, { txIsValid: true });

  await purchaseAlert();
  await sendMail({ paymentDetails, invoice });
  await reduceProductQuantity({ invoice });

  const message = 'Payment verified  successfully';
  return response(res, next, 200, null, message);
};
