'use client';

import { useState } from 'react';
import { useCustomer } from '@/context/CustomerContext';

export default function SettingsPage() {
  const { customer } = useCustomer();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!customer) return null;

  async function handleChangePassword(e) {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      // Verify the current password is correct before allowing the change
      const verifyRes = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: customer.email, password: currentPassword }),
      });
      if (!verifyRes.ok) {
        setError('Current password is incorrect.');
        setSaving(false);
        return;
      }

      const updateRes = await fetch(`/api/customers/${customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: newPassword }),
      });
      if (!updateRes.ok) throw new Error('Failed to update password');

      setMessage('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError("Couldn't update password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="settings" className="account-card">
      <div className="card-header">
        <h2>Account Settings</h2>
        <p>Update your password to keep your account secure.</p>
      </div>
      <form id="change-password" className="account-form" onSubmit={handleChangePassword}>
        <div className="form-group">
          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            id="current-password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p style={{ color: '#c0392b', fontSize: '13px' }}>{error}</p>}
        {message && <p style={{ color: '#2e7d32', fontSize: '13px' }}>{message}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </section>
  );
}
