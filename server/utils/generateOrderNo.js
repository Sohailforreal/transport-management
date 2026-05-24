const Order = require('../models/Order.model')

const generateOrderNo = async () => {
  const count = await Order.countDocuments()
  return `DEL${String(count + 1).padStart(3, '0')}`
}

module.exports = generateOrderNo