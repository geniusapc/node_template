const { v4: uuidV4 } = require('uuid');
const Products = require('../../models/Products');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { productId } = req.body;

  const filter = ['-createdAt', '-updatedAt'];
  const product = await Products.findById(productId).select(filter).lean();
  if (!product) throw new Error('Invalid product reference');

  if (!product.tag) {
    const tag = uuidV4();
    product.tag = tag;
    await Products.updateOne({ _id: productId }, { tag });
  }

  const {
    title,
    description,
    price,
    marketPrice,
    unit,
    conversionUnit,
    visibility,
  } = req.body;

  const basePrice = product.supply.landingCost / conversionUnit || 0;
  const quantity =
    (product.quantity / product.conversionUnit) * conversionUnit || 0;

  req.body = {
    ...product,

    quantity,
    basePrice,
    title,
    description,
    price,
    marketPrice,
    unit,
    conversionUnit,
    visibility,
  };
  delete req.body._id;

  await Products.create(req.body);
  const message = 'Product uplaoded successfully';
  return response(res, next, 201, null, message);
};
