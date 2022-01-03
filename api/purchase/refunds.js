const Invoice = require('../../models/Invoice');

const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { orderRef, refunds } = req.body;

  const invoice = await Invoice.findOne({ orderRef }).lean();

  if (!invoice || !invoice.txIsValid) throw new Error('Invalid orderRef');

  const error = [];

  const payload = refunds.map((r) => {
    const result = invoice.products.find(
      (invoiceProd) =>
        invoiceProd.id.toString() === r.id.toString() &&
        invoiceProd.unit === r.unit
    );

    if (!result) {
      error.push(`${r.title} not found in purchased products`);
      return null;
    }
    if (r.qty > result.qty) {
      error.push(`${r.title} refund quantity exceeds  purchase quantity`);
      return null;
    }
    return { ...result, qty: r.qty };
  });

  if (error.length) throw new Error(error[0]);

  await Invoice.updateOne({ _id: invoice._id }, { refunds: payload });

  return response(res, next, 200, null, 'success');
};
