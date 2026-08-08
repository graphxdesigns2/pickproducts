'use client';

export default function OrdersPage() {
  // No Orders collection exists yet, so this shows an empty state.
  // Once orders are recorded in Payload, fetch and map over them here.
  const orders = [];

  return (
    <section id="orders" className="account-card">
      <div className="card-header">
        <h2>My Orders</h2>
        <p>Track current orders and review your past purchases.</p>
      </div>
      <div id="order-history" className="order-list">
        {orders.length === 0 ? (
          <p style={{ color: '#9aa3b5', fontSize: '14px' }}>
            You haven't placed any orders yet.
          </p>
        ) : (
          orders.map((order) => (
            <div className="order-item" key={order.id}>
              <div className="order-details">
                <span className="order-number">Order #{order.id}</span>
                <span className="order-date">Placed on {order.date}</span>
              </div>
              <div className="order-meta">
                <span className="badge badge-success">{order.status}</span>
                <span className="order-total">${order.total}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
