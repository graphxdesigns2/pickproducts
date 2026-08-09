'use client';

import { useState, useEffect } from 'react';
import { useCustomer } from '@/context/CustomerContext';

export default function AccountOverviewPage() {
  const { customer, refreshCustomer } = useCustomer();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Sync state when customer data loads from Context
  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || customer.first_name || '',
        lastName: customer.lastName || customer.last_name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        street: customer.address?.street || customer.address?.line1 || '',
        city: customer.address?.city || '',
        state: customer.address?.state || customer.address?.province || '',
        postalCode: customer.address?.postalCode || customer.address?.postal_code || '',
        country: customer.address?.country || 'Canada',
      });
    }
  }, [customer]);

  if (!customer) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      };

      const res = await fetch(`/api/customers/${customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update account details');

      if (refreshCustomer) {
        await refreshCustomer();
      }

      setMessage('Account details updated successfully.');
    } catch (err) {
      setError('Failed to update account details. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="account-overview-container">
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <section id="personal-info" className="account-card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2>Personal Information</h2>
            <p>Update your personal details below.</p>
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Phone Number */}
        <section id="phone" className="account-card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2>Phone Number</h2>
            <p>Your main contact number for delivery updates.</p>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Email Address */}
        <section id="email" className="account-card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2>Email Address</h2>
            <p>Your primary email address associated with this account.</p>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
            <small style={{ color: '#888', marginTop: '4px', display: 'block' }}>
              Email address cannot be changed directly for security reasons.
            </small>
          </div>
        </section>

        {/* Shipping Address */}
        <section id="shipping-address" className="account-card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2>Shipping Address</h2>
            <p>Your default destination for orders.</p>
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="street">Street Address</label>
            <input
              type="text"
              id="street"
              name="street"
              placeholder="123 Duke St"
              value={formData.street}
              onChange={handleChange}
            />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State / Province</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Status Messages and Action Button */}
        {error && <p style={{ color: '#c0392b', fontSize: '14px', marginBottom: '1rem' }}>{error}</p>}
        {message && <p style={{ color: '#2e7d32', fontSize: '14px', marginBottom: '1rem' }}>{message}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}