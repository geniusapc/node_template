/* eslint eqeqeq:"off", func-names:"off" */
const Invoice = require('../../models/Invoice');
const calculateProfit = require('../../utils/product/calculateProfit');

const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const invoice = await Invoice.find({ txIsValid: true });
  const purchasedProducts = calculateProfit(invoice);
  const message = 'success';
  return response(res, next, 200, purchasedProducts, message);
};
