const Products = require('../../models/Products');
const Platform = require('../../models/Platform');
const { response } = require('../../utils/response');
const { PLATFORM } = require('../../constants');

const prodIsAvailableForPlatform = (product, platformId) => {
  let checkedProd = { ...product };
  if (product && platformId) {
    checkedProd.variants = product.variants.filter((pf) =>
      pf.platformId.map((e) => e.toString()).includes(platformId.toString())
    );
  }

  if (!checkedProd.variants.length || !product)
    checkedProd = null;

  return checkedProd;
};

const createPlatformField = (product) => {
  const prod = product;
  if (product && !product.platform) {
    const variant = product.variants.map((pf) => pf);
    const platformId = variant.map((r) => r.platformId).flat();
    prod.platform = [{ platformId, variant }];
    return prod;
  }
  return prod;
};

module.exports = async (req, res, next) => {
  let { platformId } = req.user;
  const { productId } = req.params;

  const defaultPlatform = await Platform.findOne({ name: PLATFORM.DEFAULT });
  platformId = platformId || defaultPlatform._id;

  const condition = { _id: productId };
  let filter = ['-__v', '-updatedAt'];
  let product;

  if (req.user.permission === 'admin') {
    platformId = req.query.platformId;
    product = await Products.findOne(condition)
      .populate('variants', ['-createdAt', '-updatedAt'])
      .select(filter)
      .lean();
    // product = prodIsAvailableForPlatform(product, platformId); //admin shoud see all platform but diz affcts the user end
    product = createPlatformField(product);
  } else {
    condition.visibility = 'on';
    filter = [
      ...filter,
      '-supply',
      '-isSoldOut',
      '-expirationDate',
      '-visibility',
      '-createdAt',
    ];


    product = await Products.findOne(condition)
      .populate('variants', ['-createdAt', '-updatedAt'])
      .select(filter)
      .lean();

    product = prodIsAvailableForPlatform(product, platformId);
    product = createPlatformField(product);
  }

  const msg = 'Product retrieved successfully';
  return response(res, next, 200, product, msg);
};
