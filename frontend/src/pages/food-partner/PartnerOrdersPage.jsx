import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'on-the-way', 'delivered'];

const PartnerOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/orders/partner', { withCredentials: true })
      .then((response) => setOrders(response.data.orders || []))
      .catch(() => setOrders([]));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:3000/api/orders/${id}/status`, { status }, { withCredentials: true });
    setOrders((prev) => prev.map((order) => order._id === id ? { ...order, status } : order));
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 16px 80px' }}>
      <h1 style={{ marginTop: 0 }}>Partner orders</h1>

      {orders.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 18, padding: 20, border: '1px solid rgba(0,0,0,0.06)' }}>
          No orders yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {orders.map((order) => (
            <div key={order._id} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#b91c1c' }}>Order #{String(order._id).slice(-6).toUpperCase()}</div>
                  <div style={{ color: '#4b5563', marginTop: 4 }}>Customer: {order.user?.username || 'Student'}</div>
                  <div style={{ color: '#4b5563' }}>{order.hostel} • {order.deliveryAddress}</div>
                </div>
                <div style={{ fontWeight: 700 }}>₹{order.totalAmount}</div>
              </div>

              <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                {order.items.map((item, index) => (
                  <div key={`${order._id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span>{item.name} × {item.quantity}</span>
                    <strong>₹{(item.price || 0) * (item.quantity || 1)}</strong>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'grid', gap: 6, maxWidth: 260 }}>
                  <span style={{ fontWeight: 600 }}>Update order status</span>
                  <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)' }}>
                    {statusFlow.map((step) => (
                      <option key={step} value={step}>{step}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerOrdersPage;
