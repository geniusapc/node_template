const Invoice = require('../../models/Invoice');
const Products = require('../../models/Products');
const Platform = require('../../models/Platform');

const validateProdAvailibility = require('../../utils/product/validateProdAvailibility');
const checkDelivery = require('../../utils/product/checkDelivery');
const generateUniqueRef = require('../../utils/product/uniqueOrderRef');
const { response } = require('../../utils/response');
const { PLATFORM } = require('../../constants');

module.exports = async (req, res, next) => {
  let { platformId } = req.user;
  const { products, delivery: deliveryInput, user } = req.body;
  const productIds = products.map((product) => product.id);

  const select = ['-supply', '-vendor'];

  const dbProduct = await Products.find({ _id: { $in: productIds } })
    .select(select)
    .lean();

  const defaultPlatform = await Platform.findOne({ name: PLATFORM.DEFAULT });
  platformId = platformId || req.params.platformId || defaultPlatform._id;

  const prod = validateProdAvailibility(products, dbProduct, platformId);
  const sumTotal = (cumm, { price, qty }) => cumm + price * qty;
  const totalPrice = prod.reduce(sumTotal, 0);
  const delivery = await checkDelivery(deliveryInput, totalPrice);
  const invoice = await Invoice.find({}).select(['orderRef']).lean();
  const orderRef = await generateUniqueRef(invoice, 'FC');

  const invoicePayload = {
    user,
    platformId,
    products: prod,
    orderRef,
    delivery,
    totalPrice: totalPrice + (delivery.price || 0),
  };

  await Invoice.create(invoicePayload);

  invoicePayload.products.forEach((e) => {
    delete e.basePrice;
  });
  const message = 'Invoice generated successfully';
  return response(res, next, 200, invoicePayload, message);
};
