import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth-shared.css';

const DeliveryPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      vehicle: formData.get('vehicle'),
      zone: formData.get('zone'),
      password: formData.get('password'),
    };

    await axios.post('http://localhost:3000/api/auth/delivery-partner/register', payload, {
      withCredentials: true,
    });

    navigate('/delivery-partner/dashboard');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="delivery-register-title">
        <header>
          <div className="auth-brand">
            <div className="brand-mark">J</div>
            <div className="brand-copy">
              <span className="brand-name">JUUMATO</span>
              <span className="brand-product">Delivery partner</span>
            </div>
          </div>
          <h1 id="delivery-register-title" className="auth-title">Join as rider</h1>
          <p className="auth-subtitle">Deliver food quickly across campus and nearby hostels.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" type="text" placeholder="Aman Verma" autoComplete="name" required />
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="rider@juumato.com" autoComplete="email" required />
          </div>
          <div className="field-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" placeholder="9876543210" autoComplete="tel" required />
          </div>
          <div className="field-group">
            <label htmlFor="vehicle">Vehicle</label>
            <input id="vehicle" name="vehicle" type="text" placeholder="Bike / Scooter" defaultValue="Bike" required />
          </div>
          <div className="field-group">
            <label htmlFor="zone">Delivery zone</label>
            <input id="zone" name="zone" type="text" placeholder="North Gate / B-Block" required />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Create password" autoComplete="new-password" required />
          </div>
          <button className="auth-submit" type="submit">Create delivery account</button>
        </form>

        <div className="auth-alt-action">
          Already delivering? <a href="/delivery-partner/login">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartnerRegister;
