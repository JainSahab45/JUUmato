const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
    default: 'Bike',
  },
  zone: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const DeliveryPartnerModel = mongoose.model('deliveryPartner', deliveryPartnerSchema);

module.exports = DeliveryPartnerModel;
