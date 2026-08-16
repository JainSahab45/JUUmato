import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#8b5cf6',
  ready: '#14b8a6',
  'on-the-way': '#ef4444',
  delivered: '#22c55e',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/orders/my', { withCredentials: true })
      .then((response) => setOrders(response.data.orders || []))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 16px 80px' }}>
      <h1 style={{ marginTop: 0, marginBottom: 20 }}>My orders</h1>

      {orders.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 24, border: '1px solid rgba(0,0,0,0.06)' }}>
          No orders yet. Start with your campus favorites.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {orders.map((order) => (
            <div key={order._id} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <div>
                  <div style={{ color: '#ef4444', fontWeight: 800, letterSpacing: '0.08em', fontSize: 12 }}>ORDER #{String(order._id).slice(-6).toUpperCase()}</div>
                  <div style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <span style={{ background: `${statusColors[order.status] || '#ef4444'}20`, color: statusColors[order.status] || '#ef4444', padding: '6px 10px', borderRadius: 999, fontWeight: 700, textTransform: 'capitalize' }}>
                  {order.status}
                </span>
              </div>

              <div style={{ display: 'grid', gap: 8 }}>
                {order.items.map((item, index) => (
                  <div key={`${order._id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span>{item.name} × {item.quantity}</span>
                    <strong>₹{(item.price || 0) * (item.quantity || 1)}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)', fontWeight: 700 }}>
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>

              <div style={{ marginTop: 12 }}>
                <Link to={`/tracking/${order._id}`} style={{ color: '#b91c1c', fontWeight: 700 }}>Track order</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
