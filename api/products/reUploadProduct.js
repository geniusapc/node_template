const Product = require('../../models/Products');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const { productId } = req.params;

  const {
    price,
    basePrice,
    marketPrice,
    quantity,
    expirationDate,
    supply,
    ref,
  } = req.body;

  const oldStock = await Product.findById(productId).lean();
  if (!oldStock) throw new Error('Invalid product reference');

  const newStock = {
    ...oldStock,
    leftOverStock: oldStock.quantity,
    quantity: quantity + oldStock.quantity,
    price,
    basePrice,
    marketPrice,
    expirationDate,
    supply,
  };

  const products = await Product.find({
    tag: oldStock.tag,
    isSoldOut: false,
    _id: { $ne: newStock._id },
  }).lean();

  if (products.length !== (ref && ref.length))
    throw new Error(
      'You must specify the new price of all the products linked to this product'
    );

  const newProducts = products.map((e) => {
    const newQuantity = (quantity / newStock.conversionUnit) * e.conversionUnit;

    const prodRef = ref.find(
      (reference) => reference.id === e._id.toHexString()
    );

    if (!prodRef)
      throw new Error(
        'You must specify the new price of all the products linked to this product'
      );

    return {
      ...e,
      leftOverStock: e.quantity,
      quantity: newQuantity + e.quantity,
      price: prodRef.price,
      basePrice: prodRef.basePrice,
      marketPrice: prodRef.marketPrice,
      expirationDate,
      supply,
    };
  });

  const newStocks = [...newProducts, newStock];

  newStocks.forEach((item) => {
    /* eslint-disable */
    delete item._id;
    delete item.updatedAt;
    delete item.__v;
    delete item.createdAt;
    /* eslint-enable */
  });

  await Product.updateMany(
    { tag: oldStock.tag },
    { isSoldOut: true, quantity: 0 }
  );

  await Product.create(newStocks);
  const message = 'New stock uplaoded successfully';
  return response(res, next, 201, null, message);
};
