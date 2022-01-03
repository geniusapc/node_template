const Product = require('../../models/Products');
const ProductVariant = require('../../models/ProductVariant');
const { response } = require('../../utils/response');
const generateVariantId = require('../../utils/randomCode/generateUniqueId');

module.exports = async (req, res, next) => {
  const products = await Product.find({}).select(['variantId']);
  const variantId = generateVariantId(products);

  const variants = req.body.platform
    .map((e) =>
      e.variant.map((p) => ({ ...p, platformId: e.platformId, variantId }))
    )
    .flat();

  const visibleTo = req.body.platform.map((e) => e.platformId).flat();

  delete req.body.platform;

  const product = await Product.create({
    ...req.body,
    uploadedBy: req.user.id,
    variantId,
    visibleTo,
  });

  await ProductVariant.create(variants);
  const message = 'Product uplaoded successfully';
  return response(res, next, 200, product, message);
};
