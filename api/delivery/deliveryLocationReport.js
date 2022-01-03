const moment = require('moment');
const Payment = require('../../models/Payment');
const DeliveryLocation = require('../../models/DeliveryLocation');
const { response } = require('../../utils/response');

module.exports = async (req, res, next) => {
  const defaultStartDate = moment().startOf('month');
  const defaultEndDate = moment().endOf('month');
  const { startDate = defaultStartDate, endDate = defaultEndDate } = req.query;

  const location = await DeliveryLocation.find({})
    .select(['city', 'area'])
    .sort({ area: 1 });

  const condition = {
    createdAt: { $gt: startDate, $lt: endDate },
    deliveryStatus: 'delivered',
    status: 'successful',
  };

  const payment = await Payment.find(condition)
    .select('invoice')
    .populate('invoice', 'products delivery');

  const orders = payment.map((e) => e.invoice).flat();


  const deliveryReport = location.map((e) => {
    const deliveries = orders.filter(
      (order) =>
        order.delivery.area === e.area && order.delivery.city === e.city
    );
    return { name: e.area, totalDeliveries: deliveries.length };
  });

  const message = 'delivery location report retrieved successfully';
  return response(res, next, 200, deliveryReport, message);
};
