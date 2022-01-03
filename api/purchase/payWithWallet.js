const { v4: uuidv4 } = require('uuid');

const Invoice = require('../../models/Invoice');
const Payment = require('../../models/Payment');
const User = require('../../models/User');
const sendMail = require('../../utils/email/paymentReceipt');
// const { purchaseAlert } = require('../../utils/sms/purchaseAlert');
// const {
//   reduceProductQuantity,
// } = require('../../utils/product/reduceProductQuantity');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { orderRef, transactionPin } = req.body;

  const invoice = await Invoice.findOne({ orderRef }).lean();
  if (!invoice) throw new Error(`Order reference ${orderRef} not found`);
  const amount = invoice.totalPrice;

  const result = await Payment.findOne({ orderRef });
  if (result) throw new Error('Payment has been verified already');

  const payload = {
    orderRef,
    amount,
    status: 'successful',
    paymentType: 'wallet',
    userId: invoice.user.id,
    platformId: invoice.platformId,
    paymentRef: uuidv4(),
    invoice: invoice._id,
  };

  if (!transactionPin) throw new Error('Transaction Pin required');

  const user = await User.findById(invoice.user.id);
  if (!user) throw new Error('User does not exist');

  const pinIsValid = await user.compareTransactionPin(transactionPin);
  if (!pinIsValid) throw new Error('Invalid transaction pin');

  const { wallet } = user;

  if (wallet.status !== 'enabled') throw new Error('Your wallet is disabled');
  if (wallet.balance < amount) throw new Error('Insufficient balance');

  await User.updateOne(
    { _id: invoice.user.id },
    { 'wallet.balance': wallet.balance - amount }
  );

  await Payment.create(payload);

  await Invoice.updateOne({ orderRef }, { txIsValid: true });

  // await purchaseAlert(); // had issue sending message
  await sendMail({
    paymentDetails: { amount },
    invoice: { orderRef, user: { name: user.name, email: user.email } },
  });
  // await reduceProductQuantity({ invoice });

  const message = 'Payment verified  successfully';
  return response(res, next, 200, null, message);
};
