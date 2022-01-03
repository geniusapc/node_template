const ProductCategory = require('../../models/ProductCategory');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  const category = await ProductCategory.findByIdAndUpdate(
    { _id: categoryId },
    { name },
    { new: true }
  );

  const msg = 'Product category updated successfully';
  return response(res, next, 200, category, msg);
};
