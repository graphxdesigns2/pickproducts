'use client';

import { useState } from 'react';
import { useCustomer } from '@/context/CustomerContext';

export default function SettingsPage() {
  const { customer } = useCustomer();
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          <div className="password-input-wrap">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="current-password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowCurrentPassword((v) => !v)}
              aria-label={showCurrentPassword ? "Hide password" : "Show password"}
            >
              {showCurrentPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <path d="M1 1l22 22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <div className="password-input-wrap">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <div className="password-input-wrap">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
