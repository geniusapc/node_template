const { v4: uuidv4 } = require('uuid');
const Invoice = require('../../models/Invoice');
const Payment = require('../../models/Payment');
const sendMail = require('../../utils/email/paymentReceipt');
const { purchaseAlert } = require('../../utils/sms/purchaseAlert');
const reduceProductQuantity = require('../../utils/product/reduceProductQuantity');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { id } = req.user;
  const { orderRef, amount, status, paymentType } = req.body;

  const invoice = await Invoice.findOne({ orderRef });
  if (!invoice) throw new Error(`Order reference ${orderRef} not found`);

  const result = await Payment.findOne({ orderRef });
  if (result) throw new Error('Payment has been verified already');

  const payload = {
    confirmedBy: id,
    orderRef,
    amount,
    chargedAmount: amount,
    status,
    paymentType,
    userId: invoice.user.id,
    platformId: invoice.platformId,
    paymentRef: uuidv4(),
    invoice: invoice._id,
  };

  await Payment.create(payload);
  invoice.txIsValid = true;
  await invoice.save();

  await purchaseAlert();
  const { name, email } = invoice.user;
  await sendMail({
    paymentDetails: { amount },
    invoice: { orderRef, user: { name, email } },
  });

  await reduceProductQuantity({ invoice });

  const message = 'Payment verified  successfully';
  return response(res, next, 200, null, message);
};
