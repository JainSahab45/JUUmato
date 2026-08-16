const OrderModel = require('../model/order.model');
const foodModel = require('../model/fooditem.model');

async function createOrder(req, res) {
  try {
    const { items, hostel, deliveryAddress, deliveryNotes, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required.' });
    }

    const normalizedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const food = await foodModel.findById(item.foodId || item.food);
      if (!food) {
        return res.status(404).json({ message: 'One or more food items could not be found.' });
      }

      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || 45);
      const nextItem = {
        food: food._id,
        foodPartner: food.foodPartner,
        name: food.name,
        price,
        quantity,
      };

      normalizedItems.push(nextItem);
      totalAmount += price * quantity;
    }

    const order = await OrderModel.create({
      user: req.user._id,
      items: normalizedItems,
      hostel,
      deliveryAddress,
      deliveryNotes: deliveryNotes || '',
      paymentMethod: paymentMethod || 'cash-on-delivery',
      totalAmount,
      status: 'pending',
    });

    return res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating order',
      error: error.message,
    });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await OrderModel.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.food')
      .populate('items.foodPartner', 'name address phone');

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching orders',
      error: error.message,
    });
  }
}

async function getPartnerOrders(req, res) {
  try {
    const orders = await OrderModel.find({ 'items.foodPartner': req.foodPartner._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username email')
      .populate('items.food');

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching partner orders',
      error: error.message,
    });
  }
}

async function getDeliveryOrders(req, res) {
  try {
    const orders = await OrderModel.find({
      $or: [
        { deliveryPartner: req.deliveryPartner._id },
        { deliveryPartner: null },
      ],
      status: { $in: ['ready', 'on-the-way', 'delivered'] } 
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username email')
      .populate('items.food');

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching delivery orders',
      error: error.message,
    });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const allowedStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'on-the-way', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    order.status = status;
    if (status === 'ready' && !order.deliveryPartner) {
      order.deliveryPartner = req.foodPartner?._id || null;
    }
    await order.save();

    return res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating order status',
      error: error.message,
    });
  }
}

async function updateDeliveryStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const allowedStatuses = ['ready', 'on-the-way', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }

    order.deliveryPartner = req.deliveryPartner._id;
    order.status = status;
    await order.save();

    return res.status(200).json({ message: 'Delivery status updated', order });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating delivery status',
      error: error.message,
    });
  }
}

async function cancelOrder(req, res) {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only users can cancel their own orders
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own orders' });
    }

    // Can only cancel if order is pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        message: `Cannot cancel order with status "${order.status}". Only pending and confirmed orders can be cancelled.` 
      });
    }

    order.status = 'cancelled';
    await order.save();

    return res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    return res.status(500).json({
      message: 'Error cancelling order',
      error: error.message,
    });
  }
}

module.exports = { createOrder, getMyOrders, getPartnerOrders, getDeliveryOrders, updateOrderStatus, updateDeliveryStatus, cancelOrder };
