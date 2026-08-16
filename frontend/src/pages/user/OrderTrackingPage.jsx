import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const statusFlow = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'on-the-way',
  'delivered',
];

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#8b5cf6',
  ready: '#14b8a6',
  'on-the-way': '#ef4444',
  delivered: '#22c55e',
};

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/api/orders/my', { withCredentials: true })
      .then((response) => {
        const found = (response.data.orders || []).find((item) => item._id === id);
        setOrder(found || null);
      })
      .catch(() => setOrder(null));
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    setCancelling(true);
    try {
      const response = await axios.patch(`http://localhost:3000/api/orders/${id}/cancel`, {}, { withCredentials: true });
      setOrder(response.data.order);
      alert('Order cancelled successfully');
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (!order) {
    return <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 16px' }}>Loading order tracking...</div>;
  }

  const currentIndex = statusFlow.indexOf(order.status || 'pending');
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
      <div style={{ background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: 24 }}>
        <p style={{ margin: 0, color: '#ef4444', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Live order status</p>
        <h1 style={{ margin: '8px 0 16px' }}>Order #{String(order._id).slice(-6).toUpperCase()}</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 700 }}>Delivery to: {order.hostel}</div>
            <div style={{ color: '#4b5563', marginTop: 4 }}>{order.deliveryAddress}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: `${statusColors[order.status] || '#ef4444'}20`, color: statusColors[order.status] || '#ef4444', padding: '8px 12px', borderRadius: 999, fontWeight: 700, textTransform: 'capitalize' }}>
              {order.status}
            </span>
            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                  padding: '8px 12px',
                  borderRadius: 999,
                  fontWeight: 700,
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                  opacity: cancelling ? 0.6 : 1,
                }}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
          {statusFlow.map((step, index) => {
            const isDone = index <= currentIndex;
            return (
              <div key={step} style={{ textAlign: 'center', padding: 12, borderRadius: 14, background: isDone ? '#fee2e2' : '#f3f4f6', border: `1px solid ${isDone ? '#ef4444' : '#e5e7eb'}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'capitalize', color: isDone ? '#991b1b' : '#6b7280' }}>{step}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Order summary</h3>
          {order.items.map((item, idx) => (
            <div key={`${order._id}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <span>{item.name} × {item.quantity}</span>
              <strong>₹{(item.price || 0) * (item.quantity || 1)}</strong>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 800, fontSize: 18 }}>
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
