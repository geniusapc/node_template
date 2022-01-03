const ProductCategory = require('../../models/ProductCategory');
const Product = require('../../models/Products');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { categoryId } = req.params;
  const result = await ProductCategory.findByIdAndDelete(categoryId);
  if (!result) throw new Error('Invalid category Id');
  await Product.updateMany({ category: result.name }, { category: 'Others' });

  const msg = 'Product category deleted successfully';
  return response(res, next, 201, null, msg);
};