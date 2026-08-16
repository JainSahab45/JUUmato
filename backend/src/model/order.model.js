const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.ObjectId,
    ref: 'food',
    required: true,
  },
  foodPartner: {
    type: mongoose.Schema.ObjectId,
    ref: 'foodPartner',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true,
  },
  deliveryPartner: {
    type: mongoose.Schema.ObjectId,
    ref: 'deliveryPartner',
    default: null,
  },
  items: [orderItemSchema],
  hostel: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  deliveryNotes: {
    type: String,
    default: '',
  },
  paymentMethod: {
    type: String,
    default: 'cash-on-delivery',
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'on-the-way', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

const OrderModel = mongoose.model('order', orderSchema);

module.exports = OrderModel;
