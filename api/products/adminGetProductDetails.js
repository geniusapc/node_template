const Products = require('../../models/Products');
const Invoice = require('../../models/Invoice');
const purchaseHistory = require('../../utils/product/purchaseHistory');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Products.findOne({ _id: productId })
    .select(['-__v', '-updatedAt'])
    .populate('uploadedBy', ['name', 'email'])
    .populate('updatedBy', ['name', 'email'])
    .populate('variants', ['-createdAt', '-updatedAt'])
    .select(['-__v', '-updatedAt'])
    .lean();

  const orders = await Invoice.find({
    txIsValid: true,
    'products.id': productId,
  }).select('products');

  const {
    totalPurchasedQuantity = 0,
    totalNumberOfPurchase = 0,
    totalPurchasedprofit = 0,
  } = purchaseHistory(orders, [productId])[0];

  product.totalNumberOfPurchase = totalNumberOfPurchase;
  product.totalPurchasedQuantity = totalPurchasedQuantity;
  product.totalPurchasedprofit = totalPurchasedprofit;

  const msg = 'Product retrieved successfully';
  return response(res, next, 200, product, msg);
};
