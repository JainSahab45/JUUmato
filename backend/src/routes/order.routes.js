const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware.authUserMiddleware, orderController.createOrder);
router.get('/my', authMiddleware.authUserMiddleware, orderController.getMyOrders);
router.get('/partner', authMiddleware.authfoodpartnermiddle, orderController.getPartnerOrders);
router.get('/delivery', authMiddleware.authDeliveryPartnerMiddleware, orderController.getDeliveryOrders);
router.patch('/:id/status', authMiddleware.authfoodpartnermiddle, orderController.updateOrderStatus);
router.patch('/:id/delivery-status', authMiddleware.authDeliveryPartnerMiddleware, orderController.updateDeliveryStatus);
router.patch('/:id/cancel', authMiddleware.authUserMiddleware, orderController.cancelOrder);

module.exports = router;
