const Products = require('../../models/Products');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const select = [
    'title',
    'category',
    'variantId',
    'state',
    'image',
    'defaultVariant',
  ];
  const products = await Products.find({}).select(select).lean();

  const modifiedProducts = products.map((product) => {
    const variants = product.variants.reduce((cumm, { unit, basePrice }) => {
      const valid = cumm.find((variant) => variant.unit === unit);
      return !valid ? [...cumm, { unit, basePrice }] : cumm;
    }, []);

    const prod = { ...product, variants };
    delete prod.platform;

    return prod;
  });

  const msg = 'Product list retrieved successfully';
  return response(res, next, 200, modifiedProducts, msg);
};
