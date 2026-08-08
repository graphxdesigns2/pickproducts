"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";

export default function AccountPage() {
  const { customer, logout, loading } = useCustomer();
  const router = useRouter();
  const [name, setName] = useState(customer?.name || "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (loading) {
    return <div className="account-page"><div className="account-loading">Loading...</div></div>;
  }

  if (!customer) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  async function handleSaveName() {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEditing(false);
    } catch (err) {
      setSaveError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>My Account</h1>
        <p>Manage your profile and view your order history.</p>
      </div>

      <div className="account-grid">
        <div className="account-card">
          <div className="account-card-head">
            <h2>Profile</h2>
            {!editing && (
              <button className="account-edit-btn" onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
          </div>

          <div className="account-field">
            <label>Email</label>
            <div className="account-field-value">{customer.email}</div>
          </div>

          <div className="account-field">
            <label>Name</label>
            {editing ? (
              <div className="account-edit-row">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                <button className="btn btn-gold" disabled={saving} onClick={handleSaveName}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="account-cancel-btn"
                  onClick={() => { setEditing(false); setName(customer.name || ""); }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="account-field-value">{customer.name || "Not set"}</div>
            )}
            {saveError && <div className="auth-error" style={{ marginTop: "8px" }}>{saveError}</div>}
          </div>

          <button className="account-logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>

        <div className="account-card">
          <div className="account-card-head">
            <h2>Order History</h2>
          </div>
          <div className="account-empty-state">
            <p>You haven't placed any orders yet.</p>
            <a href="/products" className="btn btn-gold" style={{ display: "inline-block", marginTop: "12px" }}>
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}