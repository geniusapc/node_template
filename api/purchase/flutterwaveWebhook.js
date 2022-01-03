/* eslint eqeqeq:"off", func-names:"off" */
const Payment = require('../../models/Payment');
const CoopInvoice = require('../../models/Invoice');
const User = require('../../models/User');
const sendMail = require('../../utils/email/paymentReceipt');

const { purchaseAlert } = require('../../utils/sms/purchaseAlert');
const reduceProductQuantity = require('../../utils/product/reduceProductQuantity');

module.exports = async (req, res) => {
  const { orderRef, paymentRef } = req.body;

  const result = await Payment.findOne({ orderRef, paymentRef });
  const invoice = await CoopInvoice.findOne({ orderRef });

  if (result || !invoice) throw new Error('');

  const {
    user: { id: userId },
  } = invoice;

  const user = await User.findById(userId);
  if (!user) throw new Error('Invalid user');

  const paymentDetails = {
    ...req.body,
    platformId: user.platformId,
    userId: invoice.user.id,
    invoice: invoice._id,
  };

  if (paymentDetails.status === 'successful') {
    await Payment.create(paymentDetails);
    await CoopInvoice.updateOne({ orderRef }, { txIsValid: true });
    await purchaseAlert();
    await sendMail({ paymentDetails, invoice });
    await reduceProductQuantity({ invoice });
  }

  return res.sendStatus(200);
};
