const ProductCategory = require('../../models/ProductCategory');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { name } = req.body;

  const category = await ProductCategory.findOrCreate({ name });

  if (!category.created) {
    throw new Error('Product category already exist');
  }

  const msg = 'Product category created successfully';
  return response(res, next, 200, null, msg);
};
