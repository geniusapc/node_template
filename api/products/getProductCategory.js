const ProductCategory = require('../../models/ProductCategory');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const categories = await ProductCategory.find({})
    .select(['-updatedAt', '-__v'])
    .sort({ name: 1 });

  const msg = 'Product categories retrieved successfully';
  return response(res, next, 200, categories, msg);
};
