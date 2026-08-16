import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [hostel, setHostel] = useState('B-Block');
  const [deliveryAddress, setDeliveryAddress] = useState('Room 204, Hostel B, Campus');
  const [deliveryNotes, setDeliveryNotes] = useState('Please ring bell and leave at the desk');
  const [paymentMethod, setPaymentMethod] = useState('cash-on-delivery');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('juumato-cart') || '[]')
    setCart(saved)
  }, [])

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.price || 100) * (item.quantity || 1), 0),
    [cart]
  );

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
      localStorage.setItem('juumato-cart', JSON.stringify(updated))
      return updated
    });
  };

  const placeOrder = async () => {
    setLoading(true);

    try {
      const payload = {
        hostel,
        deliveryAddress,
        deliveryNotes,
        paymentMethod,
        items: cart.map((item) => ({
          foodId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await axios.post('http://localhost:3000/api/orders', payload, {
        withCredentials: true,
      });

      if (response.data.order?._id) {
        localStorage.setItem('juumato-cart', JSON.stringify([]))
        navigate(`/tracking/${response.data.order._id}`);
      }
    } catch (error) {
      console.error('Order failed', error);
      alert(error?.response?.data?.message || 'Unable to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px 80px' }}>
      <div style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, color: '#ef4444', letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 12 }}>JUUMATO</p>
            <h1 style={{ margin: '8px 0 0', fontSize: '2rem' }}>Your cart</h1>
          </div>
          <button type="button" onClick={() => navigate('/')} style={{ border: 'none', background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 999, fontWeight: 700, cursor: 'pointer' }}>
            Keep shopping
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: 18, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}>
          {cart.map((item) => (
            <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.name}</div>
                <div style={{ color: '#6b7280', fontSize: 14 }}>{item.foodPartner}</div>
                <div style={{ marginTop: 6, fontWeight: 700 }}>₹{item.price}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(0,0,0,0.08)', padding: '6px 8px', borderRadius: 999 }}>
                <button type="button" onClick={() => updateQuantity(item._id, -1)} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}>−</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item._id, 1)} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}>+</button>
              </div>

              <div style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: 18 }}>
            <h2 style={{ marginTop: 0 }}>Delivery details</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Hostel</span>
                <input value={hostel} onChange={(e) => setHostel(e.target.value)} style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)' }} />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Delivery address</span>
                <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={3} style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)', resize: 'vertical' }} />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Delivery note</span>
                <textarea value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} rows={2} style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)', resize: 'vertical' }} />
              </label>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: 18 }}>
            <h2 style={{ marginTop: 0 }}>Payment</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                ['cash-on-delivery', 'Cash on delivery'],
                ['upi', 'UPI'],
                ['wallet', 'Campus wallet'],
              ].map(([value, label]) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="radio" name="paymentMethod" checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div style={{ marginTop: 22, borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 16, display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <strong>₹{subtotal}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery</span>
                <strong>₹30</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800 }}>
                <span>Total</span>
                <span>₹{subtotal + 30}</span>
              </div>
              <button type="button" onClick={placeOrder} disabled={loading || cart.length === 0} style={{ marginTop: 16, padding: '14px 18px', border: 'none', borderRadius: 14, background: 'linear-gradient(135deg, #d62424, #8f1a1a)', color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Placing order...' : 'Place order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
