const ProductCategory = require('../../models/ProductCategory');
const Products = require('../../models/Products');
const Invoice = require('../../models/Invoice');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  let categories = await ProductCategory.find({})
    .select(['-updatedAt', '-__v'])
    .sort({ name: 1 })
    .lean();

  const products = await Products.find().select(['category']).lean();
  const invoice = await Invoice.find().select(['products']).lean();
  const orders = invoice.map((e) => e.products).flat();

  categories = categories.map((e) => {
    const productsCount = products.filter((prod) => prod.category === e.name)
      .length;

    const numberOfPurchase = orders.filter((order) => order.category === e.name)
      .length;

    return { ...e, productsCount, numberOfPurchase };
  });

  const msg = 'Product categories retrieved successfully';
  return response(res, next, 200, categories, msg);
};
