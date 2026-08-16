import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth-shared.css';

const DeliveryPartnerLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    await axios.post('http://localhost:3000/api/auth/delivery-partner/login', payload, {
      withCredentials: true,
    });

    navigate('/delivery-partner/dashboard');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="delivery-login-title">
        <header>
          <div className="auth-brand">
            <div className="brand-mark">J</div>
            <div className="brand-copy">
              <span className="brand-name">JUUMATO</span>
              <span className="brand-product">Delivery dashboard</span>
            </div>
          </div>
          <h1 id="delivery-login-title" className="auth-title">Welcome rider</h1>
          <p className="auth-subtitle">Pick up, deliver, and update order status.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="rider@juumato.com" autoComplete="email" required />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
          </div>
          <button className="auth-submit" type="submit">Sign in</button>
        </form>

        <div className="auth-alt-action">
          New rider? <a href="/delivery-partner/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartnerLogin;
