const Products = require('../../models/Products');
const { response } = require('../../utils/response');
const ProductVariant = require('../../models/ProductVariant');

module.exports = async (req, res, next) => {
  const { productId } = req.params;
  const { platform } = req.body;

  const payload = { ...req.body, updatedBy: req.user.id };
  let variants;

  if (platform && platform.length) {
    const visibleTo = platform.map((e) => e.platformId).flat();
    if (visibleTo) payload.visibleTo = visibleTo;
  }

  const product = await Products.findByIdAndUpdate(
    { _id: productId },
    payload,
    { new: true }
  );

  if (platform.length) {
    const { variantId } = product;
    variants = platform
      .map((e) =>
        e.variant.map((p) => ({ ...p, platformId: e.platformId, variantId }))
      )
      .flat();
    await ProductVariant.deleteMany({ variantId });
    await ProductVariant.create(variants);
  }

  if (!product) throw new Error('Invalid product');

  const message = 'Products edited successfully';
  return response(res, next, 200, product, message);
};
