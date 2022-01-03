const Products = require('../../models/Products');
const Platform = require('../../models/Platform');
const { response } = require('../../utils/response');
const { PLATFORM } = require('../../constants');

const createPlatformField = (products) => {
  let prods;
  if (products.docs.length) {
    prods = products.docs.map((product) => {
      const variant = product.variants.map((pf) => pf);
      const platformId = variant.map((r) => r.platformId).flat();
      product.platform = [{ platformId, variant }];
      return product;
    });
    products.docs = prods;
  }
  return products;
};

const prodIsAvailableForPlatform = (products, platformId) => {
  if (products.docs.length && platformId) {
    products.docs.forEach((product) => {
      /* eslint no-param-reassign : off */
      product.variants = product.variants.filter((pf) =>
        pf.platformId.map((e) => e.toString()).includes(platformId.toString())
      );
    });
  }
  return products;
};

module.exports = async (req, res, next) => {
  let { platformId } = req.user;
  const { perPage, page, category, q, state } = req.query;

  const condition = { isSoldOut: false };

  const select = ['-__v', '-updatedAt'];

  const options = {
    select,
    sort: { createdAt: -1 },
    lean: true,
  };
  let products;

  if (!perPage && !page) options.pagination = false;
  if (page) options.page = parseInt(page, 10) || 1;
  if (perPage) options.limit = parseInt(perPage, 10) || 10;

  if (category) condition.category = category;
  if (q) condition.title = { $regex: q, $options: 'i' };
  if (state) condition.state = state;

  const defaultPlatform = await Platform.findOne({ name: PLATFORM.DEFAULT });
  platformId = platformId || defaultPlatform._id;
  condition.visibleTo = platformId;

  if (req.user.permission === 'admin') {
    platformId = req.query.platformId;
    products = await Products.paginate(condition, options);
  
    products = prodIsAvailableForPlatform(products, platformId);
    products = createPlatformField(products);
  } else {
    condition.visibility = 'on';
    options.select = [
      ...select,
      '-supply',
      '-isSoldOut',
      '-expirationDate',
      '-visibility',
      '-createdAt',
    ];

    products = await Products.paginate(condition, options);

    products = prodIsAvailableForPlatform(products, platformId);
    products = createPlatformField(products);
  }

  const msg = 'Products retrieved successfully';
  return response(res, next, 200, products, msg);
};
